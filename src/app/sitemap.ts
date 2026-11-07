import type { MetadataRoute } from "next";
import { ventures } from "@/data/ventures";
import { listPublished } from "@/lib/journal/articles";

export const dynamic = "force-dynamic";

const BASE = "https://openbaara.com";
const PAGES = ["", "/ventures", ...ventures.map((v) => `/ventures/${v.slug}`), "/societe", "/services", "/investisseurs", "/journal", "/academy", "/boutique", "/cv-generator", "/carrieres"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = PAGES.flatMap((path) =>
    ["fr", "en"].map((l) => ({
      url: `${BASE}/${l}${path}`,
      changeFrequency: (path === "" || path === "/journal" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "" ? 1 : path === "/journal" || path === "/investisseurs" ? 0.9 : 0.7,
      alternates: { languages: { fr: `${BASE}/fr${path}`, en: `${BASE}/en${path}` } },
    })),
  );
  const articles = (await listPublished()).flatMap((a) =>
    (a.titleEn && a.bodyEn ? ["fr", "en"] : ["fr"]).map((l) => ({
      url: `${BASE}/${l}/journal/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  );
  return [...pages, ...articles];
}
