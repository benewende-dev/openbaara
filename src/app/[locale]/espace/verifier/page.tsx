import type { Metadata } from "next";
import { langOf } from "@/components/site/lang";
import { confirmLogin } from "../actions";

const COPY = {
  fr: { title: "Ouvrir mon espace", lead: "Un clic pour terminer la connexion sur cet appareil.", go: "Ouvrir mon espace" },
  en: { title: "Open my space", lead: "One click to finish signing in on this device.", go: "Open my space" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: COPY[await langOf(params)].title, robots: { index: false } };
}

// Le jeton n'est consommé qu'au clic : un antivirus qui visite le lien ne l'use pas.
export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const lang = await langOf(params);
  const c = COPY[lang];
  const { token = "" } = await searchParams;
  return (
    <div className="wrap flex max-w-[560px] flex-col gap-6 pt-16 pb-28 md:pt-24">
      <h1 className="h1">{c.title}</h1>
      <p className="lead">{c.lead}</p>
      <form action={confirmLogin}>
        <input type="hidden" name="locale" value={lang} />
        <input type="hidden" name="token" value={token} />
        <button type="submit" className="btn btn-p btn-lg">{c.go}</button>
      </form>
    </div>
  );
}
