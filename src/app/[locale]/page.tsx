import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ventures } from "@/data/ventures";
import { PHOTOS } from "@/data/photos";
import { PhotoCredit } from "@/components/site/PhotoCredit";
import { BRICKS } from "@/data/studio";
import { Poster } from "@/components/site/Poster";
import { Arrow } from "@/components/site/Arrow";
import { langOf } from "@/components/site/lang";

const COPY = {
  fr: {
    title: "Nous bâtissons les entreprises technologiques de l'Afrique de l'Ouest.",
    lead: "OpenBaara est un studio de ventures basé à Abidjan. Nous partons des problèmes concrets de la région, concevons les produits qui les résolvent et bâtissons autour d'eux des entreprises durables, prêtes à franchir les frontières.",
    seeVentures: "Voir les ventures",
    invest: "Investir dans le studio",
    conviction: "Les entreprises qui serviront l'Afrique de l'Ouest de demain peuvent être conçues ici, par ceux qui en connaissent les usages.",
    convictionP: [
      "Plus de quatre cents millions de personnes vivent en Afrique de l'Ouest. Elles paient sur leur téléphone, travaillent sur WhatsApp et attendent des services numériques à la hauteur de leur quotidien. Beaucoup de ces services restent à construire.",
      "Nous ne cherchons pas à importer des modèles conçus ailleurs. Chaque venture naît d'un problème observé sur le terrain, avec des clients réels, puis s'appuie sur des fondations techniques partagées pour aller vite sans sacrifier la qualité.",
      "Notre ambition est de créer, depuis Abidjan, des entreprises qui deviennent des références dans leur marché, puis dans le reste du continent et auprès de la diaspora.",
    ],
    vision: "Notre vision",
    portfolio: "Portefeuille",
    portfolioP: (n: number, sectors: string) => `${n} ventures en construction, dans ${sectors}. Le portefeuille s'agrandit à chaque problème que nous choisissons de résoudre.`,
    sectors: "l'IA, la finance, la mobilité, la logistique, la mode et la création",
    all: (n: number) => `Les ${n} ventures`,
    bricksTitle: "Un studio, des briques partagées.",
    bricksP: "Chaque venture repose sur les mêmes fondations, construites une fois et améliorées par toutes. Une amélioration des paiements dans Sahely profite le jour même à ColisGo ; un agent éprouvé dans Baarali sert ensuite Baarali Entreprise. C'est ce qui permet à une équipe resserrée de mener plusieurs entreprises solides de front.",
    method: "Notre méthode",
    investTitle: "Investir dans le studio ou dans une venture.",
    investP: "Deux façons d'investir : dans le studio, pour une exposition à tout le portefeuille, ou dans la venture de votre choix. Dossier investisseur sur demande et premier échange de 30 minutes avec le fondateur, à Abidjan ou en visio.",
    meet: "Demander un rendez-vous",
    investorSpace: "L'espace investisseurs",
    academy: "Des formations à l'IA appliquée et au produit, enseignées par l'équipe qui construit les ventures, à partir de cas réels.",
    services: "Sites, boutiques en ligne, applications et agents IA, construits pour vous par l'équipe du studio.",
    studioCaption: "Abidjan, où le studio est installé.",
  },
  en: {
    title: "We build West Africa's technology companies.",
    lead: "OpenBaara is a venture studio based in Abidjan. We start from the region's concrete problems, design the products that solve them and build lasting companies around them, ready to cross borders.",
    seeVentures: "See the ventures",
    invest: "Invest in the studio",
    conviction: "The companies that will serve tomorrow's West Africa can be designed here, by people who know how it lives.",
    convictionP: [
      "More than four hundred million people live in West Africa. They pay on their phones, work on WhatsApp and expect digital services that match their daily lives. Many of those services are still to be built.",
      "We don't set out to import models designed elsewhere. Each venture starts from a problem observed on the ground, with real customers, then builds on shared technical foundations to move fast without sacrificing quality.",
      "Our ambition is to create, from Abidjan, companies that become references in their market, then across the continent and among the diaspora.",
    ],
    vision: "Our vision",
    portfolio: "Portfolio",
    portfolioP: (n: number, sectors: string) => `${n} ventures in the making, in ${sectors}. The portfolio grows with every problem we choose to solve.`,
    sectors: "AI, finance, mobility, logistics, fashion and creation",
    all: (n: number) => `All ${n} ventures`,
    bricksTitle: "One studio, shared building blocks.",
    bricksP: "Every venture rests on the same foundations, built once and improved by all. A payments improvement in Sahely benefits ColisGo the same day; an agent proven in Baarali then serves Baarali Enterprise. That is what lets a tight team run several solid companies at once.",
    method: "Our method",
    investTitle: "Invest in the studio or in a venture.",
    investP: "Two ways to invest: in the studio, for exposure to the whole portfolio, or in the venture of your choice. Investor pack on request and a first 30-minute conversation with the founder, in Abidjan or by video.",
    meet: "Request a meeting",
    investorSpace: "The investor space",
    academy: "Training in applied AI and product, taught by the team that builds the ventures, based on real cases.",
    services: "Websites, online stores, apps and AI agents, built for you by the studio team.",
    studioCaption: "Abidjan, home of the studio.",
  },
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = await langOf(params);
  const c = COPY[lang];
  const [first, ...more] = ventures;
  const rest = more.slice(0, 3);

  return (
    <>
      <section className="wrap g-hero pt-16 md:pt-[88px] pb-14 md:pb-24">
        <h1 className="h1 fade">{c.title}</h1>
        <div className="fade f1 flex flex-col gap-6 pb-2">
          <p className="lead">{c.lead}</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/ventures" className="btn btn-p">{c.seeVentures}</Link>
            <Link href="/investisseurs" className="link">{c.invest} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="wrap pb-20 md:pb-28">
        <figure className="m-0 flex flex-col gap-3">
          <div className="grow-in relative overflow-hidden rounded-[10px]" style={{ aspectRatio: "21/9" }}>
            <Image src={PHOTOS.abidjan.src} alt={PHOTOS.abidjan.alt[lang]} fill priority sizes="(min-width: 1240px) 1160px, 100vw" className="object-cover" />
          </div>
          <figcaption className="flex flex-wrap justify-between gap-2">
            <span className="small muted">{c.studioCaption}</span>
            <PhotoCredit photo={PHOTOS.abidjan} lang={lang} />
          </figcaption>
        </figure>
      </section>

      <section className="wrap sec g-2 items-start">
        <h2 className="h2" data-reveal style={{ fontSize: "clamp(30px, 3.8vw, 44px)", lineHeight: 1.1 }}>{c.conviction}</h2>
        <div data-reveal className="flex flex-col gap-5">
          <p className="lead">{c.convictionP[0]}</p>
          <p className="body">{c.convictionP[1]}</p>
          <p className="body">{c.convictionP[2]}</p>
          <Link href="/societe#vision" className="link self-start">{c.vision} <Arrow /></Link>
        </div>
      </section>

      <section className="wrap sec flex flex-col gap-10">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="h2">{c.portfolio}</h2>
            <p className="body">{c.portfolioP(ventures.length, c.sectors)}</p>
          </div>
          <Link href="/ventures" className="link">{c.all(ventures.length)} <Arrow /></Link>
        </div>
        <div className="g-feature">
          <article data-reveal className="flex flex-col gap-4 md:row-span-3">
            <Link href={`/ventures/${first.slug}`} className="no-underline" tabIndex={-1} aria-hidden="true">
              <Poster color={first.color} name={first.name} ratio="4/3.4" size="lg" />
            </Link>
            <div className="flex items-start justify-between gap-6">
              <div className="flex flex-col gap-1.5">
                <Link href={`/ventures/${first.slug}`} className="h3 link" style={{ fontSize: 26 }}>{first.name}</Link>
                <p className="body">{first.line[lang]}</p>
              </div>
              <span className="small muted whitespace-nowrap pt-1.5">{first.stage[lang]}</span>
            </div>
          </article>
          {rest.map((v) => (
            <article key={v.slug} data-reveal className="g-row items-start border-b border-[var(--line)] pb-5">
              <Link href={`/ventures/${v.slug}`} className="no-underline" tabIndex={-1} aria-hidden="true">
                <Poster color={v.color} name={v.name} ratio="4/3" size="sm" />
              </Link>
              <div className="flex flex-col gap-1.5 pt-0.5">
                <Link href={`/ventures/${v.slug}`} className="h3 link self-start">{v.name}</Link>
                <span className="small muted">{v.sector[lang]}, {v.stage[lang].toLowerCase()}</span>
                <p className="body small mt-1">{v.line[lang]}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <div className="wrap g-2 py-20 md:py-28">
          <div data-reveal className="flex flex-col gap-6">
            <h2 className="h2">{c.bricksTitle}</h2>
            <p className="lead">{c.bricksP}</p>
            <Link href="/societe#methode" className="link self-start">{c.method} <Arrow /></Link>
          </div>
          <dl data-reveal className="g-dl content-start">
            {BRICKS.map((b) => (
              <div key={b.t.fr} className="flex flex-col gap-2 border-t border-[var(--line2)] pt-4">
                <dt className="font-semibold">{b.t[lang]}</dt>
                <dd className="body small m-0">{b.d[lang]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap sec sec-top">
        <div data-reveal className="panel g-cta p-8 md:p-14">
          <div className="flex flex-col gap-4">
            <h2 className="h2">{c.investTitle}</h2>
            <p className="body">{c.investP}</p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Link href="/investisseurs#rdv" className="btn btn-p btn-lg">{c.meet}</Link>
            <Link href="/investisseurs" className="link">{c.investorSpace} <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="wrap sec grid gap-10 md:grid-cols-2 md:gap-5">
        <Link href="/academy" data-reveal className="flex flex-col gap-4 no-underline">
          <Poster color="#3A3A40" name="Academy" ratio="16/10" />
          <span className="flex flex-col gap-1.5">
            <span className="h3">Academy</span>
            <span className="body">{c.academy}</span>
          </span>
        </Link>
        <Link href="/services" data-reveal className="flex flex-col gap-4 no-underline">
          <Poster color="#1D6B52" name="Services" ratio="16/10" />
          <span className="flex flex-col gap-1.5">
            <span className="h3">Services</span>
            <span className="body">{c.services}</span>
          </span>
        </Link>
      </section>
    </>
  );
}
