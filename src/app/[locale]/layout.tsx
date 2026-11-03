import "../globals.css";
import "../site.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales } from "@/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/features/store/CartContext";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CartDrawer } from "@/components/store/CartDrawer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", weight: ["400", "500"], display: "swap" });

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
        ? "OpenBaara, technology venture studio in Abidjan"
        : "OpenBaara, studio de ventures technologiques à Abidjan",
      template: "%s | OpenBaara",
    },
    description: isEn
      ? "OpenBaara is a venture studio based in Abidjan. We build the technology companies of West Africa: AI, finance, mobility, logistics, fashion and creation."
      : "OpenBaara est un studio de ventures basé à Abidjan. Nous bâtissons les entreprises technologiques de l'Afrique de l'Ouest : IA, finance, mobilité, logistique, mode et création.",
    metadataBase: new URL("https://openbaara.com"),
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "fr_FR",
      siteName: "OpenBaara",
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
    <html
      lang={locale}
      className={`${geist.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ob-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "OpenBaara",
              "url": "https://openbaara.com",
              "logo": "https://openbaara.com/images/logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Abidjan",
                "addressCountry": "CI"
              },
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
