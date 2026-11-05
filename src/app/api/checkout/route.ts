import { NextResponse } from "next/server";
import { z } from "zod";
import { createCheckout } from "@/lib/shop/orders";
import { PROMO_ERROR_EN, PROMO_ERROR_FR } from "@/lib/shop/pricing";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { siteBaseUrl } from "@/lib/site-url";

const Body = z.object({
  items: z.array(z.object({ id: z.string().min(1), quantity: z.number().int().min(1).max(99) })).min(1).max(50),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(40).optional(),
  }),
  promoCode: z.string().max(40).optional(),
  method: z.enum(["pispi", "mobile_money", "card"]),
  locale: z.enum(["fr", "en"]).default("fr"),
});

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "checkout"), { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(rl.retryAfter) } });
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const b = parsed.data;

  const result = await createCheckout({
    items: b.items.map((i) => ({ slug: i.id, quantity: i.quantity })),
    customer: b.customer,
    promoCode: b.promoCode,
    method: b.method,
    locale: b.locale,
    baseUrl: siteBaseUrl(request),
  });

  if (!result.ok) {
    const status = result.error === "not_configured" ? 503 : result.error === "provider_failed" ? 502 : 400;
    const message = result.promoError ? (b.locale === "en" ? PROMO_ERROR_EN : PROMO_ERROR_FR)[result.promoError] : undefined;
    return NextResponse.json({ error: result.error, message }, { status });
  }
  return NextResponse.json({ ref: result.ref, url: result.redirectUrl, qr: result.qrPayload });
}
