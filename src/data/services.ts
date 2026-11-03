// ─── Page Services : présentation des types de projet et estimateur ───
// Les forfaits et leurs prix sont en base (console /admin) ; ce fichier porte les textes
// et les paramètres de l'estimation, qui reste indicative.

type T = { fr: string; en: string };
const t = (fr: string, en: string): T => ({ fr, en });

export const SERVICE_CATEGORIES = ["vitrine", "ecommerce", "mobile", "saas", "ia", "maintenance"] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

export const CATEGORY_TEXT: Record<ServiceCategory, { title: T; intro: T; examples: T }> = {
  vitrine: {
    title: t("Site vitrine", "Showcase website"),
    intro: t("Présenter votre activité, être trouvé sur Google et recevoir des demandes de clients.", "Present your business, be found on Google and receive enquiries from customers."),
    examples: t("cabinet, restaurant, école, ONG", "firm, restaurant, school, NGO"),
  },
  ecommerce: {
    title: t("Boutique en ligne", "Online store"),
    intro: t("Vendre en ligne et encaisser en Mobile Money, avec la livraison suivie.", "Sell online and collect by Mobile Money, with tracked delivery."),
    examples: t("mode, cosmétique, épicerie fine, pièces auto", "fashion, cosmetics, fine food, car parts"),
  },
  mobile: {
    title: t("Application mobile", "Mobile app"),
    intro: t("Une application iPhone et Android pensée pour les connexions lentes et les téléphones modestes.", "An iPhone and Android app designed for slow connections and modest phones."),
    examples: t("réservation, livraison, fidélité, terrain", "booking, delivery, loyalty, field work"),
  },
  saas: {
    title: t("Logiciel et SaaS", "Software and SaaS"),
    intro: t("Un logiciel métier ou un produit SaaS avec abonnements, construit sur nos briques éprouvées.", "Business software or a SaaS product with subscriptions, built on our proven building blocks."),
    examples: t("gestion, facturation, RH, plateforme B2B", "management, invoicing, HR, B2B platform"),
  },
  ia: {
    title: t("Agents IA et automatisation", "AI agents and automation"),
    intro: t("Des agents qui prennent en charge les tâches répétitives, avec une validation humaine.", "Agents that take on repetitive tasks, with human approval."),
    examples: t("devis, relances, service client, tri de documents", "quotes, reminders, customer service, document sorting"),
  },
  maintenance: {
    title: t("Maintenance et hébergement", "Maintenance and hosting"),
    intro: t("Après la mise en ligne, nous gardons votre produit rapide, sûr et à jour.", "After launch, we keep your product fast, secure and up to date."),
    examples: t("sites, boutiques, applications existantes", "websites, stores, existing apps"),
  },
};

export type EstimateType = Exclude<ServiceCategory, "maintenance">;

/** Paramètres : unité de taille, taille max, base, coût par unité, délai min/max en semaines. */
export const ESTIMATE_TYPES: Record<EstimateType, { label: T; unit: T; max: number; base: number; perUnit: number; weeks: [number, number] }> = {
  vitrine: { label: t("Site vitrine", "Website"), unit: t("Pages", "Pages"), max: 20, base: 300000, perUnit: 40000, weeks: [3, 6] },
  ecommerce: { label: t("Boutique en ligne", "Online store"), unit: t("Produits (par dizaine)", "Products (in tens)"), max: 50, base: 1200000, perUnit: 30000, weeks: [5, 10] },
  mobile: { label: t("Application mobile", "Mobile app"), unit: t("Écrans principaux", "Main screens"), max: 40, base: 4500000, perUnit: 150000, weeks: [9, 16] },
  saas: { label: t("Logiciel ou SaaS", "Software or SaaS"), unit: t("Modules", "Modules"), max: 15, base: 6000000, perUnit: 600000, weeks: [12, 24] },
  ia: { label: t("Agent IA", "AI agent"), unit: t("Processus automatisés", "Automated processes"), max: 10, base: 900000, perUnit: 350000, weeks: [3, 8] },
};

export const ESTIMATE_OPTIONS: { id: string; label: T; weight: number }[] = [
  { id: "bilingue", label: t("Français et anglais", "French and English"), weight: 0.15 },
  { id: "paiement", label: t("Paiement Mobile Money", "Mobile Money payment"), weight: 0.12 },
  { id: "comptes", label: t("Comptes clients", "Customer accounts"), weight: 0.15 },
  { id: "whatsapp", label: t("Intégration WhatsApp", "WhatsApp integration"), weight: 0.08 },
  { id: "contenu", label: t("Rédaction des contenus", "Copywriting"), weight: 0.1 },
  { id: "seo", label: t("Référencement avancé", "Advanced SEO"), weight: 0.08 },
];

const round = (n: number) => Math.round(n / 50000) * 50000;

/** Fourchette indicative et délai, recalculés à l'identique pour l'affichage et la demande de devis. */
export function estimate(type: EstimateType, size: number, options: string[]) {
  const p = ESTIMATE_TYPES[type];
  const s = Math.max(1, Math.min(Math.round(size), p.max));
  const factor = 1 + ESTIMATE_OPTIONS.filter((o) => options.includes(o.id)).reduce((a, o) => a + o.weight, 0);
  const mid = (p.base + p.perUnit * s) * factor;
  const weeks = Math.round(p.weeks[0] + (p.weeks[1] - p.weeks[0]) * (s / p.max) + (factor - 1) * 4);
  return { size: s, lo: round(mid * 0.85), hi: round(mid * 1.2), weeksLo: weeks, weeksHi: weeks + 2 };
}

export const STEPS: { t: T; d: T; w: T }[] = [
  { t: t("Cadrage", "Scoping"), d: t("Objectifs, contenus, devis détaillé.", "Goals, content, detailed quote."), w: t("1 semaine", "1 week") },
  { t: t("Maquettes", "Mock-ups"), d: t("Les écrans principaux, validés avec vous.", "The main screens, approved with you."), w: t("1 à 2 semaines", "1 to 2 weeks") },
  { t: t("Développement", "Development"), d: t("Une démo en ligne chaque semaine.", "An online demo every week."), w: t("Selon le forfait", "Depends on the package") },
  { t: t("Mise en ligne", "Launch"), d: t("Tests, formation, lancement.", "Testing, training, go-live."), w: t("1 semaine", "1 week") },
  { t: t("Suivi", "Follow-up"), d: t("Maintenance, statistiques, évolutions.", "Maintenance, analytics, improvements."), w: t("Mensuel", "Monthly") },
];

export const FAQ: { q: T; a: T }[] = [
  { q: t("Qui possède le code ?", "Who owns the code?"), a: t("Vous. Le code, les comptes et le nom de domaine sont à votre nom dès la mise en ligne.", "You do. The code, accounts and domain name are in your name from launch.") },
  { q: t("Comment se passe le paiement ?", "How does payment work?"), a: t("En trois fois : 40 % à la commande, 40 % à la démo, 20 % à la mise en ligne. Mobile Money ou virement, facture au nom de votre entreprise.", "In three instalments: 40% on order, 40% at the demo, 20% at launch. Mobile Money or bank transfer, invoiced to your company.") },
  { q: t("Et si le délai n'est pas tenu ?", "What if the deadline slips?"), a: t("Le calendrier est écrit dans le devis. Vous voyez une démo chaque semaine, donc un retard se voit tout de suite.", "The schedule is written into the quote. You see a demo every week, so any delay shows straight away.") },
  { q: t("Pouvez-vous reprendre un site existant ?", "Can you take over an existing site?"), a: t("Oui. Nous commençons par un audit, puis nous proposons une refonte ou une maintenance.", "Yes. We start with an audit, then propose a redesign or maintenance.") },
  { q: t("Travaillez-vous hors de Côte d'Ivoire ?", "Do you work outside Côte d'Ivoire?"), a: t("Oui, partout en Afrique de l'Ouest et avec la diaspora, en visio.", "Yes, across West Africa and with the diaspora, by video.") },
  { q: t("Que comprend la maintenance ?", "What does maintenance include?"), a: t("Hébergement, sécurité, sauvegardes, mises à jour et un volume d'heures d'évolution chaque mois.", "Hosting, security, backups, updates and a number of hours of improvements each month.") },
];
