import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteCart } from "@/lib/shop/orders";
import { PROMO_ERROR_EN, PROMO_ERROR_FR } from "@/lib/shop/pricing";
import { availableMethods } from "@/lib/payments";
import { rateLimit, clientKey } from "@/lib/rate-limit";

// Aperçu des totaux avant paiement : les montants affichés viennent toujours du serveur.
const Body = z.object({
  items: z.array(z.object({ id: z.string().min(1), quantity: z.number().int().min(1).max(99) })).min(1).max(50),
  promoCode: z.string().max(40).optional(),
  email: z.string().max(200).optional(),
  locale: z.enum(["fr", "en"]).default("fr"),
});

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "checkout-quote"), { limit: 30, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const b = parsed.data;

  const q = await quoteCart({
    items: b.items.map((i) => ({ slug: i.id, quantity: i.quantity })),
    promoCode: b.promoCode,
    email: b.email,
    locale: b.locale,
  });
  const methods = availableMethods();
  if (q.ok) return NextResponse.json({ totals: q.totals, promoCode: q.promoCode, methods });
  if (q.error === "promo") {
    const message = (b.locale === "en" ? PROMO_ERROR_EN : PROMO_ERROR_FR)[q.promoError];
    return NextResponse.json({ totals: q.totals, promoCode: null, promoError: message, methods });
  }
  return NextResponse.json({ error: q.error }, { status: 400 });
}
