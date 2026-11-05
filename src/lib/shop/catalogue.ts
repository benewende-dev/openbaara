// ─── Catalogue public, lu en base au prix en vigueur ───

import type { ProductKind } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { Product, ProductBadge, ProductCTA, ProductCategory, LocalizedText } from "@/data/products";
import { currentPrice } from "./pricing";

type Meta = {
  badge?: ProductBadge;
  cta?: ProductCTA;
  isMonthly?: boolean;
  level?: LocalizedText;
  duration?: LocalizedText;
  lessons?: number;
  tools?: string[];
  image?: string;
};

const CATEGORY: Record<ProductKind, ProductCategory> = {
  course: "course",
  tool: "tool",
  package: "service",
  service: "service",
};

/** Produits publiés au format attendu par la boutique et l'Academy. */
export async function getCatalogue(kinds?: ProductKind[], now = new Date()): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { published: true, ...(kinds ? { kind: { in: kinds } } : {}) },
    include: { prices: { where: { validFrom: { lte: now } } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((p) => {
    const meta = (p.meta ?? {}) as Meta;
    const price = currentPrice(p.prices, now)?.amountXof ?? null;
    return {
      id: p.slug,
      category: CATEGORY[p.kind],
      name: { fr: p.nameFr, en: p.nameEn },
      description: { fr: p.descriptionFr, en: p.descriptionEn },
      priceXOF: price,
      // Pas de taux fixe franc CFA / dollar : aucun équivalent affiché, il deviendrait faux au premier changement de prix.
      priceUSD: null,
      isMonthly: meta.isMonthly,
      badge: meta.badge ?? null,
      cta: meta.cta ?? (p.purchasable ? "buy" : "book-call"),
      image: meta.image,
      level: meta.level,
      duration: meta.duration,
      lessons: meta.lessons,
      tools: meta.tools,
    };
  });
}

export type ServicePackage = {
  slug: string;
  category: string;
  name: LocalizedText;
  priceXof: number | null;
  delivery: LocalizedText;
  audience: LocalizedText;
  features: LocalizedText[];
  recommended: boolean;
  isMonthly: boolean;
};

/** Forfaits de la page Services, au prix en vigueur. */
export async function getPackages(now = new Date()): Promise<ServicePackage[]> {
  const rows = await prisma.product.findMany({
    where: { published: true, kind: "package" },
    include: { prices: { where: { validFrom: { lte: now } } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map((p) => ({
    slug: p.slug,
    category: p.category,
    name: { fr: p.nameFr, en: p.nameEn },
    priceXof: currentPrice(p.prices, now)?.amountXof ?? null,
    delivery: { fr: p.deliveryFr ?? "", en: p.deliveryEn ?? "" },
    audience: { fr: p.audienceFr ?? "", en: p.audienceEn ?? "" },
    features: Array.isArray(p.features) ? (p.features as LocalizedText[]) : [],
    recommended: p.recommended,
    isMonthly: Boolean(((p.meta ?? {}) as Meta).isMonthly),
  }));
}
