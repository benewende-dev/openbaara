import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://openbaara.com";
  const locales = ["fr", "en"];
  const paths = [
    "",
    "/a-propos",
    "/academy",
    "/baarali-labs",
    "/boutique",
    "/carrieres",
    "/contact",
    "/cv-generator",
    "/investisseurs",
    "/solutions",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : 0.8,
      });
    }
  }

  return sitemapEntries;
}
