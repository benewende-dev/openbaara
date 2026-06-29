// ─── Brand colors (style OpenAI : blanc/noir purs + accent vert matrix) ───
export const COLORS = {
  matrix: "#00D95A",
  matrixLight: "#2BFF88",
  matrixDark: "#00A847",
  white: "#FFFFFF",
  black: "#000000",
} as const;

// ─── Social / external links ───
export const LINKS = {
  outio: "#", // Will be updated with live URL when available
  github: "https://github.com/benewende-dev",
  linkedin: "#",
  twitter: "#",
  email: "contact@openbaara.com",
} as const;

// ─── CLI/IDE tools used by OpenBaara ───
export const CLI_TOOLS = [
  { name: "Claude Code", category: "AI Agent" },
  { name: "Codex", category: "AI Agent" },
  { name: "Cursor", category: "AI IDE" },
  { name: "Gemini CLI", category: "AI Agent" },
  { name: "OpenCode", category: "AI Agent" },
  { name: "Hermes Agent", category: "AI Agent" },
  { name: "n8n", category: "Automation" },
  { name: "MCP", category: "Protocol" },
  { name: "ACP", category: "Protocol" },
] as const;

// ─── Tech stack (founder bio) ───
export const TECH_STACK = {
  languages: [
    "TypeScript",
    "JavaScript",
    "Python",
    "SQL",
    "HTML/CSS",
  ],
  frontend: [
    "React 19",
    "Next.js 16",
    "Tailwind CSS v4",
    "Radix UI",
    "Framer Motion",
    "Recharts",
    "React Flow",
    "SWR",
  ],
  backend: [
    "Node.js",
    "Next.js API Routes",
    "Server Actions",
    "REST",
    "Prisma 7",
    "PostgreSQL",
  ],
  auth: [
    "NextAuth v5",
    "bcrypt",
    "Rate-limiting",
    "Upstash Redis",
    "DOMPurify",
  ],
  ai: [
    "Multi-model integration",
    "OpenRouter",
    "Pixazo Gateway",
    "Agent orchestration",
    "Text·Image·Video·Audio gen",
    "Shotstack",
  ],
  agentic: [
    "n8n",
    "Workflow automation",
    "MCP",
    "ACP",
    "Claude Code",
    "Multi-agent orchestration",
    "Tool integration",
  ],
  payment: ["Stripe", "CinetPay", "Mobile Money"],
  cloud: [
    "AWS S3",
    "Upstash Redis",
    "Resend",
    "Edge / Serverless",
  ],
  integration: [
    "Stripe API",
    "S3 API",
    "OpenRouter API",
    "Pixazo API",
    "Shotstack API",
    "Webhooks",
    "Async jobs",
  ],
  devops: [
    "Vercel",
    "CI/CD",
    "Docker",
    "Environment management",
  ],
  system: ["Linux", "bash / zsh", "CLI"],
  product: [
    "Design systems",
    "Responsive mobile-first",
    "Accessibility (AA)",
    "i18n (FR/EN)",
  ],
  tools: [
    "Git / GitHub",
    "PR workflow",
    "next-intl",
    "ESLint",
    "Markdown docs",
  ],
  cliIde: [
    "Claude Code",
    "Codex",
    "Cursor",
    "Gemini CLI",
    "OpenCode",
    "Hermes Agent",
  ],
} as const;
