import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OpenBaara",
    short_name: "OpenBaara",
    description: "Studio de ventures technologiques à Abidjan.",
    start_url: "/fr",
    display: "standalone",
    background_color: BRAND.ink,
    theme_color: BRAND.ink,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
