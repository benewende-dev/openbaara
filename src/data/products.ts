export type ProductCategory = "course" | "tool" | "service";
export type ProductBadge = "new" | "popular" | "coming-soon" | null;
export type ProductCTA = "buy" | "try-free" | "book-call" | "pre-register";

export interface Product {
  id: string;
  category: ProductCategory;
  nameKey: string;
  descriptionKey: string;
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
    nameKey: "Introduction à l'IA",
    descriptionKey:
      "Comprendre les fondamentaux de l'intelligence artificielle : concepts, outils et applications pratiques.",
    priceXOF: 25000,
    priceUSD: 40,
    badge: "new",
    cta: "buy",
  },
  {
    id: "course-agentic-ai",
    category: "course",
    nameKey: "IA Agentique — Du débutant au pro",
    descriptionKey:
      "Formation complète sur l'IA agentique : architecture multi-agents, orchestration, déploiement en production.",
    priceXOF: 75000,
    priceUSD: 120,
    badge: "popular",
    cta: "buy",
  },
  {
    id: "course-n8n-agents",
    category: "course",
    nameKey: "Automatisation avec n8n & Agents",
    descriptionKey:
      "Automatisez vos workflows avec n8n et les agents IA. De la configuration au déploiement.",
    priceXOF: 50000,
    priceUSD: 80,
    badge: "new",
    cta: "buy",
  },
  {
    id: "course-cli-tools",
    category: "course",
    nameKey: "Maîtriser les outils CLI IA",
    descriptionKey:
      "Claude Code, Cursor, Gemini CLI, Codex, OpenCode, Hermes Agent — maîtrisez les outils qui multiplient votre productivité par 10.",
    priceXOF: 45000,
    priceUSD: 72,
    badge: "new",
    cta: "buy",
  },
  // ─── Outils & SaaS (Studio) ───
  {
    id: "tool-cv-generator",
    category: "tool",
    nameKey: "Générateur de CV Moderne",
    descriptionKey:
      "Créez un CV premium en quelques minutes. Templates modernes, export PDF, palette OpenBaara.",
    priceXOF: 5000,
    priceUSD: 8,
    badge: "popular",
    cta: "try-free",
  },
  {
    id: "tool-brand-dna",
    category: "tool",
    nameKey: "Brand DNA Generator",
    descriptionKey:
      "Générez l'identité de marque de votre entreprise grâce à l'IA — via Outio.",
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
    nameKey: "Audit IA Entreprise",
    descriptionKey:
      "Cartographie complète de vos processus et identification des opportunités d'automatisation par IA agentique.",
    priceXOF: null,
    priceUSD: null,
    badge: null,
    cta: "book-call",
  },
  {
    id: "service-integration",
    category: "service",
    nameKey: "Intégration Agents IA",
    descriptionKey:
      "Déploiement d'agents IA dans vos workflows existants. Automatisation des processus répétitifs.",
    priceXOF: null,
    priceUSD: null,
    badge: null,
    cta: "book-call",
  },
  {
    id: "service-sovereign",
    category: "service",
    nameKey: "Déploiement Souverain",
    descriptionKey:
      "Infrastructure locale, données sensibles protégées. Pour les organisations avec des contraintes de souveraineté.",
    priceXOF: null,
    priceUSD: null,
    badge: null,
    cta: "book-call",
  },
];
