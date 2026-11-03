import type { Metadata } from "next";
import { VenturesView } from "./VenturesView";
import { langOf } from "@/components/site/lang";

const COPY = {
  fr: {
    title: "Ventures",
    lead: "Les entreprises que le studio fonde et construit, chacune née d'un problème concret de la région. Elles partagent les mêmes fondations techniques et la même exigence, et la liste s'allonge à chaque lancement.",
  },
  en: {
    title: "Ventures",
    lead: "The companies the studio founds and builds, each born from a concrete problem in the region. They share the same technical foundations and the same standards, and the list grows with every launch.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const c = COPY[await langOf(params)];
  return { title: c.title, description: c.lead };
}

export default async function VenturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const lang = await langOf(params);
  const c = COPY[lang];
  return (
    <div className="wrap flex flex-col gap-12 pt-16 md:pt-20 pb-24 md:pb-32">
      <div className="fade flex max-w-[760px] flex-col gap-5">
        <h1 className="h1">{c.title}</h1>
        <p className="lead">{c.lead}</p>
      </div>
      <VenturesView lang={lang} />
    </div>
  );
}
