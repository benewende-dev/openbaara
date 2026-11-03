"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useCart } from "@/features/store/CartContext";
import { Logo } from "@/components/layout/Logo";
import { Menu, X, ShoppingBag } from "lucide-react";

const LINKS = [
  { href: "/ventures", fr: "Ventures", en: "Ventures" },
  { href: "/societe", fr: "Société", en: "Company" },
  { href: "/services", fr: "Services", en: "Services" },
  { href: "/academy", fr: "Academy", en: "Academy" },
  { href: "/investisseurs", fr: "Investisseurs", en: "Investors" },
] as const;

const COPY = {
  fr: { main: "Navigation principale", contact: "Nous contacter", lang: "Read in English", cart: "Panier", open: "Ouvrir le menu", close: "Fermer le menu" },
  en: { main: "Main navigation", contact: "Contact us", lang: "Lire en français", cart: "Cart", open: "Open menu", close: "Close menu" },
};

export function Navbar() {
  const locale = useLocale() === "en" ? "en" : "fr";
  const c = COPY[locale];
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, toggleCart } = useCart();
  const [open, setOpen] = useState(false);

  // Fermer le menu mobile à chaque changement de page.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  const switchLocale = () => router.replace(pathname, { locale: locale === "fr" ? "en" : "fr" });
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const showCart = itemCount > 0 || ["/boutique", "/academy", "/checkout"].some(isCurrent);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_84%,transparent)] backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <div className="wrap flex h-16 items-center gap-10">
        <Link href="/" aria-label="OpenBaara" className="no-underline">
          <Logo />
        </Link>
        <nav aria-label={c.main} className="hidden lg:flex flex-1 gap-7">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isCurrent(l.href) ? "page" : undefined}
              className="py-1.5 text-sm font-medium text-[var(--fg2)] border-b-[1.5px] border-transparent transition-colors hover:text-[var(--fg)] aria-[current=page]:text-[var(--fg)] aria-[current=page]:border-[var(--fg)]"
            >
              {l[locale]}
            </Link>
          ))}
        </nav>
        <div className="ml-auto lg:ml-0 flex items-center gap-2">
          <button type="button" onClick={switchLocale} className="tab text-[13px]" aria-label={c.lang} lang={locale === "fr" ? "en" : "fr"}>
            {locale === "fr" ? "EN" : "FR"}
          </button>
          {showCart && (
            <button type="button" onClick={toggleCart} className="tab relative" aria-label={`${c.cart} (${itemCount})`}>
              <ShoppingBag className="h-[18px] w-[18px]" aria-hidden="true" />
              {itemCount > 0 && (
                <span className="num absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--fg)] px-1 text-[11px] font-semibold text-[var(--bg)]">
                  {itemCount}
                </span>
              )}
            </button>
          )}
          <Link href="/societe#contact" className="btn btn-p hidden sm:inline-flex h-9 px-3.5">
            {c.contact}
          </Link>
          <button
            type="button"
            className="tab lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? c.close : c.open}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={c.main} className="lg:hidden border-t border-[var(--line)] bg-[var(--bg)]">
          <div className="wrap flex flex-col py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isCurrent(l.href) ? "page" : undefined}
                className="py-3 text-lg font-medium text-[var(--fg2)] border-b border-[var(--line)] aria-[current=page]:text-[var(--fg)]"
              >
                {l[locale]}
              </Link>
            ))}
            <Link href="/societe#contact" className="btn btn-p mt-4 mb-2">
              {c.contact}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
