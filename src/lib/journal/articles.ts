// ─── Journal : lecture des articles publiés ───

import "server-only";
import type { Article } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { FaqItem } from "./format";

export type Lang = "fr" | "en";

/** Version d'un article dans une langue ; l'anglais retombe sur le français s'il n'existe pas. */
export function localize(a: Article, lang: Lang) {
  const en = lang === "en" && Boolean(a.titleEn && a.bodyEn);
  return {
    ...a,
    lang: (en ? "en" : "fr") as Lang,
    title: en ? a.titleEn! : a.titleFr,
    excerpt: en ? (a.excerptEn ?? a.excerptFr) : a.excerptFr,
    body: en ? a.bodyEn! : a.bodyFr,
    faq: ((a.faq ?? []) as FaqItem[]).map((f) => ({ q: f.q[en ? "en" : "fr"], a: f.a[en ? "en" : "fr"] })),
    translated: lang === "fr" || en,
  };
}

export async function listPublished(category?: string) {
  return prisma.article.findMany({
    where: { status: "published", publishedAt: { lte: new Date() }, ...(category ? { category } : {}) },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublished(slug: string) {
  const a = await prisma.article.findUnique({ where: { slug } });
  if (!a || a.status !== "published" || !a.publishedAt || a.publishedAt > new Date()) return null;
  return a;
}
