// ─── Journal : fonctions pures (catégories, FAQ, temps de lecture, slugs) ───

type T = { fr: string; en: string };

export const CATEGORIES: Record<string, T> = {
  studio: { fr: "Studio", en: "Studio" },
  ventures: { fr: "Ventures", en: "Ventures" },
  methode: { fr: "Méthode", en: "Method" },
  ia: { fr: "Intelligence artificielle", en: "Artificial intelligence" },
  paiements: { fr: "Paiements", en: "Payments" },
  guides: { fr: "Guides", en: "Guides" },
};
export const CATEGORY_IDS = Object.keys(CATEGORIES);

export type FaqItem = { q: T; a: T };

/** Durée de lecture, à 220 mots par minute, arrondie à la minute (1 au minimum). */
export function readingMinutes(markdown: string): number {
  const words = markdown.replace(/[#>*_`\-[\]()!|]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** Slug d'URL lisible : minuscules, sans accents, mots séparés par des tirets. */
export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’'"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * FAQ saisie dans la console : chaque question commence par « ? », la réponse suit.
 *
 *   ? Qu'est-ce qu'un studio de ventures ?
 *   Une structure qui fonde et construit plusieurs entreprises…
 */
export function parseFaq(text: string): { q: string; a: string }[] {
  const items: { q: string; a: string }[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*\?\s*(.+)$/);
    if (m) items.push({ q: m[1].trim(), a: "" });
    else if (items.length && line.trim()) items[items.length - 1].a = `${items[items.length - 1].a} ${line.trim()}`.trim();
  }
  return items.filter((i) => i.q && i.a);
}

export function formatFaq(items: { q: string; a: string }[]): string {
  return items.map((i) => `? ${i.q}\n${i.a}`).join("\n\n");
}

/** Réunit les FAQ française et anglaise saisies séparément (l'anglais reprend le français s'il manque). */
export function mergeFaq(fr: { q: string; a: string }[], en: { q: string; a: string }[]): FaqItem[] {
  return fr.map((f, k) => ({ q: { fr: f.q, en: en[k]?.q ?? f.q }, a: { fr: f.a, en: en[k]?.a ?? f.a } }));
}
