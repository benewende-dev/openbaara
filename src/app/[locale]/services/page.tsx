import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { getPackages } from "@/lib/shop/catalogue";
import { ventures } from "@/data/ventures";
import { STEPS, FAQ } from "@/data/services";
import { Poster } from "@/components/site/Poster";
import { Arrow } from "@/components/site/Arrow";
import { langOf } from "@/components/site/lang";
import { Offers } from "./Offers";
import { Estimator } from "./Estimator";

// Forfaits lus en base au prix en vigueur : un prix changé dans la console s'affiche ici.
export const dynamic = "force-dynamic";

const COPY = {
  fr: {
    meta: "Services",
    title: "Nous construisons aussi vos produits.",
    lead: "Sites, boutiques en ligne, applications mobiles, logiciels et agents IA, conçus par l'équipe qui construit les ventures du studio.",
    estimate: "Estimer mon projet",
    packages: "Voir les forfaits",
    process: "Comment se passe un projet",
    processP: "Un interlocuteur unique, une démo à chaque étape, et le paiement en trois fois.",
    proof: "Ce que nous construisons",
    proofP: "Les ventures du studio sont développées par la même équipe que vos projets.",
    allVentures: "Toutes les ventures",
    kinds: { baarali: "Agents IA et application web", sahely: "Super-app mobile", "baarali-entreprise": "Logiciel souverain pour entreprises" } as Record<string, string>,
    stacks: { baarali: "WhatsApp, Mobile Money, français", sahely: "iPhone et Android, cartographie, paiement", "baarali-entreprise": "Installation sur site, audit, authentification unique" } as Record<string, string>,
    faq: "Questions",
  },
  en: {
    meta: "Services",
    title: "We build your products too.",
    lead: "Websites, online stores, mobile apps, software and AI agents, designed by the team that builds the studio's ventures.",
    estimate: "Estimate my project",
    packages: "See the packages",
    process: "How a project runs",
    processP: "One point of contact, a demo at every stage, and payment in three instalments.",
    proof: "What we are building",
    proofP: "The studio's ventures are developed by the same team as your projects.",
    allVentures: "All ventures",
    kinds: { baarali: "AI agents and web app", sahely: "Mobile super-app", "baarali-entreprise": "Sovereign enterprise software" } as Record<string, string>,
    stacks: { baarali: "WhatsApp, Mobile Money, French", sahely: "iPhone and Android, maps, payment", "baarali-entreprise": "On-premises install, audit, single sign-on" } as Record<string, string>,
    faq: "Questions",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const c = COPY[await langOf(params)];
  return { title: c.meta, description: c.lead };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = await langOf(params);
  const c = COPY[lang];
  const packages = await getPackages();
  const priceOf = (slug: string) => packages.find((p) => p.slug === slug)?.priceXof ?? null;
  const maintenance = { site: priceOf("service-maintenance-site"), app: priceOf("service-maintenance-application") };
  const proof = ventures.filter((v) => v.slug in c.kinds);

  return (
    <>
      <section className="wrap g-hero pt-16 md:pt-20 pb-14 md:pb-[72px]">
        <h1 className="h1 fade">{c.title}</h1>
        <div className="fade f1 flex flex-col gap-[22px]">
          <p className="lead">{c.lead}</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#estimer" className="btn btn-p">{c.estimate}</a>
            <a href="#offres" className="link">{c.packages} <Arrow /></a>
          </div>
        </div>
      </section>

      <Offers lang={lang} packages={packages} />

      <section className="band">
        <div className="wrap g-split py-20 md:py-24">
          <div className="flex flex-col gap-3">
            <h2 className="h2">{c.process}</h2>
            <p className="body">{c.processP}</p>
          </div>
          <ol className="g-5 m-0 list-none p-0">
            {STEPS.map((s) => (
              <li key={s.t.fr} data-reveal className="flex flex-col gap-2 border-t-2 border-[var(--accent)] pt-[18px] pr-[18px]">
                <span className="font-semibold">{s.t[lang]}</span>
                <span className="body small">{s.d[lang]}</span>
                <span className="small muted">{s.w[lang]}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Estimator lang={lang} maintenance={maintenance} />

      <section className="wrap sec flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-2.5">
            <h2 className="h2">{c.proof}</h2>
            <p className="body">{c.proofP}</p>
          </div>
          <Link href="/ventures" className="link">{c.allVentures} <Arrow /></Link>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr] md:gap-5">
          {proof.map((v) => (
            <Link key={v.slug} href={`/ventures/${v.slug}`} data-reveal className="flex flex-col gap-3 no-underline">
              <Poster color={v.color} name={v.name} ratio="4/3" size="sm" />
              <span className="font-semibold">{c.kinds[v.slug]}</span>
              <span className="small muted">{c.stacks[v.slug]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap sec g-split">
        <h2 className="h2">{c.faq}</h2>
        <dl className="g-dl gap-x-10 gap-y-8">
          {FAQ.map((q) => (
            <div key={q.q.fr} data-reveal className="flex flex-col gap-2">
              <dt className="font-semibold">{q.q[lang]}</dt>
              <dd className="body small m-0">{q.a[lang]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
