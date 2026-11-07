import { listPublished, localize } from "@/lib/journal/articles";
import { CATEGORIES } from "@/lib/journal/format";
import { COMPANY } from "@/data/studio";

export const dynamic = "force-dynamic";

const SITE = `https://${COMPANY.site}`;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Flux RSS du Journal, dans la langue de la route. */
export async function GET(_: Request, { params }: { params: Promise<{ locale: string }> }) {
  const lang = (await params).locale === "en" ? "en" : "fr";
  const articles = (await listPublished()).map((a) => localize(a, lang));
  const items = articles
    .map((a) => {
      const url = `${SITE}/${a.lang}/journal/${a.slug}`;
      return `<item><title>${esc(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${a.publishedAt!.toUTCString()}</pubDate><category>${esc(CATEGORIES[a.category]?.[lang] ?? a.category)}</category><dc:creator>${esc(a.authorName)}</dc:creator><description>${esc(a.excerpt)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>OpenBaara · Journal</title><link>${SITE}/${lang}/journal</link><atom:link href="${SITE}/${lang}/journal/rss.xml" rel="self" type="application/rss+xml"/><description>${lang === "fr" ? "Le journal du studio de ventures OpenBaara, Abidjan." : "The journal of the OpenBaara venture studio, Abidjan."}</description><language>${lang}</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=900" } });
}
