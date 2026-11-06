import type { Metadata } from "next";
import Image from "next/image";
import { PRINCIPLES, COMPANY, FOUNDER } from "@/data/studio";
import { getVenture } from "@/data/ventures";
import { langOf } from "@/components/site/lang";
import { ContactForm } from "./ContactForm";

const COPY = {
  fr: {
    meta: "Société",
    title: "Construire ici des produits utilisés partout.",
    lead: "OpenBaara est un studio de ventures installé à Abidjan. Nous fondons, construisons et opérons des entreprises technologiques pensées pour l'Afrique de l'Ouest, puis nous les accompagnons vers le reste du continent et la diaspora.",
    vision: "Notre vision",
    visionP: [
      "L'Afrique de l'Ouest a déjà fait une partie du chemin : le paiement mobile est entré dans les habitudes, le smartphone se généralise et une génération entière a grandi en ligne. Ce qui manque encore, ce sont les entreprises capables de transformer ces usages en services fiables, utiles et durables.",
      "Une seule start-up, isolée, doit tout reconstruire : les paiements, la sécurité, l'infrastructure, l'équipe. Un studio construit ces fondations une fois, les améliore à chaque lancement et les met au service de toutes ses ventures. Chaque nouvelle entreprise démarre ainsi plus vite, avec moins de risques et un niveau d'exigence plus élevé.",
      "L'intelligence artificielle change aussi l'équation. Elle permet à une équipe resserrée de concevoir des produits qui demandaient hier des dizaines d'ingénieurs, et elle peut enfin parler les langues de nos clients. Nous voulons qu'elle serve d'abord ceux qui en ont été les derniers servis.",
      "Notre ambition est claire : bâtir depuis Abidjan un ensemble d'entreprises qui deviennent des références dans leur marché, créent des emplois qualifiés dans la région et prouvent que les grands produits technologiques du continent peuvent naître ici.",
    ],
    method: "Comment nous travaillons",
    team: "Équipe",
    legal: "Informations légales",
    legalRows: { name: "Raison sociale", address: "Siège", rccm: "RCCM", capital: "Capital", president: "Président", site: "Site" },
    contact: "Nous contacter",
    contactP: "Réponse sous deux jours ouvrés.",
    email: "E-mail",
    city: "Ville",
  },
  en: {
    meta: "Company",
    title: "Building products here that are used everywhere.",
    lead: "OpenBaara is a venture studio based in Abidjan. We found, build and run technology companies designed for West Africa, then take them to the rest of the continent and the diaspora.",
    vision: "Our vision",
    visionP: [
      "West Africa has already come a long way: mobile payment is part of daily life, smartphones are spreading and a whole generation has grown up online. What is still missing are companies able to turn these habits into reliable, useful and lasting services.",
      "A single, isolated start-up has to rebuild everything: payments, security, infrastructure, the team. A studio builds these foundations once, improves them with every launch and puts them at the service of all its ventures. Each new company starts faster, with less risk and higher standards.",
      "Artificial intelligence changes the equation too. It lets a tight team design products that used to take dozens of engineers, and it can finally speak our customers' languages. We want it to serve first those who have been served last.",
      "Our ambition is clear: to build from Abidjan a group of companies that become references in their market, create skilled jobs in the region and prove that the continent's great technology products can be born here.",
    ],
    method: "How we work",
    team: "Team",
    legal: "Legal information",
    legalRows: { name: "Company name", address: "Registered office", rccm: "Trade register", capital: "Share capital", president: "Chairman", site: "Website" },
    contact: "Contact us",
    contactP: "We reply within two working days.",
    email: "Email",
    city: "City",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const c = COPY[await langOf(params)];
  return { title: c.meta, description: c.lead };
}

export default async function CompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ venture?: string }>;
}) {
  const lang = await langOf(params);
  const c = COPY[lang];
  const venture = getVenture((await searchParams).venture ?? "");
  const r = c.legalRows;
  const legal = [
    [r.name, COMPANY.legalForm ? `${COMPANY.name} ${COMPANY.legalForm}` : COMPANY.name],
    [r.address, COMPANY.address ? `${COMPANY.address}, ${COMPANY.city}` : COMPANY.city],
    [r.rccm, COMPANY.rccm],
    [r.capital, COMPANY.capitalXof ? `${new Intl.NumberFormat("fr-FR").format(COMPANY.capitalXof)} F CFA` : null],
    [r.president, COMPANY.president],
    [r.site, COMPANY.site],
  ].filter((row): row is [string, string] => row[1] != null);

  return (
    <>
      <section className="wrap mx-auto flex max-w-[1040px] flex-col gap-6 pt-16 md:pt-20 pb-20 md:pb-24">
        <h1 className="h1 fade">{c.title}</h1>
        <p className="lead fade f1" style={{ fontSize: "clamp(19px, 1.8vw, 22px)" }}>{c.lead}</p>
      </section>

      <section id="vision" className="wrap sec g-split scroll-mt-24">
        <h2 className="h2" data-reveal>{c.vision}</h2>
        <div data-reveal className="flex max-w-[760px] flex-col gap-[22px]">
          <p className="lead !text-[var(--fg)]">{c.visionP[0]}</p>
          {c.visionP.slice(1).map((p) => <p key={p} className="body">{p}</p>)}
        </div>
      </section>

      <section id="methode" className="wrap sec g-split scroll-mt-24">
        <h2 className="h2" data-reveal>{c.method}</h2>
        <dl className="g-dl gap-10">
          {PRINCIPLES.map((p) => (
            <div key={p.t.fr} data-reveal className="topline">
              <dt className="h3">{p.t[lang]}</dt>
              <dd className="body m-0">{p.d[lang]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="band">
        <div className="wrap g-split py-20 md:py-[104px]">
          <h2 className="h2">{c.team}</h2>
          <div className={FOUNDER.photo ? "grid items-start gap-8 sm:grid-cols-[240px_1fr] md:gap-10" : ""}>
          {FOUNDER.photo && (
            <Image src={FOUNDER.photo} alt={FOUNDER.name} width={480} height={600} className="aspect-[4/5] w-full max-w-[280px] rounded-[10px] object-cover" />
          )}
          <div className="flex flex-col gap-3.5">
            <span className="h3" style={{ fontSize: 26 }}>{FOUNDER.name}</span>
            <span className="muted">{FOUNDER.role[lang]}</span>
            {FOUNDER.bio && <p className="body">{FOUNDER.bio[lang]}</p>}
            {FOUNDER.links.length > 0 && (
              <span className="flex gap-4">
                {FOUNDER.links.map((l) => <a key={l.href} className="link" href={l.href} target="_blank" rel="noopener">{l.label}</a>)}
              </span>
            )}
          </div>
          </div>
        </div>
      </section>

      <section className="wrap sec sec-top g-split">
        <h2 className="h2" data-reveal>{c.legal}</h2>
        <dl data-reveal className="m-0 grid grid-cols-[minmax(120px,220px)_1fr]">
          {legal.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="muted border-t border-[var(--line)] py-3.5">{k}</dt>
              <dd className="m-0 border-t border-[var(--line)] py-3.5">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" className="scroll-mt-16 border-t border-[var(--line)]">
        <div className="wrap grid gap-12 pt-20 pb-24 md:grid-cols-[1fr_1.3fr] md:gap-20 md:pt-[104px] md:pb-[120px]">
          <div className="flex flex-col gap-5">
            <h2 className="h2">{c.contact}</h2>
            <p className="body">{c.contactP}</p>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-[15px]">
              <dt className="muted">{c.email}</dt>
              <dd className="m-0"><a className="link" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></dd>
              <dt className="muted">{c.city}</dt>
              <dd className="m-0">{COMPANY.city}</dd>
            </dl>
          </div>
          <ContactForm lang={lang} venture={venture ? { slug: venture.slug, name: venture.name } : null} />
        </div>
      </section>
    </>
  );
}
