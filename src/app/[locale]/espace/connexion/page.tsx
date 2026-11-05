import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getLearner } from "@/lib/learner/auth";
import { langOf } from "@/components/site/lang";
import { requestLink } from "../actions";

const COPY = {
  fr: {
    title: "Mon espace",
    lead: "Retrouvez vos cours et vos reçus. Indiquez l'adresse utilisée lors de votre achat : nous vous envoyons un lien de connexion.",
    email: "Adresse e-mail", send: "Recevoir le lien",
    sent: "Si cette adresse correspond à un achat, un lien de connexion vient de partir. Il est valable 20 minutes.",
    errors: { email: "Cette adresse n'est pas valide.", trop: "Trop de demandes. Réessayez dans un quart d'heure.", lien: "Ce lien n'est plus valable. Demandez-en un nouveau." } as Record<string, string>,
  },
  en: {
    title: "My space",
    lead: "Find your courses and receipts. Enter the address you used when buying: we'll send you a sign-in link.",
    email: "Email address", send: "Get the link",
    sent: "If this address matches a purchase, a sign-in link is on its way. It is valid for 20 minutes.",
    errors: { email: "This address is not valid.", trop: "Too many requests. Try again in a quarter of an hour.", lien: "This link is no longer valid. Ask for a new one." } as Record<string, string>,
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return { title: COPY[await langOf(params)].title, robots: { index: false } };
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ envoye?: string; erreur?: string }>;
}) {
  const lang = await langOf(params);
  if (await getLearner()) redirect(`/${lang}/espace`);
  const c = COPY[lang];
  const { envoye, erreur } = await searchParams;

  return (
    <div className="wrap flex max-w-[560px] flex-col gap-6 pt-16 pb-28 md:pt-24">
      <h1 className="h1">{c.title}</h1>
      <p className="lead">{c.lead}</p>
      {envoye ? (
        <p role="status" className="notice body m-0">{c.sent}</p>
      ) : (
        <form action={requestLink} className="flex flex-col gap-3">
          <input type="hidden" name="locale" value={lang} />
          <div className="field">
            <label htmlFor="se" className="label">{c.email}</label>
            <input id="se" name="email" type="email" className="inp" autoComplete="email" required maxLength={200} />
          </div>
          {erreur && c.errors[erreur] && <p role="alert" className="error">{c.errors[erreur]}</p>}
          <button type="submit" className="btn btn-p btn-lg self-start">{c.send}</button>
        </form>
      )}
    </div>
  );
}
