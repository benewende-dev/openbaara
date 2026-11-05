"use client";

import { useEffect, useState } from "react";
import { ESTIMATE_TYPES, ESTIMATE_OPTIONS, estimate, type EstimateType } from "@/data/services";
import { formatXof } from "@/lib/shop/pricing";
import type { Lang } from "@/components/site/lang";

const COPY = {
  fr: {
    title: "Estimer mon projet",
    lead: "Une estimation en une minute. Le devis détaillé suit après un appel de 30 minutes.",
    type: "Type de projet", options: "Options",
    estimate: "Estimation", to: "à", delay: "Délai", weeks: (a: number, b: number) => `${a} à ${b} semaines`,
    payment: "Paiement", paymentV: "40 % à la commande, 40 % à la démo, 20 % à la mise en ligne",
    after: "Ensuite", maintFrom: (p: string) => `Maintenance à partir de ${p} par mois`, maintQuote: "Maintenance sur devis",
    name: "Nom", email: "E-mail", company: "Entreprise (facultatif)", message: "Votre projet en quelques mots (facultatif)",
    send: "Recevoir le devis détaillé", sending: "Envoi…",
    sentTitle: "Demande envoyée", sentP: "Nous vous écrivons sous deux jours ouvrés pour fixer l'appel de cadrage.",
    rateLimited: "Trop de demandes en peu de temps. Réessayez dans quelques minutes.",
    failed: "L'envoi a échoué. Écrivez-nous à contact@openbaara.com.",
  },
  en: {
    title: "Estimate my project",
    lead: "An estimate in one minute. The detailed quote follows a 30-minute call.",
    type: "Project type", options: "Options",
    estimate: "Estimate", to: "to", delay: "Timeline", weeks: (a: number, b: number) => `${a} to ${b} weeks`,
    payment: "Payment", paymentV: "40% on order, 40% at the demo, 20% at launch",
    after: "Afterwards", maintFrom: (p: string) => `Maintenance from ${p} per month`, maintQuote: "Maintenance on quote",
    name: "Name", email: "Email", company: "Company (optional)", message: "Your project in a few words (optional)",
    send: "Get the detailed quote", sending: "Sending…",
    sentTitle: "Request sent", sentP: "We'll write to you within two working days to schedule the scoping call.",
    rateLimited: "Too many requests in a short time. Please try again in a few minutes.",
    failed: "Sending failed. Write to us at contact@openbaara.com.",
  },
};

const TYPES = Object.keys(ESTIMATE_TYPES) as EstimateType[];

export function Estimator({ lang, maintenance }: { lang: Lang; maintenance: { site: number | null; app: number | null } }) {
  const c = COPY[lang];
  const [type, setType] = useState<EstimateType>("vitrine");
  const [size, setSize] = useState(5);
  const [opts, setOpts] = useState<string[]>(["bilingue"]);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // « Choisir ce forfait » dans la liste des offres sélectionne le type ici.
  useEffect(() => {
    const onPick = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;
      if (next in ESTIMATE_TYPES) setType(next as EstimateType);
    };
    window.addEventListener("ob:estimate-type", onPick);
    return () => window.removeEventListener("ob:estimate-type", onPick);
  }, []);

  const p = ESTIMATE_TYPES[type];
  const e = estimate(type, size, opts);
  const maintPrice = type === "vitrine" ? maintenance.site : type === "ecommerce" || type === "mobile" ? maintenance.app : null;

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const f = new FormData(ev.currentTarget);
    const optionLabels = ESTIMATE_OPTIONS.filter((o) => opts.includes(o.id)).map((o) => o.label.fr);
    const details = [
      `${ESTIMATE_TYPES[type].unit.fr} : ${e.size}`,
      `Options : ${optionLabels.join(", ") || "aucune"}`,
      `Délai estimé : ${e.weeksLo} à ${e.weeksHi} semaines`,
      `Langue du site : ${lang}`,
    ];
    const note = String(f.get("message") ?? "").trim();
    setState("sending");
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        email: f.get("email"),
        company: String(f.get("company") ?? "").trim() || undefined,
        category: type,
        size: e.size,
        estimateLo: e.lo,
        estimateHi: e.hi,
        message: [note, "", ...details].join("\n").trim(),
      }),
    }).catch(() => null);
    if (res?.ok) return setState("sent");
    setError(res?.status === 429 ? c.rateLimited : c.failed);
    setState("error");
  };

  return (
    <section id="estimer" className="wrap sec sec-top grid scroll-mt-16 items-start gap-12 md:grid-cols-[1.3fr_1fr]">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-2.5">
          <h2 className="h2">{c.title}</h2>
          <p className="body">{c.lead}</p>
        </div>
        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="label mb-2.5 p-0">{c.type}</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TYPES.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={type === k}
                onClick={() => {
                  setType(k);
                  setSize((s) => Math.min(s, ESTIMATE_TYPES[k].max));
                }}
                className="rounded-md border p-3.5 text-left text-sm font-medium text-[var(--fg)] transition-colors"
                style={{ borderColor: type === k ? "var(--fg)" : "var(--line)", background: type === k ? "var(--bg2)" : "var(--surface)" }}
              >
                {ESTIMATE_TYPES[k].label[lang]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-col gap-2.5">
          <label htmlFor="est-size" className="label">
            {p.unit[lang]} : <span className="num text-[var(--fg)]">{e.size}</span>
          </label>
          <input
            id="est-size"
            type="range"
            min={1}
            max={p.max}
            value={e.size}
            onChange={(ev) => setSize(Number(ev.target.value))}
            className="accent-[var(--accent)]"
          />
        </div>
        <fieldset className="m-0 border-0 p-0">
          <legend className="label mb-2.5 p-0">{c.options}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ESTIMATE_OPTIONS.map((o) => (
              <label key={o.id} className="flex cursor-pointer items-center gap-2.5 rounded-md border border-[var(--line)] bg-[var(--surface)] px-3.5 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={opts.includes(o.id)}
                  onChange={() => setOpts((cur) => (cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id]))}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
                {o.label[lang]}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="panel flex flex-col gap-[18px] p-6 md:sticky md:top-24 md:p-8">
        <span className="label">{c.estimate}</span>
        <span className="num text-[26px] font-semibold leading-[1.2] tracking-[-0.02em]" aria-live="polite">
          {formatXof(e.lo)}
          <br />
          <span className="muted text-[15px] font-normal">{c.to}</span> {formatXof(e.hi)}
        </span>
        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px]">
          <dt className="muted">{c.delay}</dt><dd className="m-0">{c.weeks(e.weeksLo, e.weeksHi)}</dd>
          <dt className="muted">{c.payment}</dt><dd className="m-0">{c.paymentV}</dd>
          <dt className="muted">{c.after}</dt><dd className="m-0">{maintPrice != null ? c.maintFrom(formatXof(maintPrice)) : c.maintQuote}</dd>
        </dl>
        {state === "sent" ? (
          <div role="status" className="notice p-6">
            <span className="h3">{c.sentTitle}</span>
            <span className="body small">{c.sentP}</span>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3 border-t border-[var(--line)] pt-4">
            <div className="field">
              <label htmlFor="q-name" className="label">{c.name}</label>
              <input id="q-name" name="name" className="inp" autoComplete="name" required minLength={2} maxLength={120} />
            </div>
            <div className="field">
              <label htmlFor="q-email" className="label">{c.email}</label>
              <input id="q-email" name="email" type="email" className="inp" autoComplete="email" required maxLength={200} />
            </div>
            <div className="field">
              <label htmlFor="q-company" className="label">{c.company}</label>
              <input id="q-company" name="company" className="inp" autoComplete="organization" maxLength={160} />
            </div>
            <div className="field">
              <label htmlFor="q-msg" className="label">{c.message}</label>
              <textarea id="q-msg" name="message" rows={3} className="inp" maxLength={3000} />
            </div>
            {state === "error" && <p role="alert" className="error">{error}</p>}
            <button type="submit" className="btn btn-p h-[46px]" disabled={state === "sending"}>
              {state === "sending" ? c.sending : c.send}
            </button>
          </form>
        )}
      </aside>
    </section>
  );
}
