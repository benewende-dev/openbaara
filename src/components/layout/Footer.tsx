"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LINKS } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";
import { Mail } from "lucide-react";

// Inline SVG components for brand icons since they are removed in Lucide v1.x
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);


const footerNav = [
  { href: "/", labelKey: "home" },
  { href: "/boutique", labelKey: "store" },
  { href: "/solutions", labelKey: "solutions" },
  { href: "/academy", labelKey: "academy" },
  { href: "/baarali-labs", labelKey: "labs" },
] as const;

const companyNav = [
  { href: "/investisseurs", labelKey: "investors" },
  { href: "/carrieres", labelKey: "careers" },
  { href: "/a-propos", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
] as const;

// Legal links use footer.* keys (legal / privacy / terms)
const legalNav = [
  { href: "/mentions-legales", labelKey: "legal" },
  { href: "/confidentialite", labelKey: "privacy" },
  { href: "/conditions", labelKey: "terms" },
] as const;

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setNewsletterEmail("");
      } else {
        setStatus("error");
        setErrorMsg(data.error || tCommon("formError"));
      }
    } catch {
      setStatus("error");
      setErrorMsg(tCommon("formError"));
    }
  };

  return (
    <footer className="border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
      <div className="container-wide mx-auto section-padding">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo size={30} />
            </Link>
            <p className="text-sm text-muted dark:text-muted-dark leading-relaxed mb-6">
              {t("description")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4.5 h-4.5" />
              </a>
              {LINKS.linkedin !== "#" && (
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4.5 h-4.5" />
                </a>
              )}
              {LINKS.twitter !== "#" && (
                <a
                  href={LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-4.5 h-4.5" />
                </a>
              )}
              <a
                href={`mailto:${LINKS.email}`}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-muted dark:text-muted-dark">
              {t("navigation")}
            </h3>
            <ul className="space-y-2.5">
              {footerNav.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {tNav(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-muted dark:text-muted-dark">
              {t("company")}
            </h3>
            <ul className="space-y-2.5">
              {companyNav.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {tNav(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-muted dark:text-muted-dark">
              Newsletter
            </h3>
            <p className="text-sm text-muted dark:text-muted-dark mb-4">
              {t("description").slice(0, 80)}...
            </p>
            {status === "success" && (
              <div className="mb-2 text-xs font-semibold text-secondary">
                {tCommon("formSuccess")}
              </div>
            )}
            {status === "error" && (
              <div className="mb-2 text-xs font-semibold text-red-500">
                {errorMsg}
              </div>
            )}
            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="email@example.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                disabled={status === "loading"}
                className="flex-1 px-3 py-2 rounded-lg border border-border dark:border-border-dark bg-white dark:bg-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                id="footer-newsletter-email"
              />
              <button
                type="submit"
                disabled={status === "loading" || !newsletterEmail}
                className="px-4 py-2 bg-primary text-black rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                id="footer-newsletter-submit"
              >
                {status === "loading" ? "..." : "OK"}
              </button>
            </form>
          </div>
        </div>

        {/* Legal links */}
        <nav className="pt-8 border-t border-border dark:border-border-dark flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {legalNav.map((link) => (
            <Link
              key={link.labelKey}
              href={link.href}
              className="text-muted dark:text-muted-dark hover:text-primary transition-colors"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted dark:text-muted-dark">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
          <p className="flex items-center gap-1">
            {t("madeIn")}
          </p>
        </div>
      </div>
    </footer>
  );
}
