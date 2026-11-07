import { ventures } from "@/data/ventures";
import { listPublished } from "@/lib/journal/articles";
import { COMPANY } from "@/data/studio";

export const dynamic = "force-dynamic";

const SITE = `https://${COMPANY.site}`;

/**
 * llms.txt : un résumé du site au format Markdown, lu par les moteurs de réponse IA
 * (proposition llmstxt.org). Généré à chaque demande depuis les données du site.
 */
export async function GET() {
  const articles = await listPublished();
  const lines = [
    "# OpenBaara",
    "",
    "> OpenBaara est un studio de ventures technologiques basé à Abidjan, en Côte d'Ivoire. Il fonde, construit et opère des entreprises pensées pour l'Afrique de l'Ouest (intelligence artificielle, finance, mobilité, logistique, mode, création), sur des fondations techniques partagées : agents IA, paiements locaux, identité, langues.",
    "",
    "## Le studio",
    "",
    `- [Accueil](${SITE}/fr): présentation du studio et du portefeuille`,
    `- [Société](${SITE}/fr/societe): vision, méthode de travail, équipe, contact`,
    `- [Investisseurs](${SITE}/fr/investisseurs): portefeuille, marchés, création de valeur, documents`,
    `- [Services](${SITE}/fr/services): sites, boutiques, applications, logiciels et agents IA construits pour des clients, avec prix indicatifs`,
    `- [Academy](${SITE}/fr/academy): formations à l'IA appliquée et au produit`,
    "",
    "## Ventures",
    "",
    ...ventures.map((v) => `- [${v.name}](${SITE}/fr/ventures/${v.slug}): ${v.line.fr} (${v.sector.fr} ; ${v.market.fr} ; stade : ${v.stage.fr.toLowerCase()})`),
    "",
    "## Journal",
    "",
    ...(articles.length
      ? articles.map((a) => `- [${a.titleFr}](${SITE}/fr/journal/${a.slug}): ${a.excerptFr}`)
      : ["- Les premiers articles arrivent bientôt."]),
    "",
    "## Contact",
    "",
    `- ${COMPANY.email}`,
    `- ${COMPANY.city}`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=900" } });
}
