import { NextResponse } from "next/server";
import { products } from "@/data/products";
import {
  isCinetPayConfigured,
  initiateCinetPayPayment,
  normalizeXof,
} from "@/lib/payments/cinetpay";
import { rateLimit, clientKey } from "@/lib/rate-limit";

type IncomingItem = { id?: string; quantity?: number };

function siteBaseUrl(request: Request): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : "";
}

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "cinetpay-initiate"), { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: { items?: IncomingItem[]; customer?: { name?: string; email?: string; phone?: string }; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { items, customer } = body;
  const name = customer?.name?.trim();
  const email = customer?.email?.trim();
  const phone = customer?.phone?.trim();
  const locale = body.locale === "en" ? "en" : "fr";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name || !email || !phone || !emailRegex.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  // ── Prix recalculé côté serveur depuis le catalogue (jamais le client) ──
  let amount = 0;
  const lines: string[] = [];
  for (const it of items) {
    const product = products.find((p) => p.id === it.id);
    const qty = Math.max(1, Math.min(99, Math.floor(Number(it.quantity) || 0)));
    if (!product || product.priceXOF == null) {
      return NextResponse.json({ error: "invalid_item" }, { status: 400 });
    }
    amount += product.priceXOF * qty;
    lines.push(`${qty}× ${product.nameKey}`);
  }

  amount = normalizeXof(amount);
  if (amount < 100) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!isCinetPayConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const transactionId = `OB-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const base = siteBaseUrl(request);
  const metadata = JSON.stringify({ customer: { name, email, phone }, lines }).slice(0, 240);

  const result = await initiateCinetPayPayment({
    transactionId,
    amount,
    description: `OpenBaara — ${lines.join(", ")}`.slice(0, 240),
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    returnUrl: `${base}/${locale}/checkout/retour?id=${transactionId}`,
    notifyUrl: `${base}/api/payments/cinetpay/notify`,
    metadata,
  });

  if (!result.ok) {
    if (result.error === "not_configured") {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    console.error("CinetPay initiate failed:", result.error);
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }

  return NextResponse.json({ url: result.url, transactionId }, { status: 200 });
}
