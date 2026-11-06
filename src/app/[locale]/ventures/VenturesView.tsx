"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { ventures, ventureImage, CATEGORIES, type VentureCategory } from "@/data/ventures";
import { Poster } from "@/components/site/Poster";
import { Arrow } from "@/components/site/Arrow";
import type { Lang } from "@/components/site/lang";

const COPY = {
  fr: {
    sector: "Secteur", all: "Toutes", display: "Affichage", grid: "Grille", list: "Liste",
    cols: ["Venture", "Secteur", "Marché", "Stade", ""], see: "Voir",
    emptyTitle: "Aucune venture dans ce secteur pour l'instant.", emptyReset: "Voir toutes les ventures",
    moreTitle: "D'autres ventures sont en préparation.",
    moreP: "Recevez par e-mail l'annonce des prochains lancements, avant leur ouverture au public.",
    email: "Votre e-mail", ph: "vous@exemple.com", subscribe: "S'abonner", sending: "Envoi…",
    done: "C'est noté. Vous recevrez nos prochaines annonces.",
  },
  en: {
    sector: "Sector", all: "All", display: "Display", grid: "Grid", list: "List",
    cols: ["Venture", "Sector", "Market", "Stage", ""], see: "View",
    emptyTitle: "No venture in this sector yet.", emptyReset: "See all ventures",
    moreTitle: "More ventures are on the way.",
    moreP: "Get our next launches announced by email, before they open to the public.",
    email: "Your email", ph: "you@example.com", subscribe: "Subscribe", sending: "Sending…",
    done: "Noted. You'll receive our next announcements.",
  },
};

export function VenturesView({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [cat, setCat] = useState<VentureCategory | "all">("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const shown = ventures.filter((v) => cat === "all" || v.category === cat);
  const tabs = [{ id: "all" as const, label: c.all }, ...CATEGORIES.map((k) => ({ id: k.id, label: k.label[lang] }))];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div role="group" aria-label={c.sector} className="tabs">
          {tabs.map((tb) => (
            <button key={tb.id} type="button" aria-pressed={cat === tb.id} onClick={() => setCat(tb.id)} className="tab">
              {tb.label}
              <span className="muted num ml-1.5">
                {tb.id === "all" ? ventures.length : ventures.filter((v) => v.category === tb.id).length}
              </span>
            </button>
          ))}
        </div>
        <div role="group" aria-label={c.display} className="tabs hide-sm">
          <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} className="tab">{c.grid}</button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className="tab">{c.list}</button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-start gap-3 py-16">
          <span className="h3">{c.emptyTitle}</span>
          <button type="button" onClick={() => setCat("all")} className="btn btn-s">{c.emptyReset}</button>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-x-7 gap-y-14 md:grid-cols-2">
          {shown.map((v) => (
            <article key={v.slug} className="fade flex flex-col gap-[18px]">
              <Link href={`/ventures/${v.slug}`} className="no-underline" tabIndex={-1} aria-hidden="true">
                <Poster color={v.color} name={v.name} image={ventureImage(v.slug)} />
              </Link>
              <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2">
                <Link href={`/ventures/${v.slug}`} className="h3 link self-start" style={{ fontSize: 26 }}>{v.name}</Link>
                <span className="small muted pt-1.5">{v.stage[lang]}</span>
                <p className="body col-span-2">{v.line[lang]}</p>
                <span className="small muted col-span-2">{v.sector[lang]} · {v.market[lang]}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <table className="dtable">
          <thead>
            <tr>{c.cols.map((h, k) => <th key={k} scope="col">{h}</th>)}</tr>
          </thead>
          <tbody>
            {shown.map((v) => (
              <tr key={v.slug}>
                <td>
                  <span className="flex items-center gap-3.5">
                    <span className="h-7 w-11 shrink-0 rounded bg-cover bg-center" style={{ backgroundImage: `url(${ventureImage(v.slug)})` }} aria-hidden="true" />
                    {v.name}
                  </span>
                </td>
                <td>{v.sector[lang]}</td>
                <td>{v.market[lang]}</td>
                <td className="!text-[var(--fg)]">{v.stage[lang]}</td>
                <td className="text-right"><Link href={`/ventures/${v.slug}`} className="link">{c.see} <Arrow /></Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Newsletter lang={lang} />
    </>
  );
}

function Newsletter({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (res?.ok) return setState("done");
    setError(data?.error ?? "");
    setState("error");
  };

  return (
    <div className="mt-6 grid items-center gap-8 rounded-[10px] bg-[var(--bg2)] p-8 md:grid-cols-[1fr_auto] md:p-10">
      <div className="flex flex-col gap-2">
        <span className="h3">{c.moreTitle}</span>
        <span className="body">{c.moreP}</span>
      </div>
      {state === "done" ? (
        <p role="status" className="body m-0 font-medium">{c.done}</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="nl-email" className="sr-only">{c.email}</label>
            <input id="nl-email" className="inp sm:w-[260px]" type="email" required autoComplete="email" placeholder={c.ph} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="btn btn-p h-11" disabled={state === "sending"}>{state === "sending" ? c.sending : c.subscribe}</button>
          </div>
          {state === "error" && error && <p role="alert" className="error">{error}</p>}
        </form>
      )}
    </div>
  );
}
