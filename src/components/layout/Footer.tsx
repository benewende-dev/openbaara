"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/layout/Logo";
import { useTheme, type ThemePref } from "@/components/layout/ThemeProvider";
import { LINKS } from "@/lib/constants";

const COPY = {
  fr: {
    tagline: "Studio de ventures technologiques. Abidjan, Côte d'Ivoire.",
    studio: "Studio",
    offers: "Offres",
    display: "Affichage",
    theme: "Thème",
    themes: { light: "Clair", dark: "Sombre", system: "Système" },
    legal: "Mentions légales",
    privacy: "Confidentialité",
    terms: "Conditions de vente",
  },
  en: {
    tagline: "Technology venture studio. Abidjan, Côte d'Ivoire.",
    studio: "Studio",
    offers: "Offers",
    display: "Display",
    theme: "Theme",
    themes: { light: "Light", dark: "Dark", system: "System" },
    legal: "Legal notice",
    privacy: "Privacy",
    terms: "Terms of sale",
  },
};

const STUDIO = [
  { href: "/ventures", fr: "Ventures", en: "Ventures" },
  { href: "/societe", fr: "Société", en: "Company" },
  { href: "/investisseurs", fr: "Investisseurs", en: "Investors" },
  { href: "/carrieres", fr: "Carrières", en: "Careers" },
] as const;

const OFFERS = [
  { href: "/services", fr: "Services", en: "Services" },
  { href: "/academy", fr: "Academy", en: "Academy" },
  { href: "/boutique", fr: "Boutique", en: "Store" },
  { href: "/cv-generator", fr: "Générateur de CV", en: "CV builder" },
] as const;

const THEMES: ThemePref[] = ["light", "dark", "system"];

export function Footer() {
  const locale = useLocale() === "en" ? "en" : "fr";
  const c = COPY[locale];
  const { pref, mounted, setPref } = useTheme();

  return (
    <footer className="border-t border-[var(--line)]">
      <div className="wrap grid grid-cols-2 gap-10 pt-14 pb-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1 flex flex-col gap-3.5">
          <Logo />
          <p className="small muted m-0 max-w-[34ch]">{c.tagline}</p>
          <a href={`mailto:${LINKS.email}`} className="small link self-start">
            {LINKS.email}
          </a>
        </div>
        <nav aria-label={c.studio} className="small flex flex-col items-start gap-2.5">
          <span className="label">{c.studio}</span>
          {STUDIO.map((l) => (
            <Link key={l.href} href={l.href} className="link">
              {l[locale]}
            </Link>
          ))}
        </nav>
        <nav aria-label={c.offers} className="small flex flex-col items-start gap-2.5">
          <span className="label">{c.offers}</span>
          {OFFERS.map((l) => (
            <Link key={l.href} href={l.href} className="link">
              {l[locale]}
            </Link>
          ))}
        </nav>
        <div className="small flex flex-col gap-2.5">
          <span className="label">{c.display}</span>
          <div role="radiogroup" aria-label={c.theme} className="inline-flex self-start gap-0.5 rounded-lg bg-[var(--bg2)] p-[3px]">
            {THEMES.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={mounted && pref === id}
                onClick={() => setPref(id)}
                className="tab h-[30px] text-[13px]"
              >
                {c.themes[id]}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-4 pb-8">
        <span className="small muted">© {new Date().getFullYear()} OpenBaara</span>
        <span className="small flex flex-wrap gap-5">
          <Link className="link !text-[var(--muted)]" href="/mentions-legales">{c.legal}</Link>
          <Link className="link !text-[var(--muted)]" href="/confidentialite">{c.privacy}</Link>
          <Link className="link !text-[var(--muted)]" href="/conditions">{c.terms}</Link>
        </span>
      </div>
    </footer>
  );
}
