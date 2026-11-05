import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ventures } from "@/data/ventures";
import { WHY_NOW, VALUE, FOUNDER } from "@/data/studio";
import { Arrow } from "@/components/site/Arrow";
import { langOf } from "@/components/site/lang";
import { MeetingForm } from "./MeetingForm";

const COPY = {
  fr: {
    meta: "Investisseurs",
    title: "Investir dans OpenBaara.",
    lead: "Un portefeuille de ventures qui partagent leurs fondations techniques, leur équipe et leur méthode, dans des marchés encore largement à servir. Deux façons d'y prendre part, selon votre horizon et votre thèse.",
    meet: "Demander un rendez-vous",
    docs: "Les documents",
    studio: "Dans le studio",
    studioP: "Une participation dans OpenBaara. Vous êtes exposé à toutes les ventures, présentes et futures, à l'équipe et aux briques communes. Le risque est réparti sur plusieurs marchés, et chaque nouveau lancement vient enrichir le portefeuille.",
    venture: "Dans une venture",
    ventureP: "Une entrée ciblée au capital de l'entreprise de votre choix, au moment qui correspond à votre thèse. La venture reste adossée aux moyens du studio : équipe, technologie, méthode et réseau.",
    portfolio: "Portefeuille",
    cols: ["Venture", "Secteur", "Marché", "Stade", "Prochaine étape"],
    why: "Pourquoi maintenant",
    value: "Comment le studio crée de la valeur",
    documents: "Documents",
    docList: [
      ["Dossier investisseur", "PDF, mis à jour chaque trimestre", "Sur demande", "Demander", "#rdv"],
      ["Présentation du studio", "Diaporama de 15 pages", "Sur demande", "Demander", "#rdv"],
      ["Fiches des ventures", "Une page par venture", "Public", "Consulter", "/ventures"],
      ["Données financières", "Salle de données, après accord de confidentialité", "Après accord", "Demander", "#rdv"],
      ["Vision d'OpenBaara", "Le texte de fond du studio", "Public", "Lire", "/societe#vision"],
    ],
    rdv: "Demander un rendez-vous",
    rdvP: "Un premier échange de 30 minutes avec le fondateur, en visio ou à Abidjan. Indiquez vos disponibilités : nous revenons vers vous avec une invitation sous deux jours ouvrés.",
  },
  en: {
    meta: "Investors",
    title: "Invest in OpenBaara.",
    lead: "A portfolio of ventures that share their technical foundations, team and method, in markets that are still largely under-served. Two ways to take part, depending on your horizon and your thesis.",
    meet: "Request a meeting",
    docs: "The documents",
    studio: "In the studio",
    studioP: "A stake in OpenBaara. You are exposed to every venture, present and future, to the team and to the shared building blocks. Risk is spread across several markets, and every new launch adds to the portfolio.",
    venture: "In a venture",
    ventureP: "A targeted entry into the capital of the company of your choice, at the moment that fits your thesis. The venture remains backed by the studio's resources: team, technology, method and network.",
    portfolio: "Portfolio",
    cols: ["Venture", "Sector", "Market", "Stage", "Next milestone"],
    why: "Why now",
    value: "How the studio creates value",
    documents: "Documents",
    docList: [
      ["Investor pack", "PDF, updated every quarter", "On request", "Request", "#rdv"],
      ["Studio presentation", "15-slide deck", "On request", "Request", "#rdv"],
      ["Venture profiles", "One page per venture", "Public", "View", "/ventures"],
      ["Financial data", "Data room, after a confidentiality agreement", "After NDA", "Request", "#rdv"],
      ["OpenBaara's vision", "The studio's founding text", "Public", "Read", "/societe#vision"],
    ],
    rdv: "Request a meeting",
    rdvP: "A first 30-minute conversation with the founder, by video or in Abidjan. Tell us when you are available: we'll come back to you with an invitation within two working days.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const c = COPY[await langOf(params)];
  return { title: c.meta, description: c.lead };
}

export default async function InvestorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = await langOf(params);
  const c = COPY[lang];

  return (
    <>
      <section className="wrap g-hero pt-16 md:pt-20 pb-20 md:pb-24">
        <h1 className="h1 fade">{c.title}</h1>
        <div className="fade f1 flex flex-col gap-[22px]">
          <p className="lead">{c.lead}</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#rdv" className="btn btn-p">{c.meet}</a>
            <a href="#documents" className="link">{c.docs} <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="wrap sec">
        <div className="g-two-cells grid border-t border-[var(--line)]">
          <div data-reveal className="flex flex-col gap-3">
            <h2 className="h3" style={{ fontSize: 26 }}>{c.studio}</h2>
            <p className="body">{c.studioP}</p>
          </div>
          <div data-reveal className="flex flex-col gap-3">
            <h2 className="h3" style={{ fontSize: 26 }}>{c.venture}</h2>
            <p className="body">{c.ventureP}</p>
          </div>
        </div>
      </section>

      <section className="wrap sec flex flex-col gap-8">
        <h2 className="h2" data-reveal>{c.portfolio}</h2>
        <table className="dtable" data-reveal>
          <thead>
            <tr>{c.cols.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {ventures.map((v) => (
              <tr key={v.slug}>
                <td><Link href={`/ventures/${v.slug}`} className="link">{v.name}</Link></td>
                <td>{v.sector[lang]}</td>
                <td>{v.market[lang]}</td>
                <td className="!text-[var(--fg)]">{v.stage[lang]}</td>
                <td>{v.next[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="band">
        <div className="wrap g-split py-20 md:py-[104px]">
          <h2 className="h2">{c.why}</h2>
          <div className="flex flex-col gap-10">
            {WHY_NOW.map((w) => (
              <div key={w.t.fr} data-reveal className="flex flex-col gap-2.5">
                <span className="h3" style={{ fontSize: 26 }}>{w.t[lang]}</span>
                <p className="body">{w.d[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap sec-top g-split">
        <h2 className="h2" data-reveal>{c.value}</h2>
        <dl className="g-dl gap-10">
          {VALUE.map((x) => (
            <div key={x.t.fr} data-reveal className="topline">
              <dt className="h3">{x.t[lang]}</dt>
              <dd className="body m-0">{x.d[lang]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="documents" className="wrap sec sec-top g-split scroll-mt-16">
        <h2 className="h2" data-reveal>{c.documents}</h2>
        <ul data-reveal className="m-0 list-none p-0">
          {c.docList.map(([title, desc, access, action, href]) => (
            <li key={title} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-t border-[var(--line)] py-[18px] sm:grid-cols-[1fr_auto_auto]">
              <span className="flex flex-col gap-0.5">
                <span className="font-semibold">{title}</span>
                <span className="small muted">{desc}</span>
              </span>
              <span className="small muted hide-sm">{access}</span>
              {href.startsWith("#") ? (
                <a href={href} className="link small">{action} <Arrow /></a>
              ) : (
                <Link href={href} className="link small">{action} <Arrow /></Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="rdv" className="scroll-mt-16 border-t border-[var(--line)]">
        <div className="wrap grid gap-12 pt-20 pb-24 md:grid-cols-[1fr_1.6fr] md:gap-16 md:pt-[104px] md:pb-[120px]">
          <div className="flex flex-col gap-5">
            <h2 className="h2">{c.rdv}</h2>
            <p className="body">{c.rdvP}</p>
            <span className="flex flex-col pt-2">
              <span className="font-semibold">{FOUNDER.name}</span>
              <span className="small muted">{FOUNDER.role[lang]}</span>
            </span>
          </div>
          <MeetingForm lang={lang} />
        </div>
      </section>
    </>
  );
}
