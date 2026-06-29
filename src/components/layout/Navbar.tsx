"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useCart } from "@/features/store/CartContext";
import { useTheme } from "@/components/layout/ThemeProvider";
import {
  Menu,
  X,
  ShoppingCart,
  Sun,
  Moon,
  Globe,
} from "lucide-react";

const navLinks = [
  { href: "/", labelKey: "home" },
  { href: "/boutique", labelKey: "store" },
  { href: "/solutions", labelKey: "solutions" },
  { href: "/academy", labelKey: "academy" },
  { href: "/baarali-labs", labelKey: "labs" },
  { href: "/investisseurs", labelKey: "investors" },
  { href: "/carrieres", labelKey: "careers" },
  { href: "/contact", labelKey: "contact" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, mounted, toggleTheme } = useTheme();
  const { itemCount, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = () => {
    const next = locale === "fr" ? "en" : "fr";
    router.replace(pathname, { locale: next });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <nav className="container-wide mx-auto flex items-center justify-between px-4 md:px-6 h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-xl tracking-tight"
            id="nav-logo"
          >
            <span className="text-primary">OPEN</span>
            <span>BAARA</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${
                  pathname === link.href
                    ? "text-primary font-semibold"
                    : "text-[#0A0A0A]/70 dark:text-[#FAFAFA]/70"
                }`}
                id={`nav-${link.labelKey}`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={switchLocale}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Switch language"
              id="nav-lang-toggle"
            >
              <Globe className="w-4 h-4" />
              <span>{t("switchLang")}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
              id="nav-theme-toggle"
            >
              {!mounted ? (
                <span className="w-4.5 h-4.5 block" />
              ) : theme === "dark" ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Cart"
              id="nav-cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors lg:hidden"
              aria-label="Toggle menu"
              id="nav-mobile-toggle"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 dark:bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute top-16 left-0 right-0 glass border-t border-border dark:border-border-dark bg-white/95 dark:bg-[#0A0A0A]/95 p-4 flex flex-col gap-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary/5 font-semibold"
                    : "text-[#0A0A0A]/70 dark:text-[#FAFAFA]/70 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
                id={`nav-mobile-${link.labelKey}`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
            <Link
              href="/carrieres"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-3 rounded-xl bg-primary text-white text-center font-semibold"
              id="nav-mobile-join"
            >
              {t("joinMission")}
            </Link>
          </nav>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-18" />
    </>
  );
}
