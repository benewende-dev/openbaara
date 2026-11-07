import { describe, expect, it } from "vitest";
import { formatFaq, mergeFaq, parseFaq, readingMinutes, slugify } from "./format";

describe("journal", () => {
  it("fabrique des slugs lisibles et sans accents", () => {
    expect(slugify("Pourquoi un studio de ventures à Abidjan ?")).toBe("pourquoi-un-studio-de-ventures-a-abidjan");
    expect(slugify("L'IA, ça change quoi ?")).toBe("lia-ca-change-quoi");
  });

  it("lit une FAQ saisie avec des « ? » et la réécrit à l'identique", () => {
    const text = "? Première question ?\nPremière réponse,\nsur deux lignes.\n\n? Seconde ?\nSeconde réponse.\n\n? Sans réponse";
    const faq = parseFaq(text);
    expect(faq).toEqual([
      { q: "Première question ?", a: "Première réponse, sur deux lignes." },
      { q: "Seconde ?", a: "Seconde réponse." },
    ]);
    expect(parseFaq(formatFaq(faq))).toEqual(faq);
  });

  it("complète l'anglais manquant par le français", () => {
    expect(mergeFaq([{ q: "Q", a: "R" }], [])).toEqual([{ q: { fr: "Q", en: "Q" }, a: { fr: "R", en: "R" } }]);
  });

  it("compte au moins une minute de lecture", () => {
    expect(readingMinutes("Court.")).toBe(1);
    expect(readingMinutes(Array(660).fill("mot").join(" "))).toBe(3);
  });
});
