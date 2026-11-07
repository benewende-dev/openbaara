// ─── Textes du studio partagés entre l'accueil, la page Société et l'espace investisseurs ───

type T = { fr: string; en: string };
type Item = { t: T; d: T };
const i = (tfr: string, ten: string, dfr: string, den: string): Item => ({ t: { fr: tfr, en: ten }, d: { fr: dfr, en: den } });

/** Fondations techniques communes à toutes les ventures. */
export const BRICKS: Item[] = [
  i("Agents IA", "AI agents", "Des assistants qui agissent sous contrôle humain, avec des règles, des limites et une trace de chaque action. Conçus une fois, réutilisés d'une venture à l'autre.", "Assistants that act under human control, with rules, limits and a record of every action. Designed once, reused from one venture to the next."),
  i("Paiements locaux", "Local payments", "Mobile Money, cartes, paiement instantané et paiement à la livraison, intégrés une seule fois et disponibles pour toutes les ventures.", "Mobile Money, cards, instant payment and cash on delivery, integrated once and available to every venture."),
  i("Identité et confiance", "Identity and trust", "Vérification d'identité, sécurité des comptes, gestion des droits et conformité, au niveau qu'exige la finance.", "Identity checks, account security, permissions and compliance, at the level finance demands."),
  i("Langues", "Languages", "Français, anglais et langues locales, à l'écrit comme à la voix, dans chaque produit.", "French, English and local languages, in writing and by voice, in every product."),
  i("Conçu pour le terrain", "Built for the field", "Des applications légères, rapides en 3G et utilisables sur les téléphones d'entrée de gamme.", "Light apps, fast on 3G and usable on entry-level phones."),
  i("Mesure et données", "Measurement and data", "Les mêmes indicateurs pour toutes les ventures, suivis chaque semaine, pour décider sur des faits.", "The same indicators for every venture, tracked weekly, so decisions rest on facts."),
];

/** Méthode de travail, page Société. */
export const PRINCIPLES: Item[] = [
  i("Partir d'un vrai problème", "Start from a real problem", "Chaque venture répond à un problème observé ici, chez des clients réels, avant qu'une seule ligne de code soit écrite.", "Every venture answers a problem observed here, with real customers, before a single line of code is written."),
  i("Construire une fois, réutiliser", "Build once, reuse", "Paiements, identité, agents IA, langues : les briques du studio servent à toutes les ventures et s'améliorent à chaque usage.", "Payments, identity, AI agents, languages: the studio's building blocks serve every venture and improve with each use."),
  i("Écrire avant de coder", "Write before coding", "Chaque produit a sa spécification, ses décisions consignées et ses critères de réussite, connus de toute l'équipe.", "Every product has its specification, its recorded decisions and its success criteria, known to the whole team."),
  i("Valider par étapes", "Validate in stages", "Conception, construction, pilote, lancement : une venture ne passe à l'étape suivante que lorsque les critères de la précédente sont atteints.", "Design, build, pilot, launch: a venture only moves on once the criteria of the previous stage are met."),
  i("Rester sobre", "Stay lean", "Des applications légères, pensées pour les réseaux lents et les téléphones modestes, et des dépenses tenues au plus juste.", "Light apps designed for slow networks and modest phones, and spending kept to what is needed."),
  i("Garder l'humain aux commandes", "Keep people in charge", "Nos agents IA proposent, une personne décide. Chaque action importante est validée et tracée.", "Our AI agents propose, a person decides. Every important action is approved and logged."),
];

/** Pourquoi maintenant, espace investisseurs. */
export const WHY_NOW: Item[] = [
  i("Un espace peu servi", "An under-served space", "Les entreprises technologiques africaines les plus connues sont surtout anglophones. L'Afrique de l'Ouest francophone, avec sa monnaie commune et ses marchés connectés, reste largement à servir.", "Africa's best-known technology companies are mostly English-speaking. French-speaking West Africa, with its shared currency and connected markets, remains largely under-served."),
  i("Des rails déjà en place", "The rails are in place", "Mobile Money, smartphones, monnaie partagée entre huit pays, paiement instantané interopérable : les services numériques peuvent enfin passer d'un pays à l'autre sans tout reconstruire.", "Mobile Money, smartphones, a currency shared by eight countries, interoperable instant payment: digital services can finally cross borders without rebuilding everything."),
  i("Construire coûte moins cher", "Building costs less", "L'IA et l'open source permettent à une équipe resserrée de lancer plusieurs entreprises solides en parallèle, avec un capital bien inférieur à celui d'hier.", "AI and open source let a tight team launch several solid companies in parallel, with far less capital than before."),
  i("Une génération prête", "A generation ready", "Une population jeune, connectée et exigeante, qui adopte vite les services qui lui simplifient la vie et les recommande autour d'elle.", "A young, connected and demanding population that quickly adopts services that make life simpler, and recommends them to others."),
];

/** Comment le studio crée de la valeur, espace investisseurs. */
export const VALUE: Item[] = [
  i("Mutualisation", "Shared costs", "Les briques communes, l'équipe et les outils sont payés une fois et servent à toutes les ventures. Chaque lancement coûte moins cher que le précédent.", "Shared building blocks, team and tools are paid for once and serve every venture. Each launch costs less than the one before."),
  i("Sélection par étapes", "Staged selection", "Une venture ne reçoit de nouveaux moyens que lorsqu'elle atteint les critères fixés à l'étape précédente. Celles qui n'y parviennent pas sont arrêtées ou réorientées.", "A venture only receives new resources once it meets the criteria set at the previous stage. Those that don't are stopped or redirected."),
  i("Gouvernance", "Governance", "Reporting trimestriel, comptes séparés pour chaque venture et accès à une salle de données après accord de confidentialité.", "Quarterly reporting, separate accounts for each venture and access to a data room after a confidentiality agreement."),
  i("Alignement", "Alignment", "Le fondateur et l'équipe sont associés au capital du studio et des ventures. Nous gagnons lorsque nos investisseurs gagnent.", "The founder and the team hold equity in the studio and the ventures. We win when our investors win."),
];

/**
 * Informations sur la société. Une valeur `null` n'est pas affichée :
 * à compléter dès que le document officiel est disponible.
 */
export const COMPANY = {
  name: "OpenBaara",
  legalForm: "SASU" as string | null,
  /** Tant que l'immatriculation n'est pas faite, le site l'indique à côté de la raison sociale. */
  registered: false,
  address: null as string | null,
  city: "Abidjan, Côte d'Ivoire",
  rccm: null as string | null,
  capitalXof: null as number | null,
  president: "Yannick Benewende Rapadamnaba",
  site: "openbaara.com",
  email: "contact@openbaara.com",
};

export const FOUNDER = {
  name: "Yannick Benewende Rapadamnaba",
  role: { fr: "Fondateur et président", en: "Founder and chairman" },
  /** Biographie à fournir : la section l'affiche dès qu'elle est remplie. */
  bio: null as { fr: string; en: string } | null,
  /** Portrait à fournir (fichier dans public/, ex. "/equipe/fondateur.jpg", format 4:5). */
  photo: null as string | null,
  links: [] as { label: string; href: string }[],
};

/** Villes où les ventures opèrent ou se préparent, avec les ventures concernées. */
export const MARKETS: { city: T; country: T; ventures: string[] }[] = [
  { city: { fr: "Abidjan", en: "Abidjan" }, country: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" }, ventures: ["baarali", "colisgo", "jemabi", "baarali-entreprise"] },
  { city: { fr: "Ouagadougou", en: "Ouagadougou" }, country: { fr: "Burkina Faso", en: "Burkina Faso" }, ventures: ["sahely"] },
  { city: { fr: "Bamako", en: "Bamako" }, country: { fr: "Mali", en: "Mali" }, ventures: ["sahely"] },
  { city: { fr: "Niamey", en: "Niamey" }, country: { fr: "Niger", en: "Niger" }, ventures: ["sahely"] },
  { city: { fr: "Lomé", en: "Lomé" }, country: { fr: "Togo", en: "Togo" }, ventures: ["baarali", "nafolia"] },
];
