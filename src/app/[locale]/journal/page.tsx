import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { listPublished, localize } from "@/lib/journal/articles";
import { CATEGORIES, readingMinutes } from "@/lib/journal/format";
import { Arrow } from "@/components/site/Arrow";
import { langOf } from "@/components/site/lang";

export const dynamic = "force-dynamic";

const COPY = {
  fr: {
    title: "Journal",
    lead: "Ce que nous apprenons en construisant des entreprises technologiques en Afrique de l'Ouest : méthode, intelligence artificielle, paiements, et l'avancement des ventures.",
    all: "Tous", empty: "Les premiers articles arrivent bientôt.", inFrench: "", min: (n: number) => `${n} min`, rss: "Flux RSS",
  },
  en: {
    title: "Journal",
    lead: "What we learn building technology companies in West Africa: method, artificial intelligence, payments, and how the ventures are progressing.",
    all: "All", empty: "The first articles are coming soon.", inFrench: "In French", min: (n: number) => `${n} min`, rss: "RSS feed",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const lang = await langOf(params);
  const c = COPY[lang];
  return {
    title: c.title,
    description: c.lead,
    alternates: { canonical: `/${lang}/journal`, languages: { fr: "/fr/journal", en: "/en/journal" }, types: { "application/rss+xml": `/${lang}/journal/rss.xml` } },
  };
}

export default async function JournalPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ categorie?: string }> }) {
  const lang = await langOf(params);
  const c = COPY[lang];
  const { categorie } = await searchParams;
  const cat = categorie && CATEGORIES[categorie] ? categorie : undefined;
  const articles = (await listPublished(cat)).map((a) => localize(a, lang));
  const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { dateStyle: "long", timeZone: "Africa/Abidjan" });

  return (
    <div className="wrap flex flex-col gap-12 pt-16 pb-24 md:pt-20 md:pb-32">
      <div className="fade flex max-w-[760px] flex-col gap-5">
        <h1 className="h1">{c.title}</h1>
        <p className="lead">{c.lead}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <nav aria-label={c.title} className="tabs">
          <Link href="/journal" aria-current={!cat ? "page" : undefined} className="tab">{c.all}</Link>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <Link key={k} href={{ pathname: "/journal", query: { categorie: k } }} aria-current={cat === k ? "page" : undefined} className="tab">{v[lang]}</Link>
          ))}
        </nav>
        <a href={`/${lang}/journal/rss.xml`} className="link small">{c.rss}</a>
      </div>

      {articles.length === 0 ? (
        <p className="body">{c.empty}</p>
      ) : (
        <ol className="m-0 list-none p-0">
          {articles.map((a) => (
            <li key={a.id} className="border-b border-[var(--line)]">
              <Link href={`/journal/${a.slug}`} className="grid gap-3 py-8 no-underline md:grid-cols-[200px_1fr] md:gap-10">
                <span className="small muted flex flex-col gap-1">
                  <time dateTime={a.publishedAt!.toISOString()}>{date.format(a.publishedAt!)}</time>
                  <span>{CATEGORIES[a.category]?.[lang]} · {c.min(readingMinutes(a.body))}</span>
                  {!a.translated && <span lang="fr">{c.inFrench}</span>}
                </span>
                <span className="flex flex-col gap-2">
                  <span className="h3" style={{ fontSize: 24 }} lang={a.lang}>{a.title}</span>
                  <span className="body" lang={a.lang}>{a.excerpt}</span>
                  <span className="link small self-start">{lang === "fr" ? "Lire" : "Read"} <Arrow /></span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
