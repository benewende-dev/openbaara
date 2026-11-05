import { formatXof } from "@/lib/shop/pricing";

export { formatXof };

const dt = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Abidjan" });
const d = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "Africa/Abidjan" });

export const fmtDateTime = (v: Date | null | undefined) => (v ? dt.format(v) : "");
export const fmtDate = (v: Date | null | undefined) => (v ? d.format(v) : "");

export const ORDER_STATUS = {
  pending: ["En attente", "warn"],
  paid: ["Payée", "ok"],
  failed: ["Échouée", "err"],
  cancelled: ["Annulée", ""],
  refunded: ["Remboursée", ""],
} as const;

export const QUOTE_STATUS = {
  new: "Nouvelles",
  call_scheduled: "Appel planifié",
  quote_sent: "Devis envoyé",
  signed: "Signé",
  lost: "Perdu",
} as const;

export const KIND = { course: "Cours", tool: "Outil", package: "Forfait", service: "Sur devis" } as const;

export const CATEGORY: Record<string, string> = {
  academy: "Academy",
  outils: "Outils",
  conseil: "Conseil",
  vitrine: "Site vitrine",
  ecommerce: "Boutique en ligne",
  mobile: "Application mobile",
  saas: "Logiciel et SaaS",
  ia: "Agents IA",
  maintenance: "Maintenance",
};
