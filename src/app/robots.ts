import type { MetadataRoute } from "next";

// Les pages publiques sont ouvertes à tous les robots, y compris ceux des moteurs de réponse IA,
// pour que le studio et ses ventures puissent y être cités. Les espaces privés restent fermés.
const PRIVATE = ["/admin", "/api", "/fr/espace", "/en/espace", "/fr/checkout", "/en/checkout"];
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Meta-ExternalAgent", "MistralAI-User", "DuckAssistBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://openbaara.com/sitemap.xml",
  };
}
