"use client";

import { useState } from "react";
import { SERVICE_CATEGORIES, CATEGORY_TEXT, type ServiceCategory } from "@/data/services";
import type { ServicePackage } from "@/lib/shop/catalogue";
import { formatXof } from "@/lib/shop/pricing";
import type { Lang } from "@/components/site/lang";

const COPY = {
  fr: {
    type: "Type de projet", examples: "Exemples", popular: "Le plus demandé", from: "À partir de", afterCall: "Après un appel de cadrage",
    onQuote: "Sur devis", perMonth: "par mois", delay: "Délai", forWho: "Pour", choose: "Choisir ce forfait",
    note: "Prix hors taxes, en francs CFA. Le devis final dépend du contenu, des intégrations et des langues.",
  },
  en: {
    type: "Project type", examples: "Examples", popular: "Most requested", from: "From", afterCall: "After a scoping call",
    onQuote: "On quote", perMonth: "per month", delay: "Timeline", forWho: "For", choose: "Choose this package",
    note: "Prices exclude tax, in CFA francs. The final quote depends on content, integrations and languages.",
  },
};

export function Offers({ lang, packages }: { lang: Lang; packages: ServicePackage[] }) {
  const c = COPY[lang];
  const [cat, setCat] = useState<ServiceCategory>("vitrine");
  const text = CATEGORY_TEXT[cat];
  const plans = packages.filter((p) => p.category === cat);

  // Le forfait choisi pré-remplit l'estimateur (la maintenance renvoie au site vitrine).
  const choose = () => window.dispatchEvent(new CustomEvent("ob:estimate-type", { detail: cat === "maintenance" ? "vitrine" : cat }));

  return (
    <section id="offres" className="wrap sec flex scroll-mt-16 flex-col gap-8">
      <div role="tablist" aria-label={c.type} className="tabs border-b border-[var(--line)] pb-4">
        {SERVICE_CATEGORIES.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={cat === k} aria-controls="offres-panel" onClick={() => setCat(k)} className="tab">
            {CATEGORY_TEXT[k].title[lang]}
          </button>
        ))}
      </div>
      <div id="offres-panel" role="tabpanel" className="g-split gap-10 md:gap-14">
        <div className="flex flex-col gap-3.5">
          <h2 className="h2">{text.title[lang]}</h2>
          <p className="body">{text.intro[lang]}</p>
          <span className="small muted">{c.examples} : {text.examples[lang]}</span>
        </div>
        <div className="grid overflow-hidden rounded-[10px] border border-[var(--line)] bg-[var(--surface)] md:grid-cols-2">
          {plans.map((p, k) => (
            <div
              key={p.slug}
              className={`fade flex flex-col gap-4 p-6 md:p-8 ${k > 0 ? "border-t md:border-t-0 md:border-l border-[var(--line)]" : ""}`}
              style={{ background: p.recommended ? "color-mix(in srgb, var(--accent) 5%, var(--surface))" : undefined }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="h3">{p.name[lang]}</span>
                {p.recommended && <span className="small accent font-semibold">{c.popular}</span>}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="small muted">{p.priceXof == null ? c.afterCall : c.from}</span>
                <span className="num text-[32px] font-semibold tracking-[-0.02em]">
                  {p.priceXof == null ? c.onQuote : formatXof(p.priceXof)}
                  {p.priceXof != null && p.isMonthly && <span className="small muted font-normal"> {c.perMonth}</span>}
                </span>
              </div>
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                <dt className="muted">{c.delay}</dt><dd className="m-0 font-medium">{p.delivery[lang]}</dd>
                <dt className="muted">{c.forWho}</dt><dd className="m-0">{p.audience[lang]}</dd>
              </dl>
              <ul className="m-0 flex list-none flex-col gap-2 border-t border-[var(--line)] p-0 pt-4">
                {p.features.map((f) => (
                  <li key={f.fr} className="small grid grid-cols-[16px_1fr] gap-2">
                    <span className="accent" aria-hidden="true">✓</span>
                    <span>{f[lang]}</span>
                  </li>
                ))}
              </ul>
              <a href="#estimer" onClick={choose} className={`btn mt-auto ${p.recommended ? "btn-p" : "btn-s"}`}>{c.choose}</a>
            </div>
          ))}
        </div>
      </div>
      <p className="small muted m-0">{c.note}</p>
    </section>
  );
}
