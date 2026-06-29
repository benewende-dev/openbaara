import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/features/store/CartContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CartDrawer } from "@/components/store/CartDrawer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: {
      default: isEn
        ? "OPENBAARA — African Deep-Tech Holding"
        : "OPENBAARA — Holding Deep-Tech Africaine",
      template: isEn ? "%s | OPENBAARA" : "%s | OPENBAARA",
    },
    description: isEn
      ? "OPENBAARA builds the African agentic orchestration brain — from software to the physical world. Based in Abidjan, Côte d'Ivoire."
      : "OPENBAARA construit le cerveau d'orchestration agentique africain — du logiciel au monde physique. Basée à Abidjan, Côte d'Ivoire.",
    metadataBase: new URL("https://openbaara.com"),
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
      siteName: "OPENBAARA",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ob-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-[#FAFAFA] transition-colors duration-300">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "OPENBAARA",
              "url": "https://openbaara.com",
              "logo": "https://openbaara.com/images/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Abidjan",
                "addressCountry": "CI"
              },
              "sameAs": [
                "https://github.com/benewende-dev",
                "https://linkedin.com",
                "https://twitter.com"
              ]
            })
          }}
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <CartProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
            </CartProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
