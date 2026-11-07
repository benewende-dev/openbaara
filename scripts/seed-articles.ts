// Premiers brouillons du Journal, à relire et publier depuis la console (/admin/articles).
// Relançable : un article déjà présent (même adresse) n'est pas modifié.
//
//   npx tsx scripts/seed-articles.ts

import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }) });

const faq = (...items: [string, string][]) => items.map(([q, a]) => ({ q: { fr: q, en: q }, a: { fr: a, en: a } }));

const DRAFTS = [
  {
    slug: "pourquoi-un-studio-de-ventures-a-abidjan",
    category: "studio",
    titleFr: "Pourquoi un studio de ventures à Abidjan",
    excerptFr:
      "Un studio de ventures fonde et construit plusieurs entreprises sur des fondations communes : paiements, sécurité, agents IA, langues. À Abidjan, ce modèle permet de lancer plus vite, avec moins de risques, des services pensés pour l'Afrique de l'Ouest.",
    bodyFr: `## Ce qu'est un studio de ventures

Un studio de ventures ne finance pas des projets venus d'ailleurs : il les fonde. L'équipe part d'un problème observé sur le terrain, conçoit le produit qui le résout, puis bâtit l'entreprise autour de lui. Chaque entreprise ainsi créée est une *venture*.

La différence avec une start-up isolée tient en un mot : **les fondations**. Une start-up seule doit tout reconstruire, les paiements, la sécurité des comptes, l'infrastructure, l'équipe. Un studio construit ces briques une fois, les améliore à chaque lancement et les met au service de toutes ses ventures.

## Pourquoi l'Afrique de l'Ouest, et pourquoi maintenant

L'Afrique de l'Ouest a déjà fait une partie du chemin : le paiement mobile fait partie du quotidien, le smartphone se généralise et une génération entière a grandi en ligne. Ce qui manque encore, ce sont des entreprises capables de transformer ces usages en services fiables, utiles et durables.

Trois éléments rendent ce moment favorable :

- **Des rails communs.** Les huit pays de l'UEMOA partagent une monnaie, et le paiement mobile y est répandu. Un service peut passer d'un pays à l'autre sans tout reconstruire.
- **Un coût de construction en baisse.** L'intelligence artificielle et l'open source permettent à une équipe resserrée de concevoir des produits qui demandaient hier des dizaines d'ingénieurs.
- **Un espace peu servi.** Les entreprises technologiques africaines les plus connues sont surtout anglophones ; l'Afrique de l'Ouest francophone reste largement à servir.

## Ce que cela change pour chaque venture

Chez OpenBaara, une amélioration des paiements construite pour Sahely profite le jour même à ColisGo ; un agent éprouvé chez les PME clientes de Baarali sert ensuite Baarali Entreprise. Chaque nouvelle venture démarre avec ce qui existe déjà, et se concentre sur ce qui la rend unique.

## Pourquoi Abidjan

Abidjan est le premier centre économique de la zone francophone de l'Afrique de l'Ouest. C'est là que le studio est installé, au contact des clients des premières ventures, avec l'ambition de construire ici des produits utilisés partout : dans la région, sur le continent et auprès de la diaspora.`,
    faq: faq(
      ["Qu'est-ce qu'un studio de ventures ?", "Une structure qui fonde et construit elle-même plusieurs entreprises, en partageant entre elles l'équipe, la technologie et la méthode."],
      ["Quelle différence avec un incubateur ?", "Un incubateur accompagne des projets portés par d'autres. Un studio de ventures conçoit et lance ses propres entreprises, puis les opère."],
      ["Quelles ventures OpenBaara construit-il ?", "Baarali, Sahely, Jemabi, Nafolia, Jelia, ColisGo et Baarali Entreprise, dans l'IA, la finance, la mobilité, la logistique, la mode et la création."],
    ),
  },
  {
    slug: "valider-par-etapes-notre-methode",
    category: "methode",
    titleFr: "Valider par étapes : comment nous décidons de poursuivre une venture",
    excerptFr:
      "Chaque venture d'OpenBaara passe par cinq étapes : conception, construction, pilote, lancement, expansion. Elle ne reçoit de nouveaux moyens que lorsqu'elle atteint les critères fixés à l'étape précédente ; sinon, elle est réorientée ou arrêtée.",
    bodyFr: `## Cinq étapes, des critères écrits à l'avance

Une venture avance selon cinq étapes :

1. **Conception** : le problème est observé chez des clients réels, la réponse est décrite et chiffrée.
2. **Construction** : le produit est développé sur les briques communes du studio.
3. **Pilote** : un premier groupe de clients l'utilise en conditions réelles.
4. **Lancement** : le produit est ouvert au public, avec son modèle économique.
5. **Expansion** : la venture s'étend à d'autres villes ou d'autres pays.

Pour chaque étape, les critères de réussite sont écrits avant de commencer. Une venture ne passe à l'étape suivante, et ne reçoit de nouveaux moyens, que lorsqu'elle les atteint.

## Écrire avant de coder

Chaque produit a sa spécification, ses décisions consignées et ses critères de réussite, connus de toute l'équipe. Écrire d'abord oblige à clarifier le problème, à choisir ce qu'on ne fera pas, et à rendre les décisions vérifiables plus tard.

## Savoir arrêter

Valider par étapes, c'est aussi accepter qu'une venture n'atteigne pas ses critères. Elle est alors réorientée, ou arrêtée. Les moyens qu'elle aurait consommés vont aux ventures qui progressent, et ce qu'elle a construit reste dans les briques communes du studio.

## Où en sont les ventures

Le stade et l'avancement de chaque venture sont affichés sur sa fiche, relus dans son dépôt : Baarali est en bêta publique, Sahely, Jemabi et ColisGo sont en construction, Baarali Entreprise est construite mais en pause, Nafolia est en conception, Jelia se relance sous sa nouvelle marque. Les dates précises figurent dans le dossier investisseur.`,
    faq: faq(
      ["Quelles sont les étapes d'une venture chez OpenBaara ?", "Conception, construction, pilote, lancement et expansion, chacune avec des critères de réussite écrits à l'avance."],
      ["Que se passe-t-il si une venture n'atteint pas ses critères ?", "Elle est réorientée ou arrêtée ; ses moyens vont aux ventures qui progressent et ce qu'elle a construit reste disponible pour le studio."],
    ),
    ventureSlug: null,
  },
  {
    slug: "paiement-instantane-bceao-pi-spi",
    category: "paiements",
    titleFr: "Le paiement instantané de la BCEAO (PI-SPI) : ce qu'il change pour les entreprises",
    excerptFr:
      "La plateforme interopérable du système de paiement instantané de la BCEAO (PI-SPI) permet de payer et d'être payé en temps réel, en francs CFA, entre comptes bancaires et portefeuilles électroniques de l'UEMOA. Les entreprises y accèdent par leur banque.",
    bodyFr: `## Ce qu'est le PI-SPI

Le PI-SPI est le système de paiement instantané mis en place par la Banque centrale des États de l'Afrique de l'Ouest (BCEAO). Il relie les banques et les établissements de monnaie électronique de l'UEMOA : un paiement envoyé depuis un compte ou un portefeuille arrive en quelques secondes, quel que soit l'établissement du destinataire.

Les paiements se font en **francs CFA**, dans les pays de l'Union.

## Ce que cela change pour une entreprise

- **L'interopérabilité.** Un client peut payer depuis sa banque ou son portefeuille mobile, sans que l'entreprise ait besoin d'un compte chez chaque opérateur.
- **Le temps réel.** Le paiement est confirmé immédiatement, ce qui permet de livrer ou d'ouvrir un accès sans attendre.
- **Le paiement par QR code et la demande de paiement.** L'entreprise peut afficher un code à scanner, ou envoyer une demande que le client valide sur son téléphone.

## Comment y accéder

Une entreprise n'accède pas directement au système : elle passe par sa banque, qui propose une interface de programmation (API) homologuée pour les entreprises. Il faut donc demander à sa banque si son offre est disponible, à quelles conditions et avec quels frais, et si un environnement de test est proposé.

## Ce que nous en faisons chez OpenBaara

Les paiements du site OpenBaara et des ventures sont conçus pour accueillir le PI-SPI à côté du Mobile Money et de la carte. Le raccordement se fera dès que notre banque aura ouvert son offre aux entreprises.`,
    faq: faq(
      ["Qu'est-ce que le PI-SPI ?", "Le système de paiement instantané de la BCEAO, qui relie banques et établissements de monnaie électronique de l'UEMOA pour des paiements en temps réel en francs CFA."],
      ["Comment une entreprise peut-elle accepter le PI-SPI ?", "Par sa banque, qui propose une interface homologuée pour les entreprises. Il faut lui demander la disponibilité, les conditions, les frais et l'accès à un environnement de test."],
    ),
    ventureSlug: null,
  },
];

async function main() {
  let created = 0;
  for (const d of DRAFTS) {
    if (await prisma.article.findUnique({ where: { slug: d.slug } })) continue;
    await prisma.article.create({ data: { ...d, status: "draft" } });
    created++;
  }
  console.log(`${created} brouillon(s) créé(s), ${DRAFTS.length - created} déjà présent(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
