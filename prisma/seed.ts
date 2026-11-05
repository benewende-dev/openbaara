// Remplissage initial : le catalogue écrit jusqu'ici dans src/data/products.ts,
// puis les forfaits de la page Services. Relançable sans risque : un produit existant
// n'est pas modifié et ne reçoit pas de second prix.

import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient, type ProductKind } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { products } from "../src/data/products";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }) });

type Seed = {
  slug: string;
  kind: ProductKind;
  category: string;
  nameFr: string;
  nameEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
  deliveryFr?: string;
  deliveryEn?: string;
  audienceFr?: string;
  audienceEn?: string;
  features?: { fr: string; en: string }[];
  meta?: Record<string, unknown>;
  recommended?: boolean;
  purchasable: boolean;
  priceXof: number | null;
};

const KIND = { course: "course", tool: "tool", service: "service" } as const;

const fromCatalogue: Seed[] = products.map((p) => ({
  slug: p.id,
  kind: KIND[p.category],
  category: p.category === "course" ? "academy" : p.category === "tool" ? "outils" : "conseil",
  nameFr: p.name.fr,
  nameEn: p.name.en,
  descriptionFr: p.description.fr,
  descriptionEn: p.description.en,
  meta: {
    badge: p.badge,
    cta: p.cta,
    priceUsd: p.priceUSD ?? undefined,
    isMonthly: p.isMonthly,
    level: p.level,
    duration: p.duration,
    lessons: p.lessons,
    tools: p.tools,
    image: p.image,
  },
  purchasable: p.cta === "buy" && p.priceXOF != null,
  priceXof: p.priceXOF,
}));

// Forfaits de la page Services : prix « à partir de », payés par étapes après signature du devis.
const f = (fr: string, en: string) => ({ fr, en });
type Pack = [slug: string, category: string, nameFr: string, nameEn: string, price: number | null, delayFr: string, delayEn: string, forFr: string, forEn: string, features: { fr: string; en: string }[], reco: boolean];
const packages: Pack[] = [
  ["service-vitrine-essentiel", "vitrine", "Site vitrine Essentiel", "Showcase website, Essential", 450000, "3 semaines", "3 weeks", "Petites entreprises, indépendants", "Small businesses, freelancers",
    [f("Jusqu'à 5 pages", "Up to 5 pages"), f("Design sur mesure, mobile d'abord", "Custom, mobile-first design"), f("Formulaire de contact et bouton WhatsApp", "Contact form and WhatsApp button"), f("Référencement de base", "Basic SEO"), f("Hébergement et domaine la première année", "Hosting and domain for the first year")], false],
  ["service-vitrine-pro", "vitrine", "Site vitrine Pro", "Showcase website, Pro", 950000, "5 semaines", "5 weeks", "Entreprises établies", "Established companies",
    [f("Jusqu'à 12 pages, français et anglais", "Up to 12 pages, French and English"), f("Blog ou actualités modifiables", "Editable blog or news"), f("Prise de rendez-vous en ligne", "Online booking"), f("Référencement complet et statistiques", "Full SEO and analytics"), f("Formation de votre équipe", "Team training")], true],
  ["service-ecommerce-boutique", "ecommerce", "Boutique en ligne", "Online store", 1500000, "6 semaines", "6 weeks", "Jusqu'à 150 produits", "Up to 150 products",
    [f("Catalogue, panier et compte client", "Catalogue, cart and customer accounts"), f("Paiement Mobile Money et carte", "Mobile Money and card payments"), f("Gestion des stocks et des commandes", "Stock and order management"), f("Notifications WhatsApp et e-mail", "WhatsApp and email notifications"), f("Tableau de bord des ventes", "Sales dashboard")], true],
  ["service-ecommerce-commerce", "ecommerce", "Commerce en ligne", "E-commerce platform", 3200000, "9 semaines", "9 weeks", "Catalogue large, plusieurs points de vente", "Large catalogue, several outlets",
    [f("Produits illimités, variantes et promotions", "Unlimited products, variants and promotions"), f("Plusieurs entrepôts ou boutiques", "Several warehouses or shops"), f("Livraison intégrée avec suivi", "Built-in delivery tracking"), f("Programme de fidélité", "Loyalty programme"), f("Application mobile en option", "Optional mobile app")], false],
  ["service-mobile-lancement", "mobile", "Application mobile Lancement", "Mobile app, Launch", 6500000, "10 à 12 semaines", "10 to 12 weeks", "Un premier produit à tester", "A first product to test",
    [f("iPhone et Android, un seul code", "iPhone and Android, one codebase"), f("Comptes, notifications, paiement", "Accounts, notifications, payments"), f("Back-office web pour votre équipe", "Web back office for your team"), f("Publication sur les stores", "App store publishing"), f("3 mois de corrections inclus", "3 months of fixes included")], true],
  ["service-mobile-sur-mesure", "mobile", "Application mobile sur mesure", "Custom mobile app", null, "Selon le cadrage", "After scoping", "Produits complexes", "Complex products",
    [f("Fonctionnement hors ligne", "Offline mode"), f("Géolocalisation et suivi en direct", "Geolocation and live tracking"), f("Intégrations avec vos systèmes", "Integrations with your systems"), f("Sécurité renforcée", "Hardened security"), f("Équipe dédiée", "Dedicated team")], false],
  ["service-saas-mvp", "saas", "Logiciel, produit minimum", "Software, minimum product", 8000000, "12 à 16 semaines", "12 to 16 weeks", "Valider un marché", "Validate a market",
    [f("Comptes, rôles et équipes", "Accounts, roles and teams"), f("Abonnements et facturation", "Subscriptions and billing"), f("Tableau de bord et exports", "Dashboard and exports"), f("Hébergement et sauvegardes", "Hosting and backups"), f("Documentation et passation", "Documentation and handover")], true],
  ["service-saas-plateforme", "saas", "Logiciel, plateforme", "Software, platform", null, "Selon le cadrage", "After scoping", "Logiciels critiques", "Critical software",
    [f("Multi-entreprises et cloisonnement", "Multi-tenant isolation"), f("API pour vos partenaires", "Partner API"), f("Audit de sécurité", "Security audit"), f("Haute disponibilité", "High availability"), f("Support avec engagement de délai", "Support with response-time commitment")], false],
  ["service-ia-agent", "ia", "Agent métier", "Business agent", 1200000, "4 semaines", "4 weeks", "Une tâche précise", "One specific task",
    [f("Un agent sur un processus", "One agent on one process"), f("WhatsApp, e-mail ou site web", "WhatsApp, email or website"), f("Connexion à vos documents", "Connected to your documents"), f("Validation humaine des actions", "Human approval of actions"), f("Suivi des coûts et de la qualité", "Cost and quality tracking")], true],
  ["service-ia-souverain", "ia", "Déploiement IA souverain", "Sovereign AI deployment", null, "Selon le cadrage", "After scoping", "Données sensibles", "Sensitive data",
    [f("Modèles hébergés chez vous", "Models hosted on your premises"), f("Plusieurs agents et supervision", "Several agents and monitoring"), f("Journal d'audit complet", "Full audit log"), f("Formation des équipes", "Team training"), f("Fondé sur Baarali Entreprise", "Built on Baarali Enterprise")], false],
  ["service-maintenance-site", "maintenance", "Maintenance de site", "Website maintenance", 45000, "Mensuel, sans engagement", "Monthly, no commitment", "Sites vitrines et blogs", "Showcase sites and blogs",
    [f("Hébergement et certificat de sécurité", "Hosting and SSL certificate"), f("Mises à jour et sauvegardes", "Updates and backups"), f("Petites modifications, 2 h par mois", "Small changes, 2 h per month"), f("Surveillance de disponibilité", "Uptime monitoring"), f("Rapport mensuel", "Monthly report")], true],
  ["service-maintenance-application", "maintenance", "Maintenance d'application", "Application maintenance", 180000, "Mensuel, engagement 6 mois", "Monthly, 6-month commitment", "Boutiques, applications, logiciels", "Stores, apps, software",
    [f("Hébergement adapté à la charge", "Load-appropriate hosting"), f("Corrections prioritaires", "Priority fixes"), f("8 h d'évolutions par mois", "8 h of improvements per month"), f("Surveillance des erreurs", "Error monitoring"), f("Point mensuel", "Monthly review")], false],
];

const fromServices: Seed[] = packages.map(([slug, category, nameFr, nameEn, price, deliveryFr, deliveryEn, audienceFr, audienceEn, features, recommended]) => ({
  slug, kind: "package", category, nameFr, nameEn, deliveryFr, deliveryEn, audienceFr, audienceEn, features, recommended,
  meta: { isMonthly: category === "maintenance" },
  purchasable: false,
  priceXof: price,
}));

async function main() {
  const all = [...fromCatalogue, ...fromServices];
  let created = 0;
  for (const [i, s] of all.entries()) {
    const exists = await prisma.product.findUnique({ where: { slug: s.slug } });
    if (exists) continue;
    await prisma.product.create({
      data: {
        slug: s.slug,
        kind: s.kind,
        category: s.category,
        nameFr: s.nameFr,
        nameEn: s.nameEn,
        descriptionFr: s.descriptionFr ?? "",
        descriptionEn: s.descriptionEn ?? "",
        deliveryFr: s.deliveryFr,
        deliveryEn: s.deliveryEn,
        audienceFr: s.audienceFr,
        audienceEn: s.audienceEn,
        features: s.features ?? [],
        meta: JSON.parse(JSON.stringify(s.meta ?? {})),
        recommended: s.recommended ?? false,
        purchasable: s.purchasable,
        published: true,
        sortOrder: i,
        prices: { create: { amountXof: s.priceXof, validFrom: new Date("2026-01-01T00:00:00Z"), note: "Prix initial" } },
      },
    });
    created++;
  }
  console.log(`${created} produit(s) créé(s), ${all.length - created} déjà présent(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
