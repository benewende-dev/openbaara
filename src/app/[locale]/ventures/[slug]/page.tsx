import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ventures, getVenture, STAGES } from "@/data/ventures";
import { Poster } from "@/components/site/Poster";
import { Arrow } from "@/components/site/Arrow";
import type { Lang } from "@/components/site/lang";

const COPY = {
  fr: {
    crumb: "Fil d'Ariane",
    others: "Autres ventures",
    sector: "Secteur", market: "Marché", stage: "Stade", site: "Site", soon: "Bientôt",
    cta: { demo: "Demander une démo", waitlist: "Rejoindre la liste d'attente", notify: "Être prévenu du lancement" },
    invest: "Investir",
    problem: "Le problème", answer: "Notre réponse",
    who: "Pour qui",
    does: (n: string) => `Ce que fait ${n}`,
    model: "Modèle économique", edge: "L'avantage du studio", vision: "L'ambition",
    where: (n: string) => `Où en est ${n}`,
    whereP: "Les dates précises figurent dans le dossier investisseur.",
    done: "Fait", current: "En cours", todo: "À venir",
    next: "Venture suivante",
  },
  en: {
    crumb: "Breadcrumb",
    others: "Other ventures",
    sector: "Sector", market: "Market", stage: "Stage", site: "Website", soon: "Coming soon",
    cta: { demo: "Request a demo", waitlist: "Join the waitlist", notify: "Get notified at launch" },
    invest: "Invest",
    problem: "The problem", answer: "Our answer",
    who: "Who it's for",
    does: (n: string) => `What ${n} does`,
    model: "Business model", edge: "The studio advantage", vision: "The ambition",
    where: (n: string) => `Where ${n} stands`,
    whereP: "Precise dates are in the investor pack.",
    done: "Done", current: "In progress", todo: "Upcoming",
    next: "Next venture",
  },
};

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return ventures.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const v = getVenture(slug);
  if (!v) return {};
  const lang: Lang = locale === "en" ? "en" : "fr";
  return { title: v.name, description: v.line[lang] };
}

export default async function VenturePage({ params }: Params) {
  const { locale, slug } = await params;
  const v = getVenture(slug);
  if (!v) notFound();
  const lang: Lang = locale === "en" ? "en" : "fr";
  const c = COPY[lang];
  const idx = ventures.indexOf(v);
  const next = ventures[(idx + 1) % ventures.length];

  return (
    <>
      <div className="wrap flex flex-wrap items-center justify-between gap-4 pt-7">
        <nav aria-label={c.crumb} className="small muted">
          <Link href="/ventures" className="link !text-[var(--muted)]">Ventures</Link> / <span className="text-[var(--fg)]">{v.name}</span>
        </nav>
        <nav aria-label={c.others} className="tabs hide-sm">
          {ventures.map((o) => (
            <Link key={o.slug} href={`/ventures/${o.slug}`} aria-current={o.slug === v.slug ? "page" : undefined} className="tab">
              {o.name}
            </Link>
          ))}
        </nav>
      </div>

      <section className="wrap g-hero pt-14 md:pt-[72px] pb-12">
        <div className="fade flex flex-col gap-5">
          <h1 className="h1 h1-xl">{v.name}</h1>
          <p className="lead !text-[var(--fg)]" style={{ fontSize: "clamp(19px, 1.8vw, 22px)" }}>{v.line[lang]}</p>
          <p className="body max-w-[580px]">{v.pitch[lang]}</p>
        </div>
        <div className="fade f1 flex flex-col gap-6">
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-[15px]">
            <dt className="muted">{c.sector}</dt><dd className="m-0">{v.sector[lang]}</dd>
            <dt className="muted">{c.market}</dt><dd className="m-0">{v.market[lang]}</dd>
            <dt className="muted">{c.stage}</dt><dd className="m-0">{v.stage[lang]}</dd>
            <dt className="muted">{c.site}</dt>
            <dd className="m-0">
              {v.site ? <a className="link" href={`https://${v.site}`} target="_blank" rel="noopener">{v.site}</a> : c.soon}
            </dd>
          </dl>
          <div className="flex flex-wrap items-center gap-5">
            <Link href={`/societe?venture=${v.slug}#contact`} className="btn btn-p">{c.cta[v.cta]}</Link>
            <Link href="/investisseurs" className="link">{c.invest} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="wrap pb-6">
        <div className="grow-in origin-top">
          <Poster color={v.color} name={v.name} ratio="21/9" size="lg" />
        </div>
      </section>

      <section className="wrap g-2 py-20 md:py-[104px]">
        <div data-reveal className="flex flex-col gap-4">
          <h2 className="h3 muted">{c.problem}</h2>
          <p className="statement text-[var(--fg2)]">{v.problem[lang]}</p>
        </div>
        <div data-reveal className="flex flex-col gap-4">
          <h2 className="h3 accent">{c.answer}</h2>
          <p className="statement">{v.answer[lang]}</p>
        </div>
      </section>

      <section className="wrap sec g-split">
        <h2 className="h2" data-reveal>{c.who}</h2>
        <div className="g-3">
          {v.who.map((w) => (
            <div key={w.t.fr} data-reveal className="topline">
              <span className="h3">{w.t[lang]}</span>
              <p className="body small">{w.d[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec flex flex-col gap-10">
        <h2 className="h2" data-reveal>{c.does(v.name)}</h2>
        <div className="g-3 gap-y-12">
          {v.features.map((f) => (
            <div key={f.t.fr} data-reveal className="topline">
              <span className="h3">{f.t[lang]}</span>
              <span className="body">{f.d[lang]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="g-two-cells grid border-t border-[var(--line)]">
          <div data-reveal className="flex flex-col gap-3">
            <h2 className="h3" style={{ fontSize: 24 }}>{c.model}</h2>
            <p className="body">{v.model[lang]}</p>
          </div>
          <div data-reveal className="flex flex-col gap-3">
            <h2 className="h3" style={{ fontSize: 24 }}>{c.edge}</h2>
            <p className="body">{v.edge[lang]}</p>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div data-reveal className="flex max-w-[980px] flex-col gap-5">
          <h2 className="h3 muted">{c.vision}</h2>
          <p className="statement-xl">{v.vision[lang]}</p>
        </div>
      </section>

      <section className="band">
        <div className="wrap g-split py-20 md:py-24">
          <div className="flex flex-col gap-3">
            <h2 className="h2">{c.where(v.name)}</h2>
            <p className="body small">{c.whereP}</p>
          </div>
          <ol className="g-5 m-0 list-none p-0">
            {STAGES.map((s, k) => {
              const state = k < v.stageIdx ? c.done : k === v.stageIdx ? c.current : c.todo;
              return (
                <li
                  key={s.fr}
                  aria-current={k === v.stageIdx ? "step" : undefined}
                  className="flex flex-col gap-1.5 pt-[18px] pr-4"
                  style={{ borderTop: `2px solid ${k <= v.stageIdx ? "var(--accent)" : "var(--line2)"}` }}
                >
                  <span className="font-semibold" style={{ color: k <= v.stageIdx ? "var(--fg)" : "var(--muted)" }}>{s[lang]}</span>
                  <span className="small" style={{ color: k === v.stageIdx ? "var(--accent)" : "var(--muted)" }}>{state}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="wrap py-20 md:py-24">
        <Link href={`/ventures/${next.slug}`} className="grid items-center gap-8 no-underline md:grid-cols-[1fr_360px] md:gap-10">
          <span className="flex flex-col gap-2.5">
            <span className="label">{c.next}</span>
            <span className="h1">{next.name}</span>
            <span className="body">{next.line[lang]}</span>
          </span>
          <Poster color={next.color} name={next.name} />
        </Link>
      </section>
    </>
  );
}
