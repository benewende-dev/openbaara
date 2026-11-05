export type Lang = "fr" | "en";

/** Langue d'une page à partir de son paramètre de route. */
export async function langOf(params: Promise<{ locale: string }>): Promise<Lang> {
  return (await params).locale === "en" ? "en" : "fr";
}
