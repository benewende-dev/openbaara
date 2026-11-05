import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Fixe la racine du workspace : un bun.lock existe dans le dossier parent
  // (/Users/user), ce qui faisait inférer une mauvaise racine à Turbopack.
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Anciennes pages remplacées par la refonte : les liens déjà partagés restent valides.
  async redirects() {
    const moved = [
      ["/a-propos", "/societe"],
      ["/contact", "/societe#contact"],
      ["/solutions", "/services"],
      ["/baarali-labs", "/ventures/baarali-entreprise"],
    ];
    return moved.flatMap(([from, to]) => [
      { source: `/:locale(fr|en)${from}`, destination: `/:locale${to}`, permanent: true },
      { source: from, destination: `/fr${to}`, permanent: true },
    ]);
  },
};

export default withNextIntl(nextConfig);
