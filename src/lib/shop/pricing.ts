// ─── Calcul des prix et des remises ───
// Fonctions pures, sans base : le serveur les appelle avec les données lues en base,
// et les tests les appellent directement. Le client n'envoie jamais un prix.

export type DatedPrice = { amountXof: number | null; validFrom: Date };

/** Prix en vigueur à `now` : le plus récent déjà entré en vigueur. `undefined` si aucun. */
export function currentPrice<T extends DatedPrice>(prices: T[], now: Date): T | undefined {
  let best: T | undefined;
  for (const p of prices) {
    if (p.validFrom.getTime() > now.getTime()) continue;
    if (!best || p.validFrom.getTime() > best.validFrom.getTime()) best = p;
  }
  return best;
}

/** Prochain changement programmé après `now`, s'il existe. */
export function nextScheduledPrice<T extends DatedPrice>(prices: T[], now: Date): T | undefined {
  let next: T | undefined;
  for (const p of prices) {
    if (p.validFrom.getTime() <= now.getTime()) continue;
    if (!next || p.validFrom.getTime() < next.validFrom.getTime()) next = p;
  }
  return next;
}

/** XOF : CinetPay exige un montant entier, multiple de 5. */
export function roundXof(amount: number): number {
  return Math.round(amount / 5) * 5;
}

export type PricedLine = { slug: string; name: string; unitXof: number; quantity: number };

export type Promo = {
  code: string;
  kind: "percent" | "fixed";
  value: number;
  productSlugs: string[];
  startsAt: Date | null;
  endsAt: Date | null;
  maxUses: number | null;
  onePerCustomer: boolean;
  active: boolean;
  usedCount: number;
};

export type PromoError =
  | "inactive"
  | "not_started"
  | "expired"
  | "exhausted"
  | "already_used"
  | "not_applicable";

export type Totals = { subtotalXof: number; discountXof: number; totalXof: number };

export function subtotal(lines: PricedLine[]): number {
  return lines.reduce((sum, l) => sum + l.unitXof * l.quantity, 0);
}

/**
 * Vérifie un code et calcule la remise. `customerUses` = nombre de commandes payées
 * par ce client avec ce code (compte seulement si le code est limité à un usage par client).
 */
export function applyPromo(
  lines: PricedLine[],
  promo: Promo,
  now: Date,
  customerUses = 0,
): { ok: true; totals: Totals } | { ok: false; error: PromoError } {
  if (!promo.active) return { ok: false, error: "inactive" };
  if (promo.startsAt && promo.startsAt.getTime() > now.getTime()) return { ok: false, error: "not_started" };
  if (promo.endsAt && promo.endsAt.getTime() < now.getTime()) return { ok: false, error: "expired" };
  if (promo.maxUses != null && promo.usedCount >= promo.maxUses) return { ok: false, error: "exhausted" };
  if (promo.onePerCustomer && customerUses > 0) return { ok: false, error: "already_used" };

  const eligible = promo.productSlugs.length
    ? lines.filter((l) => promo.productSlugs.includes(l.slug))
    : lines;
  const base = subtotal(eligible);
  if (base <= 0) return { ok: false, error: "not_applicable" };

  const raw = promo.kind === "percent" ? (base * Math.min(100, Math.max(0, promo.value))) / 100 : promo.value;
  const discountXof = Math.min(base, roundXof(Math.max(0, raw)));
  const sub = subtotal(lines);
  return { ok: true, totals: { subtotalXof: sub, discountXof, totalXof: sub - discountXof } };
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export const PROMO_ERROR_FR: Record<PromoError | "unknown", string> = {
  unknown: "Ce code n'existe pas.",
  inactive: "Ce code n'est plus actif.",
  not_started: "Ce code n'est pas encore valable.",
  expired: "Ce code a expiré.",
  exhausted: "Ce code a atteint son nombre d'utilisations.",
  already_used: "Vous avez déjà utilisé ce code.",
  not_applicable: "Ce code ne s'applique pas aux articles de votre panier.",
};

export const PROMO_ERROR_EN: Record<PromoError | "unknown", string> = {
  unknown: "This code does not exist.",
  inactive: "This code is no longer active.",
  not_started: "This code is not valid yet.",
  expired: "This code has expired.",
  exhausted: "This code has reached its usage limit.",
  already_used: "You have already used this code.",
  not_applicable: "This code does not apply to the items in your cart.",
};

export function formatXof(amount: number | null): string {
  if (amount == null) return "Sur devis";
  return `${new Intl.NumberFormat("fr-FR").format(amount).replace(/ | /g, " ")} F CFA`;
}
