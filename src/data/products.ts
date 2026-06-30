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
  // ─── Méta pédagogiques (cours) ───
  level?: LocalizedText; // ex. « Débutant → Pro »
  duration?: LocalizedText; // ex. « 24 h de contenu »
  lessons?: number; // nombre de leçons
  /** Outils/technos couverts — noms de marque, NON traduits. */
  tools?: string[];
}

export const products: Product[] = [
  // ─── Cours (Academy) ───
  {
    id: "course-intro-ai",
    category: "course",
    name: { fr: "Introduction à l'IA", en: "Introduction to AI" },
    description: {
      fr: "Le socle pour démarrer : concepts clés, modèles de langage, génération d'images et premières applications pro. Manipulez ChatGPT, Claude et Gemini dès la première heure.",
      en: "Your starting foundation: core concepts, language models, image generation and first professional applications. Get hands-on with ChatGPT, Claude and Gemini from hour one.",
    },
    priceXOF: 35000,
    priceUSD: 56,
    badge: "new",
    cta: "buy",
    level: { fr: "Débutant", en: "Beginner" },
    duration: { fr: "6 h de contenu", en: "6 h of content" },
    lessons: 24,
    tools: ["ChatGPT", "Claude", "Gemini", "Copilot", "Midjourney"],
  },
  {
    id: "course-prompt-engineering",
    category: "course",
    name: {
      fr: "Prompt Engineering professionnel",
      en: "Professional Prompt Engineering",
    },
    description: {
      fr: "Concevez des prompts fiables et reproductibles : structuration, few-shot, chaînage, gabarits réutilisables et évaluation. La compétence qui démultiplie tous les autres outils.",
      en: "Design reliable, reproducible prompts: structure, few-shot, chaining, reusable templates and evaluation. The skill that amplifies every other tool.",
    },
    priceXOF: 60000,
    priceUSD: 97,
    badge: "new",
    cta: "buy",
    level: { fr: "Débutant → Intermédiaire", en: "Beginner → Intermediate" },
    duration: { fr: "8 h de contenu", en: "8 h of content" },
    lessons: 30,
    tools: ["Claude", "ChatGPT", "Gemini", "OpenAI Playground", "Google AI Studio"],
  },
  {
    id: "course-cli-tools",
    category: "course",
    name: { fr: "Maîtriser les outils CLI pour l'IA", en: "Mastering AI CLI tools" },
    description: {
      fr: "Codez et automatisez à la vitesse de l'IA en ligne de commande : Claude Code, Cursor, Gemini CLI, Codex et OpenCode. Workflows réels, du prototype au déploiement.",
      en: "Code and automate at AI speed from the command line: Claude Code, Cursor, Gemini CLI, Codex and OpenCode. Real workflows, from prototype to deployment.",
    },
    priceXOF: 90000,
    priceUSD: 145,
    badge: null,
    cta: "buy",
    level: { fr: "Intermédiaire", en: "Intermediate" },
    duration: { fr: "10 h de contenu", en: "10 h of content" },
    lessons: 36,
    tools: ["Claude Code", "Cursor", "Gemini CLI", "Codex", "OpenCode", "Aider"],
  },
  {
    id: "course-n8n-agents",
    category: "course",
    name: {
      fr: "Automatisation avec n8n et les agents IA",
      en: "Automation with n8n and AI agents",
    },
    description: {
      fr: "Automatisez vos processus métier de bout en bout : flux n8n, webhooks, connexion aux API et agents IA déclenchés en temps réel. De la configuration au déploiement en production.",
      en: "Automate your business processes end to end: n8n flows, webhooks, API connections and real-time AI-triggered agents. From setup to production deployment.",
    },
    priceXOF: 120000,
    priceUSD: 195,
    badge: "popular",
    cta: "buy",
    level: { fr: "Intermédiaire", en: "Intermediate" },
    duration: { fr: "12 h de contenu", en: "12 h of content" },
    lessons: 40,
    tools: ["n8n", "Make", "Zapier", "Webhooks", "API REST"],
  },
  {
    id: "course-generative-content",
    category: "course",
    name: {
      fr: "Création de contenu avec l'IA générative",
      en: "Content creation with generative AI",
    },
    description: {
      fr: "Produisez images, vidéos, voix et musique de qualité professionnelle : Midjourney, Veo, Runway, ElevenLabs et Suno. Pipeline créatif complet pour marques et créateurs.",
      en: "Produce professional-grade images, video, voice and music: Midjourney, Veo, Runway, ElevenLabs and Suno. A complete creative pipeline for brands and creators.",
    },
    priceXOF: 110000,
    priceUSD: 178,
    badge: "new",
    cta: "buy",
    level: { fr: "Débutant → Intermédiaire", en: "Beginner → Intermediate" },
    duration: { fr: "10 h de contenu", en: "10 h of content" },
    lessons: 34,
    tools: ["Midjourney", "Veo", "Runway", "ElevenLabs", "Suno", "DALL·E"],
  },
  {
    id: "course-rag-assistants",
    category: "course",
    name: {
      fr: "RAG : assistants IA sur vos données",
      en: "RAG: AI assistants on your data",
    },
    description: {
      fr: "Construisez des assistants qui répondent à partir de vos documents : embeddings, bases vectorielles, RAG et déploiement souverain en local avec Ollama. Confidentialité maîtrisée.",
      en: "Build assistants that answer from your own documents: embeddings, vector databases, RAG and sovereign local deployment with Ollama. Privacy under control.",
    },
    priceXOF: 140000,
    priceUSD: 226,
    badge: null,
    cta: "buy",
    level: { fr: "Avancé", en: "Advanced" },
    duration: { fr: "14 h de contenu", en: "14 h of content" },
    lessons: 44,
    tools: ["LangChain", "Pinecone", "Supabase", "Ollama", "Embeddings"],
  },
  {
    id: "course-agentic-ai",
    category: "course",
    name: {
      fr: "IA agentique — du débutant au professionnel",
      en: "Agentic AI — from beginner to professional",
    },
    description: {
      fr: "Le programme phare : architecture multi-agents, orchestration, outils via MCP et déploiement en production. De zéro à un système d'agents autonomes qui travaillent pour vous.",
      en: "The flagship program: multi-agent architecture, orchestration, tools via MCP and production deployment. From zero to a system of autonomous agents working for you.",
    },
    priceXOF: 250000,
    priceUSD: 400,
    badge: "popular",
    cta: "buy",
    level: { fr: "Débutant → Pro", en: "Beginner → Pro" },
    duration: { fr: "24 h de contenu", en: "24 h of content" },
    lessons: 80,
    tools: ["Claude Agent SDK", "LangGraph", "MCP", "n8n", "Vector DB"],
  },
  {
    id: "course-full-path",
    category: "course",
    name: {
      fr: "Parcours IA complet — accès à tous les cours",
      en: "Complete AI path — access to every course",
    },
    description: {
      fr: "L'intégralité de l'Academy en un seul accès : les 7 cours, mises à jour incluses et nouveaux modules à venir. Le chemin complet du débutant au professionnel, au meilleur tarif.",
      en: "The entire Academy in a single pass: all 7 courses, updates included and upcoming modules. The complete path from beginner to professional, at the best price.",
    },
    priceXOF: 600000,
    priceUSD: 970,
    badge: "popular",
    cta: "buy",
    level: { fr: "Tous niveaux", en: "All levels" },
    duration: { fr: "70 h+ de contenu", en: "70 h+ of content" },
    lessons: 288,
    tools: ["Accès à vie", "Mises à jour incluses", "Nouveaux cours inclus"],
  },
  // ─── Outils & SaaS (Studio) ───
  {
    id: "tool-cv-generator",
    category: "tool",
    name: { fr: "Générateur de CV moderne", en: "Modern CV Generator" },
    description: {
      fr: "Créez un CV soigné en quelques minutes : 15 modèles, export PDF multi-pages, photo et sections riches. Gratuit à l'essai, modèles premium débloquables.",
      en: "Create a polished CV in minutes: 15 templates, multi-page PDF export, photo and rich sections. Free to try, premium templates unlockable.",
    },
    priceXOF: 7500,
    priceUSD: 12,
    badge: "popular",
    cta: "try-free",
  },
  {
    id: "tool-brand-dna",
    category: "tool",
    name: { fr: "Générateur de Brand DNA", en: "Brand DNA Generator" },
    description: {
      fr: "Construisez l'identité de marque de votre entreprise avec l'IA — positionnement, ton, charte et déclinaisons. Propulsé par Outio.",
      en: "Build your company's brand identity with AI — positioning, tone, guidelines and assets. Powered by Outio.",
    },
    priceXOF: 25000,
    priceUSD: 40,
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
