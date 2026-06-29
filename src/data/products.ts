export type ProductCategory = "course" | "tool" | "service";
export type ProductBadge = "new" | "popular" | "coming-soon" | null;
export type ProductCTA = "buy" | "try-free" | "book-call" | "pre-register";

/** Texte bilingue co-localisé (parité FR/EN par construction). */
export type LocalizedText = { fr: string; en: string };

/** Sélectionne la variante de langue (fallback FR). */
export function pickLocale(text: LocalizedText, locale: string): string {
  return locale === "en" ? text.en : text.fr;
}

export interface Product {
  id: string;
  category: ProductCategory;
  name: LocalizedText;
  description: LocalizedText;
  priceXOF: number | null; // null = "Sur devis" / "On quote"
  priceUSD: number | null;
  isMonthly?: boolean;
  badge: ProductBadge;
  cta: ProductCTA;
  image?: string;
}

export const products: Product[] = [
  // ─── Cours (Academy) ───
  {
    id: "course-intro-ai",
    category: "course",
    name: { fr: "Introduction à l'IA", en: "Introduction to AI" },
    description: {
      fr: "Comprendre les fondamentaux de l'intelligence artificielle : concepts clés, outils et premières applications pratiques.",
      en: "Understand the fundamentals of artificial intelligence: key concepts, tools and first practical applications.",
    },
    priceXOF: 25000,
    priceUSD: 40,
    badge: "new",
    cta: "buy",
  },
  {
    id: "course-agentic-ai",
    category: "course",
    name: {
      fr: "IA agentique — du débutant au professionnel",
      en: "Agentic AI — from beginner to professional",
    },
    description: {
      fr: "Formation complète à l'IA agentique : architecture multi-agents, orchestration et déploiement en production.",
      en: "A complete course on agentic AI: multi-agent architecture, orchestration and production deployment.",
    },
    priceXOF: 75000,
    priceUSD: 120,
    badge: "popular",
    cta: "buy",
  },
  {
    id: "course-n8n-agents",
    category: "course",
    name: {
      fr: "Automatisation avec n8n et les agents IA",
      en: "Automation with n8n and AI agents",
    },
    description: {
      fr: "Automatisez vos processus avec n8n et les agents IA, de la configuration au déploiement.",
      en: "Automate your workflows with n8n and AI agents, from setup to deployment.",
    },
    priceXOF: 50000,
    priceUSD: 80,
    badge: "new",
    cta: "buy",
  },
  {
    id: "course-cli-tools",
    category: "course",
    name: { fr: "Maîtriser les outils CLI pour l'IA", en: "Mastering AI CLI tools" },
    description: {
      fr: "Claude Code, Cursor, Gemini CLI, Codex, OpenCode, Hermes Agent : maîtrisez les outils qui accélèrent significativement votre productivité.",
      en: "Claude Code, Cursor, Gemini CLI, Codex, OpenCode, Hermes Agent: master the tools that significantly accelerate your productivity.",
    },
    priceXOF: 45000,
    priceUSD: 72,
    badge: "new",
    cta: "buy",
  },
  // ─── Outils & SaaS (Studio) ───
  {
    id: "tool-cv-generator",
    category: "tool",
    name: { fr: "Générateur de CV moderne", en: "Modern CV Generator" },
    description: {
      fr: "Créez un CV soigné en quelques minutes : modèles modernes, export PDF, identité OpenBaara.",
      en: "Create a polished CV in minutes: modern templates, PDF export, OpenBaara identity.",
    },
    priceXOF: 5000,
    priceUSD: 8,
    badge: "popular",
    cta: "try-free",
  },
  {
    id: "tool-brand-dna",
    category: "tool",
    name: { fr: "Générateur de Brand DNA", en: "Brand DNA Generator" },
    description: {
      fr: "Construisez l'identité de marque de votre entreprise avec l'IA, propulsé par Outio.",
      en: "Build your company's brand identity with AI, powered by Outio.",
    },
    priceXOF: 15000,
    priceUSD: 24,
    isMonthly: true,
    badge: "coming-soon",
    cta: "pre-register",
  },
  // ─── Services (Solutions) ───
  {
    id: "service-audit",
    category: "service",
    name: { fr: "Audit IA pour entreprise", en: "Enterprise AI audit" },
    description: {
      fr: "Cartographie de vos processus et identification des opportunités d'automatisation par IA agentique.",
      en: "Mapping of your processes and identification of agentic-AI automation opportunities.",
    },
    priceXOF: null,
    priceUSD: null,
    badge: null,
    cta: "book-call",
  },
  {
    id: "service-integration",
    category: "service",
    name: { fr: "Intégration d'agents IA", en: "AI agent integration" },
    description: {
      fr: "Déploiement d'agents IA dans vos processus existants pour automatiser les tâches répétitives.",
      en: "Deployment of AI agents into your existing workflows to automate repetitive tasks.",
    },
    priceXOF: null,
    priceUSD: null,
    badge: null,
    cta: "book-call",
  },
  {
    id: "service-sovereign",
    category: "service",
    name: { fr: "Déploiement souverain", en: "Sovereign deployment" },
    description: {
      fr: "Infrastructure locale et protection des données sensibles, pour les organisations soumises à des contraintes de souveraineté.",
      en: "Local infrastructure and protection of sensitive data, for organizations with sovereignty requirements.",
    },
    priceXOF: null,
    priceUSD: null,
    badge: null,
    cta: "book-call",
  },
];
