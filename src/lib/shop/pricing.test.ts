import { describe, expect, it } from "vitest";
import { applyPromo, currentPrice, nextScheduledPrice, normalizeCode, type Promo } from "./pricing";

const d = (s: string) => new Date(s);
const now = d("2026-11-03T12:00:00Z");

const promo = (over: Partial<Promo> = {}): Promo => ({
  code: "LANCEMENT",
  kind: "percent",
  value: 15,
  productSlugs: [],
  startsAt: null,
  endsAt: null,
  maxUses: null,
  onePerCustomer: false,
  active: true,
  usedCount: 0,
  ...over,
});

const lines = [
  { slug: "course-prompt-engineering", name: "Prompt", unitXof: 60000, quantity: 1 },
  { slug: "course-cli-tools", name: "CLI", unitXof: 90000, quantity: 1 },
];

describe("currentPrice", () => {
  const prices = [
    { amountXof: 900000, validFrom: d("2026-01-01") },
    { amountXof: 950000, validFrom: d("2026-10-01") },
    { amountXof: 1050000, validFrom: d("2026-12-01") },
  ];

  it("prend le prix le plus récent déjà en vigueur", () => {
    expect(currentPrice(prices, now)?.amountXof).toBe(950000);
  });

  it("ignore un prix programmé dans le futur", () => {
    expect(nextScheduledPrice(prices, now)?.amountXof).toBe(1050000);
    expect(currentPrice(prices, d("2026-12-02"))?.amountXof).toBe(1050000);
  });

  it("ne renvoie rien avant le premier prix", () => {
    expect(currentPrice(prices, d("2025-01-01"))).toBeUndefined();
  });
});

describe("applyPromo", () => {
  it("applique un pourcentage sur tout le panier", () => {
    const r = applyPromo(lines, promo(), now);
    expect(r).toEqual({ ok: true, totals: { subtotalXof: 150000, discountXof: 22500, totalXof: 127500 } });
  });

  it("limite la remise aux produits visés", () => {
    const r = applyPromo(lines, promo({ value: 25, productSlugs: ["course-cli-tools"] }), now);
    expect(r.ok && r.totals.discountXof).toBe(22500);
  });

  it("ne dépasse jamais le montant éligible pour un montant fixe", () => {
    const r = applyPromo(lines, promo({ kind: "fixed", value: 500000, productSlugs: ["course-cli-tools"] }), now);
    expect(r.ok && r.totals).toEqual({ subtotalXof: 150000, discountXof: 90000, totalXof: 60000 });
  });

  it("refuse un code hors dates, épuisé, inactif ou déjà utilisé", () => {
    expect(applyPromo(lines, promo({ endsAt: d("2026-11-01") }), now)).toEqual({ ok: false, error: "expired" });
    expect(applyPromo(lines, promo({ startsAt: d("2026-12-01") }), now)).toEqual({ ok: false, error: "not_started" });
    expect(applyPromo(lines, promo({ maxUses: 10, usedCount: 10 }), now)).toEqual({ ok: false, error: "exhausted" });
    expect(applyPromo(lines, promo({ active: false }), now)).toEqual({ ok: false, error: "inactive" });
    expect(applyPromo(lines, promo({ onePerCustomer: true }), now, 1)).toEqual({ ok: false, error: "already_used" });
  });

  it("refuse un code qui ne vise aucun article du panier", () => {
    expect(applyPromo(lines, promo({ productSlugs: ["service-site-pro"] }), now)).toEqual({ ok: false, error: "not_applicable" });
  });

  it("arrondit la remise au multiple de 5", () => {
    const r = applyPromo([{ slug: "a", name: "A", unitXof: 7500, quantity: 1 }], promo({ value: 33 }), now);
    expect(r.ok && r.totals.discountXof).toBe(2475);
  });
});

describe("normalizeCode", () => {
  it("met en majuscules et retire les espaces", () => {
    expect(normalizeCode("  academy 25 ")).toBe("ACADEMY25");
  });
});
