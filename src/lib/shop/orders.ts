// ─── Commandes : prix recalculés en base, paiement, ouverture des accès ───

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { providerFor, providers, type PaymentMethod, type ProviderId } from "@/lib/payments";
import {
  applyPromo,
  currentPrice,
  normalizeCode,
  roundXof,
  subtotal,
  type PricedLine,
  type PromoError,
  type Totals,
} from "./pricing";

export type CartItem = { slug: string; quantity: number };

export type CartError = "empty" | "invalid_item";

/** Lignes du panier au prix en vigueur. Seuls les produits publiés et payables en ligne passent. */
export async function priceCart(
  items: CartItem[],
  locale: "fr" | "en",
  now = new Date(),
): Promise<{ ok: true; lines: (PricedLine & { productId: string })[] } | { ok: false; error: CartError }> {
  if (!Array.isArray(items) || items.length === 0) return { ok: false, error: "empty" };
  const slugs = [...new Set(items.map((i) => String(i.slug)))];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, published: true, purchasable: true },
    include: { prices: { where: { validFrom: { lte: now } } } },
  });
  const lines: (PricedLine & { productId: string })[] = [];
  for (const item of items) {
    const p = products.find((x) => x.slug === item.slug);
    const price = p && currentPrice(p.prices, now);
    if (!p || price?.amountXof == null) return { ok: false, error: "invalid_item" };
    const quantity = p.kind === "course" ? 1 : Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1)));
    lines.push({ productId: p.id, slug: p.slug, name: locale === "en" ? p.nameEn : p.nameFr, unitXof: price.amountXof, quantity });
  }
  return { ok: true, lines };
}

/** Commandes payées par ce client avec ce code. */
async function customerUses(promoId: string, email?: string | null): Promise<number> {
  if (!email) return 0;
  return prisma.promoRedemption.count({
    where: { promoId, customer: { email: email.trim().toLowerCase() }, order: { status: "paid" } },
  });
}

export type QuoteResult =
  | { ok: true; lines: PricedLine[]; totals: Totals; promoCode: string | null; promoId: string | null }
  | { ok: false; error: CartError }
  | { ok: false; error: "promo"; promoError: PromoError | "unknown"; lines: PricedLine[]; totals: Totals };

/** Totaux du panier, avec le code promo s'il est valable. Utilisé pour l'aperçu et pour la commande. */
export async function quoteCart(input: {
  items: CartItem[];
  promoCode?: string | null;
  email?: string | null;
  locale: "fr" | "en";
  now?: Date;
}): Promise<QuoteResult> {
  const now = input.now ?? new Date();
  const priced = await priceCart(input.items, input.locale, now);
  if (!priced.ok) return priced;
  const lines = priced.lines;
  const sub = subtotal(lines);
  const plain: Totals = { subtotalXof: sub, discountXof: 0, totalXof: sub };

  const code = input.promoCode ? normalizeCode(input.promoCode) : "";
  if (!code) return { ok: true, lines, totals: plain, promoCode: null, promoId: null };

  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo) return { ok: false, error: "promo", promoError: "unknown", lines, totals: plain };
  const r = applyPromo(lines, promo, now, promo.onePerCustomer ? await customerUses(promo.id, input.email) : 0);
  if (!r.ok) return { ok: false, error: "promo", promoError: r.error, lines, totals: plain };
  return { ok: true, lines, totals: r.totals, promoCode: promo.code, promoId: promo.id };
}

function newRef(): string {
  return `OB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export type CheckoutResult =
  | { ok: true; ref: string; redirectUrl?: string; qrPayload?: string }
  | { ok: false; error: string; promoError?: PromoError | "unknown" };

export async function createCheckout(input: {
  items: CartItem[];
  customer: { name: string; email: string; phone?: string | null };
  promoCode?: string | null;
  method: PaymentMethod;
  locale: "fr" | "en";
  baseUrl: string;
}): Promise<CheckoutResult> {
  const provider = providerFor(input.method);
  if (!provider.isConfigured()) return { ok: false, error: "not_configured" };

  const email = input.customer.email.trim().toLowerCase();
  const q = await quoteCart({ items: input.items, promoCode: input.promoCode, email, locale: input.locale });
  if (!q.ok) return q.error === "promo" ? { ok: false, error: "promo", promoError: q.promoError } : { ok: false, error: q.error };

  const totalXof = roundXof(q.totals.totalXof);
  if (totalXof < 100) return { ok: false, error: "amount_too_low" };

  const ref = newRef();
  const order = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { email },
      update: { name: input.customer.name, phone: input.customer.phone || undefined },
      create: { email, name: input.customer.name, phone: input.customer.phone || null },
    });
    return tx.order.create({
      data: {
        ref,
        customerId: customer.id,
        subtotalXof: q.totals.subtotalXof,
        discountXof: q.totals.discountXof,
        totalXof,
        promoCodeId: q.promoId,
        provider: provider.id,
        locale: input.locale,
        items: {
          create: q.lines.map((l) => ({
            productId: (l as PricedLine & { productId: string }).productId,
            name: l.name,
            unitXof: l.unitXof,
            quantity: l.quantity,
          })),
        },
      },
    });
  });

  const result = await provider.initiate({
    ref,
    amountXof: totalXof,
    description: `OpenBaara, ${q.lines.map((l) => `${l.quantity} × ${l.name}`).join(", ")}`,
    method: input.method,
    customer: { ...input.customer, email },
    returnUrl: `${input.baseUrl}/${input.locale}/checkout/retour?ref=${ref}`,
    notifyUrl: `${input.baseUrl}/api/payments/${provider.id}/notify`,
    locale: input.locale,
  });

  if (!result.ok) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "failed" } });
    return { ok: false, error: result.error === "not_configured" ? "not_configured" : "provider_failed" };
  }
  await prisma.payment.create({
    data: { orderId: order.id, provider: provider.id, providerRef: result.providerRef, amountXof: totalXof },
  });
  return { ok: true, ref, redirectUrl: result.redirectUrl, qrPayload: result.qrPayload };
}

export type ConfirmOutcome = {
  status: "paid" | "pending" | "failed" | "unknown" | "mismatch";
  newlyPaid: boolean;
  orderId?: string;
};

/**
 * Vérifie un paiement auprès du prestataire et met la commande à jour.
 * Idempotent : une notification rejouée, ou un client qui recharge la page de retour,
 * ne paie pas deux fois, n'ouvre pas deux fois les accès et ne compte pas deux fois le code promo.
 */
export async function confirmPayment(providerId: ProviderId, providerRef: string): Promise<ConfirmOutcome> {
  const payment = await prisma.payment.findUnique({ where: { providerRef }, include: { order: true } });
  if (!payment || payment.provider !== providerId) return { status: "unknown", newlyPaid: false };
  if (payment.order.status === "paid") return { status: "paid", newlyPaid: false, orderId: payment.orderId };

  const check = await providers[providerId].check(providerRef);
  const raw = (check.raw ?? null) as Prisma.InputJsonValue | null;

  if (check.status === "pending" || check.status === "unknown") {
    return { status: check.status, newlyPaid: false, orderId: payment.orderId };
  }
  if (check.status === "refused") {
    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "refused", raw: raw ?? undefined } }),
      prisma.order.updateMany({ where: { id: payment.orderId, status: "pending" }, data: { status: "failed" } }),
    ]);
    return { status: "failed", newlyPaid: false, orderId: payment.orderId };
  }

  // Accepté : le montant encaissé doit être celui de la commande.
  if (check.amountXof != null && check.amountXof !== payment.order.totalXof) {
    await prisma.payment.update({ where: { id: payment.id }, data: { raw: raw ?? undefined } });
    console.error(`Montant inattendu pour ${providerRef} : ${check.amountXof} au lieu de ${payment.order.totalXof}`);
    return { status: "mismatch", newlyPaid: false, orderId: payment.orderId };
  }

  const newlyPaid = await prisma.$transaction(async (tx) => {
    // Le passage pending → paid ne réussit qu'une fois, même avec deux notifications simultanées.
    const flipped = await tx.order.updateMany({
      where: { id: payment.orderId, status: { in: ["pending", "failed"] } },
      data: { status: "paid", paidAt: new Date() },
    });
    await tx.payment.update({ where: { id: payment.id }, data: { status: "accepted", raw: raw ?? undefined } });
    if (flipped.count === 0) return false;

    const order = await tx.order.findUniqueOrThrow({
      where: { id: payment.orderId },
      include: { items: { include: { product: true } } },
    });
    for (const item of order.items) {
      if (item.product.kind !== "course" && item.product.kind !== "tool") continue;
      await tx.entitlement.upsert({
        where: { customerId_productId: { customerId: order.customerId, productId: item.productId } },
        update: {},
        create: { customerId: order.customerId, productId: item.productId, orderId: order.id },
      });
    }
    if (order.promoCodeId) {
      await tx.promoRedemption.create({
        data: { promoId: order.promoCodeId, orderId: order.id, customerId: order.customerId },
      });
      await tx.promoCode.update({ where: { id: order.promoCodeId }, data: { usedCount: { increment: 1 } } });
    }
    return true;
  });

  return { status: "paid", newlyPaid, orderId: payment.orderId };
}

export async function orderStatusByRef(ref: string) {
  return prisma.order.findUnique({
    where: { ref },
    select: { ref: true, status: true, totalXof: true, provider: true, payments: { select: { providerRef: true } } },
  });
}
