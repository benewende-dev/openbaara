import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getPublished, listPublished, localize } from "@/lib/journal/articles";
import { CATEGORIES, readingMinutes } from "@/lib/journal/format";
import { getVenture } from "@/data/ventures";
import { COMPANY } from "@/data/studio";
import { ArticleBody } from "@/components/journal/ArticleBody";
import { JsonLd } from "@/components/journal/JsonLd";
import { Arrow } from "@/components/site/Arrow";

export const dynamic = "force-dynamic";

const SITE = `https://${COMPANY.site}`;

const COPY = {
  fr: {
    crumb: "Fil d'Ariane", journal: "Journal", summary: "L'essentiel", faq: "Questions fréquentes", min: (n: number) => `${n} min de lecture`,
    by: "Par", updated: "Mis à jour le", venture: "La venture", more: "À lire aussi", contact: "Une question sur ce sujet ?", write: "Écrivez-nous",
    onlyFr: "Cet article n'existe qu'en français.",
  },
  en: {
    crumb: "Breadcrumb", journal: "Journal", summary: "Key points", faq: "Frequently asked questions", min: (n: number) => `${n} min read`,
    by: "By", updated: "Updated on", venture: "The venture", more: "Read next", contact: "A question about this?", write: "Write to us",
    onlyFr: "This article is only available in French.",
  },
};

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = await getPublished(slug);
  if (!raw) return {};
  const lang = locale === "en" ? "en" : "fr";
  const a = localize(raw, lang);
  const hasEn = Boolean(raw.titleEn && raw.bodyEn);
  return {
    title: a.title,
    description: a.excerpt,
    authors: [{ name: a.authorName }],
    alternates: {
      canonical: `/${a.lang}/journal/${a.slug}`,
      languages: hasEn ? { fr: `/fr/journal/${a.slug}`, en: `/en/journal/${a.slug}` } : { fr: `/fr/journal/${a.slug}` },
    },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      publishedTime: a.publishedAt!.toISOString(),
      modifiedTime: a.updatedAt.toISOString(),
      authors: [a.authorName],
      section: CATEGORIES[a.category]?.[lang],
      siteName: "OpenBaara",
      locale: a.lang === "en" ? "en_US" : "fr_FR",
    },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { locale, slug } = await params;
  const lang = locale === "en" ? "en" : "fr";
  const c = COPY[lang];
  const raw = await getPublished(slug);
  if (!raw) notFound();
  const a = localize(raw, lang);
  const venture = a.ventureSlug ? getVenture(a.ventureSlug) : undefined;
  const more = (await listPublished(a.category)).filter((o) => o.id !== a.id).slice(0, 3).map((o) => localize(o, lang));
  const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "fr-FR", { dateStyle: "long", timeZone: "Africa/Abidjan" });
  const url = `${SITE}/${a.lang}/journal/${a.slug}`;
  const edited = a.updatedAt.getTime() - a.publishedAt!.getTime() > 86_400_000;

  return (
    <article className="wrap flex flex-col gap-10 pt-10 pb-24 md:pt-14" lang={a.lang}>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: a.title,
            description: a.excerpt,
            inLanguage: a.lang,
            datePublished: a.publishedAt!.toISOString(),
            dateModified: a.updatedAt.toISOString(),
            mainEntityOfPage: url,
            url,
            articleSection: CATEGORIES[a.category]?.[a.lang],
            wordCount: a.body.split(/\s+/).length,
            author: { "@type": "Person", name: a.authorName, url: `${SITE}/${a.lang}/societe` },
            publisher: { "@type": "Organization", name: "OpenBaara", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/icon-512.png` } },
            ...(venture ? { about: { "@type": "Organization", name: venture.name, url: `${SITE}/${a.lang}/ventures/${venture.slug}` } } : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "OpenBaara", item: `${SITE}/${a.lang}` },
              { "@type": "ListItem", position: 2, name: c.journal, item: `${SITE}/${a.lang}/journal` },
              { "@type": "ListItem", position: 3, name: a.title, item: url },
            ],
          },
          ...(a.faq.length
            ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: a.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
            : []),
        ]}
      />

      <nav aria-label={c.crumb} className="small muted" lang={lang}>
        <Link href="/journal" className="link !text-[var(--muted)]">{c.journal}</Link> /{" "}
        <Link href={{ pathname: "/journal", query: { categorie: a.category } }} className="link !text-[var(--muted)]">{CATEGORIES[a.category]?.[lang]}</Link>
      </nav>

      <header className="flex max-w-[860px] flex-col gap-5">
        <h1 className="h1">{a.title}</h1>
        <p className="small muted m-0">
          {c.by} {a.authorName} · <time dateTime={a.publishedAt!.toISOString()}>{date.format(a.publishedAt!)}</time>
          {edited && <> · {c.updated} <time dateTime={a.updatedAt.toISOString()}>{date.format(a.updatedAt)}</time></>} · {c.min(readingMinutes(a.body))}
        </p>
        {!a.translated && <p className="small muted m-0" lang="en">{c.onlyFr}</p>}
      </header>

      <section aria-label={c.summary} className="max-w-[760px] border-l-2 border-[var(--fg)] pl-5">
        <h2 className="label m-0 mb-2" lang={lang}>{c.summary}</h2>
        <p className="statement m-0 text-[var(--fg)]">{a.excerpt}</p>
      </section>

      <ArticleBody markdown={a.body} />

      {a.faq.length > 0 && (
        <section className="flex max-w-[760px] flex-col gap-6 border-t border-[var(--line)] pt-10">
          <h2 className="h2" lang={lang}>{c.faq}</h2>
          <dl className="m-0 flex flex-col gap-6">
            {a.faq.map((f) => (
              <div key={f.q} className="flex flex-col gap-2">
                <dt className="h3">{f.q}</dt>
                <dd className="body m-0">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <footer className="flex max-w-[760px] flex-col gap-8 border-t border-[var(--line)] pt-10" lang={lang}>
        {venture && (
          <Link href={`/ventures/${venture.slug}`} className="flex flex-col gap-1 no-underline">
            <span className="label">{c.venture}</span>
            <span className="h3 link self-start">{venture.name} <Arrow /></span>
            <span className="body small">{venture.line[lang]}</span>
          </Link>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <span className="body">{c.contact}</span>
          <Link href="/societe#contact" className="btn btn-s">{c.write}</Link>
        </div>
        {more.length > 0 && (
          <div className="flex flex-col gap-3">
            <span className="label">{c.more}</span>
            {more.map((o) => (
              <Link key={o.id} href={`/journal/${o.slug}`} className="link self-start" lang={o.lang}>{o.title} <Arrow /></Link>
            ))}
          </div>
        )}
      </footer>
    </article>
  );
}
