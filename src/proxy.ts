import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 : « Middleware » est renommé « Proxy » (même fonctionnement).
// next-intl fournit le handler ; on l'expose via l'export nommé `proxy`.
export const proxy = createMiddleware(routing);

export const config = {
  // Toutes les routes sauf API, fichiers statiques, _next, _vercel.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
