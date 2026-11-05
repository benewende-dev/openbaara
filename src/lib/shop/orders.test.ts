// Parcours complet sur une vraie base de test : commande, paiement confirmé deux fois,
// accès ouverts une seule fois, code promo compté une seule fois.
// Lancer avec TEST_DATABASE_URL (sinon ces tests sont ignorés).

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const url = process.env.TEST_DATABASE_URL;
if (url) process.env.DATABASE_URL = url;

const check = vi.fn();
vi.mock("@/lib/payments", () => {
  const fake = {
    id: "cinetpay",
    isConfigured: () => true,
    initiate: async (i: { ref: string }) => ({ ok: true, providerRef: i.ref, redirectUrl: "https://pay.test/" + i.ref }),
    check: (ref: string) => check(ref),
  };
  return { providers: { cinetpay: fake, pispi: fake }, providerFor: () => fake, availableMethods: () => ["mobile_money"] };
});

const { prisma } = await import("@/lib/db");
const { createCheckout, confirmPayment, quoteCart } = await import("./orders");

describe.skipIf(!url)("commande et paiement", () => {
  beforeAll(async () => {
    await prisma.$executeRawUnsafe(
      "TRUNCATE products, prices, promo_codes, customers, orders, order_items, payments, promo_redemptions, entitlements CASCADE",
    );
    await prisma.product.create({
      data: {
        slug: "course-a", kind: "course", category: "academy", nameFr: "Cours A", nameEn: "Course A", published: true,
        prices: { create: [{ amountXof: 60000, validFrom: new Date("2026-01-01") }, { amountXof: 99000, validFrom: new Date("2099-01-01") }] },
      },
    });
    await prisma.product.create({
      data: { slug: "service-x", kind: "package", category: "vitrine", nameFr: "Site", nameEn: "Site", published: true, purchasable: false,
        prices: { create: { amountXof: 450000, validFrom: new Date("2026-01-01") } } },
    });
    await prisma.promoCode.create({ data: { code: "LANCEMENT", kind: "percent", value: 15, maxUses: 1, onePerCustomer: true } });
  });
  beforeEach(() => check.mockReset());
  afterAll(() => prisma.$disconnect());

  const base = {
    items: [{ slug: "course-a", quantity: 3 }],
    customer: { name: "Awa Koné", email: "Awa@Example.com", phone: "0700000000" },
    method: "mobile_money" as const,
    locale: "fr" as const,
    baseUrl: "http://localhost:3000",
  };

  it("refuse un forfait qui n'est pas payable en ligne", async () => {
    expect(await quoteCart({ items: [{ slug: "service-x", quantity: 1 }], locale: "fr" })).toEqual({ ok: false, error: "invalid_item" });
  });

  it("calcule le prix en vigueur, la remise, et ignore la quantité d'un cours", async () => {
    const r = await createCheckout({ ...base, promoCode: "lancement" });
    expect(r.ok).toBe(true);
    const order = await prisma.order.findUniqueOrThrow({ where: { ref: (r as { ref: string }).ref }, include: { items: true } });
    expect(order).toMatchObject({ subtotalXof: 60000, discountXof: 9000, totalXof: 51000, status: "pending" });
    expect(order.items[0].quantity).toBe(1);

    // Un montant différent n'ouvre rien.
    check.mockResolvedValue({ status: "accepted", amountXof: 50000 });
    expect((await confirmPayment("cinetpay", order.ref)).status).toBe("mismatch");

    // Deux confirmations : une seule ouvre les accès et compte le code.
    check.mockResolvedValue({ status: "accepted", amountXof: 51000 });
    const [a, b] = await Promise.all([confirmPayment("cinetpay", order.ref), confirmPayment("cinetpay", order.ref)]);
    expect([a.newlyPaid, b.newlyPaid].filter(Boolean)).toHaveLength(1);
    expect(await prisma.entitlement.count()).toBe(1);
    expect((await prisma.promoCode.findUniqueOrThrow({ where: { code: "LANCEMENT" } })).usedCount).toBe(1);
  });

  it("refuse ensuite le code épuisé", async () => {
    const r = await createCheckout({ ...base, promoCode: "LANCEMENT" });
    expect(r).toMatchObject({ ok: false, error: "promo", promoError: "exhausted" });
  });

  it("marque la commande en échec quand le prestataire refuse", async () => {
    const r = await createCheckout(base);
    check.mockResolvedValue({ status: "refused" });
    const out = await confirmPayment("cinetpay", (r as { ref: string }).ref);
    expect(out.status).toBe("failed");
  });
});
