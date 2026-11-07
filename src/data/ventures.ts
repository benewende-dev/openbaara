// ─── Les ventures du studio ───
// Source unique des textes des pages Ventures, des fiches, de l'accueil et de l'espace investisseurs.
// Les faits viennent des dépôts des ventures (README, feuilles de route, spécifications),
// relus le 6 novembre 2026. Ordre = ordre d'affichage.
// `stageIdx` : 0 conception, 1 construction, 2 pilote, 3 lancement, 4 expansion.

type T = { fr: string; en: string };
type Item = { t: T; d: T };

export type VentureCategory = "ia" | "crea" | "mob" | "mode" | "fin";

export type Venture = {
  slug: string;
  name: string;
  /** Couleur de marque, reprise du dépôt de la venture. */
  color: string;
  /** Palette réelle de la venture, pour l'afficher telle quelle. */
  palette: { hex: string; name: T }[];
  paletteNote?: T;
  /** Film de présentation (3 minutes au plus), identifiant de la vidéo sur Bunny Stream. */
  film: string | null;
  category: VentureCategory;
  site: string | null;
  stageIdx: number;
  /** En pause : la venture garde ce qu'elle a construit mais n'avance pas en ce moment. */
  paused?: T;
  /**
   * Part réalisée de l'étape en cours, mesurée dans le plan de la venture (0 à 1),
   * ou null si ce plan n'est pas chiffré (on compte alors la moitié de l'étape).
   */
  progress: { within: number | null; basis: T };
  /** Bouton principal de la fiche. */
  cta: "site" | "demo" | "waitlist" | "notify";
  sector: T;
  market: T;
  stage: T;
  next: T;
  line: T;
  pitch: T;
  problem: T;
  answer: T;
  who: Item[];
  model: T;
  edge: T;
  vision: T;
  features: Item[];
  /** Les formes du produit (ordinateur, téléphone…), quand il y en a plusieurs. */
  surfaces?: Item[];
  /** Ce qui existe vraiment aujourd'hui, et ce qui manque encore. */
  today: T[];
  missing: T[];
};

const t = (fr: string, en: string): T => ({ fr, en });
const i = (tfr: string, ten: string, dfr: string, den: string): Item => ({ t: t(tfr, ten), d: t(dfr, den) });

export const CATEGORIES: { id: VentureCategory; label: T }[] = [
  { id: "ia", label: t("Intelligence artificielle", "Artificial intelligence") },
  { id: "crea", label: t("Création", "Creation") },
  { id: "mob", label: t("Mobilité et logistique", "Mobility and logistics") },
  { id: "mode", label: t("Mode", "Fashion") },
  { id: "fin", label: t("Finance", "Finance") },
];

export const STAGES: T[] = [
  t("Conception", "Design"),
  t("Construction", "Build"),
  t("Pilote", "Pilot"),
  t("Lancement", "Launch"),
  t("Expansion", "Expansion"),
];

/** Date de la dernière relecture des dépôts, affichée avec l'avancement. */
export const PROGRESS_DATE = new Date("2026-11-06T00:00:00Z");

/**
 * Avancement d'une venture, de 0 à 100 % : chaque étape franchie compte pour 20 %,
 * plus la part réalisée de l'étape en cours (la moitié si elle n'est pas mesurée).
 */
export function ventureProgress(v: Venture): { pct: number; estimated: boolean } {
  const within = v.progress.within ?? 0.5;
  return { pct: Math.round((v.stageIdx + Math.min(1, Math.max(0, within))) * 20), estimated: v.progress.within === null };
}

export const ventures: Venture[] = [
  {
    slug: "baarali",
    name: "Baarali",
    color: "#1A6DFF",
    palette: [
      { hex: "#1A6DFF", name: t("Bleu Baarali", "Baarali blue") },
      { hex: "#FFFFFF", name: t("Blanc", "White") },
      { hex: "#18181B", name: t("Anthracite", "Anthracite") },
    ],
    film: null,
    category: "ia",
    site: "baarali.com",
    stageIdx: 2,
    progress: {
      within: null,
      basis: t(
        "Bêta publique en accès anticipé : app ordinateur à télécharger, application web et forfaits en ligne. Le lancement commercial suit la création de la société.",
        "Public beta in early access: downloadable desktop app, web app and plans online. The commercial launch follows the company's incorporation.",
      ),
    },
    cta: "site",
    sector: t("Intelligence artificielle", "Artificial intelligence"),
    market: t("Afrique de l'Ouest d'abord, ouvert au monde", "West Africa first, open to the world"),
    stage: t("Pilote : bêta publique", "Pilot: public beta"),
    next: t("Lancement commercial, dès la création d'OpenBaara SASU", "Commercial launch, once OpenBaara SASU is incorporated"),
    line: t(
      "Un assistant IA qui agit pour vous : il écrit, cherche, crée des images, des vidéos, des voix et de la musique, et mène vos tâches jusqu'au bout. Vous validez avant chaque envoi.",
      "An AI assistant that acts for you: it writes, searches, creates images, videos, voices and music, and sees your tasks through. You approve before anything is sent.",
    ),
    pitch: t(
      "Chaque personne a son propre agent, sur une machine à elle dans le cloud, avec sa mémoire, ses fichiers et ses outils. Rien à installer ni à configurer : on se connecte, on demande. L'app parle français, ses prix sont en francs CFA comme en euros, ses forfaits sont pensés pour le Mobile Money, et elle tient sur un téléphone modeste.",
      "Everyone gets their own agent, on a cloud machine of their own, with its memory, files and tools. Nothing to install or configure: sign in and ask. The app speaks French, its prices are in CFA francs as well as euros, its plans are designed for Mobile Money, and it runs on a modest phone.",
    ),
    problem: t(
      "Les assistants IA les plus connus répondent, mais n'agissent pas ; ils sont pensés ailleurs, facturés en dollars par carte, et la création d'images, de vidéos ou de voix demande encore plusieurs outils séparés.",
      "The best-known AI assistants answer but do not act; they are designed elsewhere, billed in dollars by card, and creating images, videos or voices still takes several separate tools.",
    ),
    answer: t(
      "Baarali réunit les meilleurs modèles du moment dans un seul assistant qui agit : il s'organise, choisit ses outils, travaille en arrière-plan et rend un travail fini. Tout ce qui part en votre nom attend votre accord.",
      "Baarali brings today's best models into one assistant that acts: it organises itself, picks its tools, works in the background and hands back finished work. Anything sent in your name waits for your approval.",
    ),
    who: [
      i("Entrepreneurs et PME", "Entrepreneurs and small businesses", "Devis, e-mails, relances, recherches et documents : le travail répétitif confié à un agent qui connaît vos clients et vos prix.", "Quotes, emails, reminders, research and documents: repetitive work handed to an agent that knows your customers and prices."),
      i("Créateurs et marketeurs", "Creators and marketers", "Visuels, vidéos, voix off, musiques et animations aux couleurs de la marque, au prix annoncé avant de lancer.", "Visuals, videos, voice-overs, music and brand-coloured animations, at a price shown before you start."),
      i("Équipes", "Teams", "Des Espaces partagés pour les messages, les fichiers et les tableaux blancs, où chacun appelle son propre agent.", "Shared Spaces for messages, files and whiteboards, where each person calls their own agent."),
    ],
    model: t(
      "Un forfait gratuit pour découvrir, puis des forfaits à la semaine (5 €) ou au mois (20 €, 100 € et 200 €), en francs CFA à parité fixe. Images, vidéos, voix et musiques se paient en crédits médias, par packs de 2, 5 et 20 €. Une création qui échoue est remboursée.",
      "A free plan to start, then weekly (€5) or monthly plans (€20, €100 and €200), in CFA francs at the fixed parity. Images, videos, voices and music are paid in media credits, in packs of €2, €5 and €20. A failed creation is refunded.",
    ),
    edge: t(
      "Baarali s'appuie sur les briques du studio : agents, paiements locaux, langues. Ses agents, éprouvés chaque jour, servent de socle à Baarali Entreprise.",
      "Baarali builds on the studio's blocks: agents, local payments, languages. Its agents, proven every day, are the foundation of Baarali Enterprise.",
    ),
    vision: t(
      "Donner à chaque personne et à chaque PME d'Afrique de l'Ouest un collègue numérique qui ne s'arrête pas, puis porter cet assistant au reste du monde.",
      "To give every person and every small business in West Africa a digital colleague that never stops, then take this assistant to the rest of the world.",
    ),
    features: [
      i("Un assistant qui agit", "An assistant that acts", "Il écrit, résume, cherche sur le web avec ses sources, lit vos fichiers, prépare vos réunions et rédige vos e-mails. Rien ne part sans votre accord.", "It writes, summarises, searches the web with sources, reads your files, prepares your meetings and drafts your emails. Nothing is sent without your approval."),
      i("Images, vidéos, voix, musique", "Images, videos, voices, music", "Affiches, logos, plans filmés, voix off, musiques et jingles, par les meilleurs modèles du moment, au prix affiché avant de lancer.", "Posters, logos, video shots, voice-overs, music and jingles, by today's best models, at a price shown before you start."),
      i("Studio Motion", "Studio Motion", "Du motion design aux couleurs de votre marque : annonces animées, logos animés, chiffres clés, sous-titres, en 9:16, 1:1 ou 16:9, exportés en une minute environ.", "Brand-coloured motion design: animated announcements and logos, key figures, subtitles, in 9:16, 1:1 or 16:9, exported in about a minute."),
      i("Tâches en arrière-plan", "Background tasks", "Des agents qui travaillent seuls, chaque matin ou à chaque e-mail reçu, et vous préviennent à la fin.", "Agents that work on their own, every morning or on each incoming email, and tell you when they are done."),
      i("Espaces d'équipe", "Team Spaces", "Le lieu de l'équipe : messages, fichiers partagés, tableaux blancs, avec l'agent de chacun.", "The team's place: messages, shared files, whiteboards, with each person's agent."),
      i("Mémoire et Apps", "Memory and Apps", "Vos clients, vos prix, vos habitudes restent dans votre espace ; de petits outils de travail se construisent dans Baarali et ont accès à tout l'agent.", "Your customers, prices and habits stay in your space; small work tools are built inside Baarali with access to the whole agent."),
    ],
    surfaces: [
      i("Sur le web et l'ordinateur", "On the web and desktop", "Un poste de travail classique : la conversation, vos fichiers, vos tâches et vos créations, sur Mac, Windows et le navigateur.", "A classic workspace: the conversation, your files, your tasks and your creations, on Mac, Windows and the browser."),
      i("Sur le téléphone (bientôt)", "On the phone (coming soon)", "Un agent qui prend les devants : il fait remonter ce qui demande votre attention (messages, agenda, relances), mène les tâches seul sur sa machine dans le cloud, même téléphone éteint, et vous demande votre accord avant d'envoyer, de payer ou de signer.", "An agent that takes the initiative: it surfaces what needs your attention (messages, calendar, follow-ups), carries out tasks on its own cloud machine even when your phone is off, and asks for your approval before sending, paying or signing."),
    ],
    today: [
      t("Site et application web en ligne (baarali.com, app.baarali.com)", "Website and web app online (baarali.com, app.baarali.com)"),
      t("App ordinateur pour Mac et Windows, en bêta", "Desktop app for Mac and Windows, in beta"),
      t("Un agent par personne dans le cloud, avec mémoire et fichiers", "One agent per person in the cloud, with memory and files"),
      t("Médias, Studio Motion, tâches planifiées, Espaces et Apps", "Media, Studio Motion, scheduled tasks, Spaces and Apps"),
      t("Forfaits et crédits médias publiés", "Plans and media credits published"),
    ],
    missing: [
      t("Le lancement commercial, après la création d'OpenBaara SASU", "The commercial launch, after OpenBaara SASU is incorporated"),
      t("L'app téléphone", "The phone app"),
      t("Le suivi des réunions, annoncé « bientôt »", "Meeting follow-up, announced as coming soon"),
    ],
  },
  {
    slug: "sahely",
    name: "Sahely",
    color: "#141414",
    palette: [
      { hex: "#141414", name: t("Noir", "Black") },
      { hex: "#FFFFFF", name: t("Blanc", "White") },
      { hex: "#F8F7F5", name: t("Surface", "Surface") },
    ],
    paletteNote: t("Noir et blanc ; le rouge est réservé aux erreurs.", "Black and white; red is kept for errors."),
    film: null,
    category: "mob",
    site: null,
    stageIdx: 1,
    progress: {
      within: 67 / 97,
      basis: t(
        "67 tâches réalisées sur 97 dans les lots spécifiés. Prototype VTC : pas encore prêt pour un pilote réel.",
        "67 of 97 tasks done in the specified work packages. VTC prototype: not yet ready for a real pilot.",
      ),
    },
    cta: "waitlist",
    sector: t("Mobilité et commerce", "Mobility and commerce"),
    market: t("Burkina Faso, Mali, Niger ; pilote à Ouagadougou", "Burkina Faso, Mali, Niger; pilot in Ouagadougou"),
    stage: t("Construction : prototype VTC", "Build: VTC prototype"),
    next: t("Pilote VTC à Ouagadougou", "VTC pilot in Ouagadougou"),
    line: t(
      "La super-app du quotidien au Sahel : courses en voiture, livraisons, commerces et, plus tard, bus entre les villes, dans une seule application payée en Mobile Money ou en espèces.",
      "The everyday super-app for the Sahel: car rides, deliveries, shops and, later, intercity buses, in a single app paid by Mobile Money or cash.",
    ),
    pitch: t(
      "Sahely part d'Ouagadougou, avec des voitures, une flotte propre et des chauffeurs indépendants. Les habitants n'ont pas besoin de cinq applications mais d'une seule qui fonctionne, même sur un réseau lent : un compte, un portefeuille, une assistance pour tous les services.",
      "Sahely starts in Ouagadougou, with cars, its own fleet and independent drivers. People don't need five apps but one that works, even on a slow network: one account, one wallet, one support line for every service.",
    ),
    problem: t(
      "Pour une course, une livraison ou un achat, il faut jongler entre numéros de téléphone, intermédiaires et espèces, sans suivi, sans recours et sans prix connu d'avance.",
      "A ride, a delivery or a purchase means juggling phone numbers, middlemen and cash, with no tracking, no recourse and no price known upfront.",
    ),
    answer: t(
      "Sahely réunit ces services dans une application fiable : le prix est affiché avant de partir, les chauffeurs et livreurs sont vérifiés, et l'on paie en espèces ou en Mobile Money depuis un portefeuille unique.",
      "Sahely brings these services into one reliable app: the price is shown before you set off, drivers and couriers are verified, and you pay cash or Mobile Money from a single wallet.",
    ),
    who: [
      i("Les habitants des villes", "City residents", "Se déplacer, se faire livrer et acheter depuis le même téléphone, avec un prix connu d'avance.", "Get around, have things delivered and shop from the same phone, with the price known upfront."),
      i("Chauffeurs, livreurs et commerçants", "Drivers, couriers and shopkeepers", "Des clients réguliers, un portefeuille rechargé par Mobile Money et des retraits, la commission prélevée de façon transparente.", "Regular customers, a wallet topped up by Mobile Money with withdrawals, and a transparent commission."),
      i("Compagnies de transport", "Transport companies", "Après le lancement : vendre leurs places entre les villes, remplir leurs bus, réduire la fraude au guichet.", "After launch: sell intercity seats, fill their buses and reduce ticket-office fraud."),
    ],
    model: t(
      "Une commission sur chaque course, livraison et vente, prélevée sur les portefeuilles des partenaires, qui se rechargent et se retirent en Mobile Money.",
      "A commission on every ride, delivery and sale, taken from partners' wallets, which are topped up and withdrawn by Mobile Money.",
    ),
    edge: t(
      "Sahely et ColisGo partagent la même base : répartition des courses, suivi en direct, paiements. Les règles de livraison de Sahely ont déjà été extraites pour ColisGo.",
      "Sahely and ColisGo share the same foundation: dispatch, live tracking, payments. Sahely's delivery rules have already been extracted for ColisGo.",
    ),
    vision: t(
      "Devenir l'application que l'on ouvre chaque matin au Burkina Faso, au Mali et au Niger, puis porter le modèle dans les autres villes du Sahel.",
      "To become the app people open every morning in Burkina Faso, Mali and Niger, then take the model to the other cities of the Sahel.",
    ),
    features: [
      i("Courses en voiture", "Car rides", "Prix affiché avant de monter, chauffeurs vérifiés, arrêts en route, course pour un proche, objet oublié signalé depuis le reçu.", "Price shown before you get in, verified drivers, stops on the way, rides for a relative, lost items reported from the receipt."),
      i("Livraison de colis", "Parcel delivery", "En moto ou en cargo, suivie jusqu'à la remise, payée par le portefeuille ou à la livraison.", "By motorbike or van, tracked until hand-over, paid from the wallet or on delivery."),
      i("Commerces", "Shops", "Restaurants et boutiques du quartier, commande dans l'app, livraison ou retrait.", "Neighbourhood restaurants and shops, ordered in the app, delivered or picked up."),
      i("Portefeuilles Mobile Money", "Mobile Money wallets", "Pour les clients, chauffeurs, livreurs et commerçants : recharges, retraits, commission prélevée.", "For customers, drivers, couriers and shopkeepers: top-ups, withdrawals, commission taken."),
      i("Assistance", "Support", "Une demande depuis l'aide, le portefeuille ou le suivi d'une commande, avec conversation, photos et rappel.", "A request from help, the wallet or an order's tracking, with chat, photos and call-back."),
      i("Bilingue, pensée pour le réseau", "Bilingual, built for the network", "En français et en anglais, légère, utilisable en 3G et sur les téléphones d'entrée de gamme.", "In French and English, light, usable on 3G and entry-level phones."),
    ],
    today: [
      t("Applications client, chauffeur et partenaire, back-office et API", "Customer, driver and partner apps, back office and API"),
      t("Lots fiabilité et expérience VTC presque terminés", "VTC reliability and experience packages nearly complete"),
      t("Livraison (moto, cargo) et commerce intégrés au code", "Delivery (motorbike, van) and commerce integrated in the code"),
      t("Sauvegarde et restauration exercées, supervision et procédure d'incident", "Backup and restore rehearsed, monitoring and incident procedure"),
    ],
    missing: [
      t("Validation des parcours sur le terrain avant le pilote", "Field validation of journeys before the pilot"),
      t("Colis payés à la livraison (en cours) et trajets sur nos serveurs", "Cash-on-delivery parcels (in progress) and routing on our servers"),
      t("Bus entre les villes, reportés après le lancement", "Intercity buses, postponed until after launch"),
    ],
  },
  {
    slug: "jemabi",
    name: "Jemabi",
    color: "#FFC800",
    palette: [
      { hex: "#FFC800", name: t("Jaune Sahel", "Sahel yellow") },
      { hex: "#12100B", name: t("Encre", "Ink") },
      { hex: "#FBFAF7", name: t("Craie", "Chalk") },
    ],
    film: null,
    category: "mode",
    site: null,
    stageIdx: 1,
    progress: {
      within: 144 / 426,
      basis: t(
        "144 éléments faits sur 426 dans la feuille de route jusqu'au lancement. L'inscription vendeur est construite ; le catalogue et la commande pas encore.",
        "144 of 426 items done in the roadmap to launch. Vendor sign-up is built; the catalogue and ordering are not yet.",
      ),
    },
    cta: "notify",
    sector: t("Mode et accessoires", "Fashion and accessories"),
    market: t("Ouagadougou, puis Abidjan et Dakar ; diaspora", "Ouagadougou, then Abidjan and Dakar; diaspora"),
    stage: t("Construction : inscription vendeur", "Build: vendor sign-up"),
    next: t("Catalogue et commande, puis lancement à Ouagadougou", "Catalogue and ordering, then launch in Ouagadougou"),
    line: t(
      "La place de marché mobile de la mode et des accessoires en Afrique de l'Ouest : ce que vous voyez est ce que vous recevez, payé d'avance en Mobile Money ou par carte, livré par des partenaires.",
      "The mobile marketplace for fashion and accessories in West Africa: what you see is what you get, paid upfront by Mobile Money or card, delivered by partners.",
    ),
    pitch: t(
      "Jemabi réunit des vendeurs indépendants dans une seule application, sur iPhone, Android et ordinateur. Jemabi encaisse, garantit et reverse : le vendeur ne touche jamais l'argent directement. Photos prises sur l'article réel, mesures en centimètres, vérification avant acceptation : c'est la raison d'être du produit.",
      "Jemabi brings independent sellers into a single app, on iPhone, Android and desktop. Jemabi collects, guarantees and pays out: sellers never handle the money directly. Photos taken of the real item, measurements in centimetres, checking before acceptance: that is why the product exists.",
    ),
    problem: t(
      "La mode se vend surtout par messages : photos qui ne ressemblent pas à l'article, tailles qui ne veulent rien dire d'un vendeur à l'autre, paiement à l'aveugle et livraisons incertaines.",
      "Fashion is mostly sold through messages: photos that don't match the item, sizes that mean nothing from one seller to the next, blind payments and uncertain deliveries.",
    ),
    answer: t(
      "Jemabi garantit l'achat : le paiement est séquestré, l'acheteur vérifie à la réception et peut refuser, le vendeur est payé trois jours après acceptation. La mesure prime sur l'étiquette.",
      "Jemabi guarantees the purchase: payment is held in escrow, the buyer checks on delivery and can refuse, the seller is paid three days after acceptance. Measurements beat labels.",
    ),
    who: [
      i("Vendeurs et créateurs", "Sellers and designers", "Une boutique sans limite d'articles et sans frais de visibilité, payée par une commission sur les ventes seulement.", "A shop with no item limit and no visibility fees, paid only through a commission on sales."),
      i("Acheteurs de la région", "Buyers in the region", "Acheter en confiance, payer en Mobile Money ou par carte, voir le délai de livraison de sa ville.", "Buy with confidence, pay by Mobile Money or card, see the delivery time for their city."),
      i("La diaspora", "The diaspora", "Acheter depuis l'Europe dès le lancement et faire livrer au pays ; le destinataire constate et peut refuser.", "Buy from Europe from launch and have it delivered back home; the recipient checks and can refuse."),
    ],
    model: t(
      "Une commission de 10 % sur les produits, 500 F au minimum par commande au lancement. Tout le reste est gratuit : on ne vend jamais de visibilité. Le seul abonnement prévu, celui de la vente en direct, viendra après le lancement.",
      "A 10% commission on products, with a 500 F minimum per order at launch. Everything else is free: visibility is never sold. The only planned subscription, for live selling, will come after launch.",
    ),
    edge: t(
      "Les paiements du studio, l'expérience de la livraison avec Sahely et l'assistant IA branché sur Jelia donnent à Jemabi une base solide dès le premier jour.",
      "The studio's payments, delivery experience from Sahely and an AI assistant connected to Jelia give Jemabi a solid base from day one.",
    ),
    vision: t(
      "Devenir l'adresse de référence pour acheter la mode et les accessoires en Afrique de l'Ouest, d'Ouagadougou à Dakar et depuis la diaspora.",
      "To become the go-to address for buying fashion and accessories in West Africa, from Ouagadougou to Dakar and from the diaspora.",
    ),
    features: [
      i("Ce que vous voyez est ce que vous recevez", "What you see is what you get", "Photos prises par le vendeur sur l'article réel, mesures en centimètres relevées à plat, fiabilité du vendeur mesurée et affichée.", "Photos taken by the seller of the real item, flat measurements in centimetres, seller reliability measured and shown."),
      i("Paiement d'avance, fonds séquestrés", "Upfront payment, funds in escrow", "Mobile Money, carte ou paiement à la livraison ; le vendeur est payé après acceptation du colis.", "Mobile Money, card or cash on delivery; the seller is paid after the parcel is accepted."),
      i("Livraison par des partenaires", "Delivery by partners", "Coursiers indépendants et sociétés de livraison inscrites, points de retrait, délai affiché par ville.", "Independent couriers and registered delivery companies, pick-up points, delivery time shown by city."),
      i("Achat depuis la diaspora", "Buying from the diaspora", "Paiement par carte depuis l'Europe, livraison au pays, remboursement si le destinataire refuse.", "Card payment from Europe, delivery back home, refund if the recipient refuses."),
      i("Pensée pour le mobile et le réseau lent", "Built for mobile and slow networks", "Navigation au pouce, images légères, catalogue et panier gardés hors ligne.", "Thumb navigation, light images, catalogue and cart kept offline."),
      i("À venir", "Coming later", "Vues à 360°, vente en direct, conseil de styliste, essayage et assistant à la voix.", "360° views, live selling, stylist advice, try-on and a voice assistant."),
    ],
    today: [
      t("Application iOS, Android et ordinateur sur une seule base de code", "iOS, Android and desktop app on a single codebase"),
      t("Système de design et bibliothèque de composants, 287 tests", "Design system and component library, 287 tests"),
      t("Inscription vendeur, file de validation, envoi des pièces et connexion par code", "Vendor sign-up, review queue, document upload and code sign-in"),
    ],
    missing: [
      t("Catalogue, panier et commande", "Catalogue, cart and ordering"),
      t("Paiement et reversement aux vendeurs", "Payment and payouts to sellers"),
    ],
  },
  {
    slug: "nafolia",
    name: "Nafolia",
    color: "#2F5BFF",
    palette: [
      { hex: "#2F5BFF", name: t("Bleu Nafolia", "Nafolia blue") },
      { hex: "#0A0B0F", name: t("Nuit", "Night") },
      { hex: "#7C9BFF", name: t("Bleu clair", "Light blue") },
    ],
    film: null,
    category: "fin",
    site: null,
    stageIdx: 0,
    progress: {
      within: null,
      basis: t(
        "Vision, architecture et dix spécifications de la V1 rédigées, en brouillon. Aucun code encore.",
        "Vision, architecture and ten V1 specifications written, in draft. No code yet.",
      ),
    },
    cta: "waitlist",
    sector: t("Finance", "Finance"),
    market: t("Diaspora du Burkina Faso, du Mali et du Niger, puis l'UEMOA", "Diaspora of Burkina Faso, Mali and Niger, then WAEMU"),
    stage: t("Conception : spécifications", "Design: specifications"),
    next: t("Construire la V1 : le corridor France → Burkina Faso", "Build V1: the France → Burkina Faso corridor"),
    line: t(
      "Une banque en ligne haut de gamme, pensée autour d'agents IA, pour la diaspora qui vit des deux côtés de la mer : envoyer, payer directement les factures et l'école, et savoir ce que devient son argent.",
      "A premium online bank built around AI agents, for the diaspora living on both sides of the sea: send money, pay bills and school fees directly, and know what becomes of it.",
    ),
    pitch: t(
      "Nafolia s'adresse aux jeunes actifs de la diaspora qui gagnent en euros ou en dollars et vivent à moitié au pays. Envoyer de l'argent est facile ; savoir ce qu'il devient ne l'est pas. Nafolia n'est pas un établissement bancaire : les comptes seront tenus par des partenaires agréés.",
      "Nafolia is for young diaspora professionals who earn in euros or dollars and live half their lives back home. Sending money is easy; knowing what becomes of it is not. Nafolia is not a bank: accounts will be held by licensed partners.",
    ),
    problem: t(
      "Argent détourné, factures impayées, chantiers qui n'avancent pas, frais opaques : et aucune banque qui traite ce client comme un client haut de gamme des deux côtés.",
      "Diverted money, unpaid bills, building projects that stall, opaque fees: and no bank that treats these customers as premium clients on both sides.",
    ),
    answer: t(
      "Nafolia paie directement les factures et la scolarité, avec des preuves, programme les envois à la famille, et confie à des agents IA, sous mandat, les tâches que le client valide.",
      "Nafolia pays bills and school fees directly, with proof, schedules transfers to family, and hands tasks to AI agents acting under mandate, which the customer approves.",
    ),
    who: [
      i("La diaspora", "The diaspora", "Paris, Montréal, New York, Dubaï : soutenir sa famille et ses projets au pays, de façon vérifiable.", "Paris, Montreal, New York, Dubai: support family and projects back home, verifiably."),
      i("Les proches au pays", "Relatives back home", "Une app Proches gratuite pour recevoir, retirer, demander et prouver.", "A free Relatives app to receive, withdraw, request and prove."),
      i("Les familles et leurs projets", "Families and their projects", "Factures, école et, plus tard, chantiers payés par étape sur preuve.", "Bills, school and, later, building projects paid in stages on proof."),
    ],
    model: t(
      "Trois formules, Essentiel, Plus et Metal, du transfert à frais fixes affichés jusqu'au conseiller dédié. Les prix restent à définir.",
      "Three plans, Essential, Plus and Metal, from transfers with fixed fees shown upfront to a dedicated adviser. Prices are still to be set.",
    ),
    edge: t(
      "Nafolia s'appuie sur la brique Identité et confiance du studio et sur ses agents IA : l'IA propose, le code décide, le client signe.",
      "Nafolia builds on the studio's Identity and trust block and its AI agents: the AI proposes, the code decides, the customer signs.",
    ),
    vision: t(
      "Offrir aux Ouest-Africains, où qu'ils vivent, une banque qui comprend une vie entre plusieurs pays, avec un niveau de service digne des meilleures banques privées.",
      "To give West Africans, wherever they live, a bank that understands a life across several countries, with service worthy of the best private banks.",
    ),
    features: [
      i("Envois vers le Mobile Money", "Transfers to Mobile Money", "Ponctuels ou programmés, frais connus d'avance, suivis jusqu'à réception.", "One-off or scheduled, fees known upfront, tracked until received."),
      i("Famille : factures et école", "Family: bills and school", "Payées directement au fournisseur ou à l'établissement, avec preuves.", "Paid directly to the supplier or school, with proof."),
      i("App Proches", "Relatives app", "Gratuite pour les proches : recevoir, retirer, demander, prouver.", "Free for relatives: receive, withdraw, request, prove."),
      i("Agents IA sous mandat", "AI agents under mandate", "Ils agissent dans les limites que le client a fixées, à la voix, en français et en langues nationales.", "They act within the limits the customer has set, by voice, in French and national languages."),
      i("Sécurité de banque privée", "Private-bank security", "Cercle de confiance, contrôle par le risque, code de contrainte en cas de pression.", "Circle of trust, risk-based checks, a duress code in case of pressure."),
      i("Multi-devises", "Multi-currency", "Franc CFA, euro et un compte en dollars numériques, cartes virtuelles, physiques et métal selon la formule.", "CFA franc, euro and a digital dollar account, virtual, physical and metal cards depending on the plan."),
    ],
    today: [
      t("Vision, offres et architecture rédigées", "Vision, plans and architecture written"),
      t("Dix spécifications de la V1, du socle au corridor France → Burkina Faso", "Ten V1 specifications, from the ledger to the France → Burkina Faso corridor"),
      t("Modèle de menace et sécurité spécifiés", "Threat model and security specified"),
    ],
    missing: [
      t("Le code", "The code"),
      t("Les partenaires bancaires agréés", "Licensed banking partners"),
    ],
  },
  {
    slug: "jelia",
    name: "Jelia",
    color: "#141414",
    palette: [
      { hex: "#141414", name: t("Noir", "Black") },
      { hex: "#FFFFFF", name: t("Blanc", "White") },
    ],
    paletteNote: t("Identité à venir avec la nouvelle marque.", "Identity to come with the new brand."),
    film: null,
    category: "crea",
    site: null,
    stageIdx: 1,
    progress: {
      within: null,
      basis: t(
        "Studios image, vidéo, cinéma, audio et avatars construits de mars à septembre 2026 (sous le nom de travail wenastudio) et déjà mis en ligne une première fois. À relancer sous la marque Jelia.",
        "Image, video, cinema, audio and avatar studios built from March to September 2026 (under the working name wenastudio) and already put online once. To be relaunched under the Jelia brand.",
      ),
    },
    cta: "waitlist",
    sector: t("Création et IA", "Creation and AI"),
    market: t("Afrique francophone, puis le monde", "French-speaking Africa, then the world"),
    stage: t("Construction : relance sous la marque Jelia", "Build: relaunch under the Jelia brand"),
    next: t("Relance publique sous la marque Jelia", "Public relaunch under the Jelia brand"),
    line: t(
      "Le studio de création par IA : images, vidéos, films, musique, voix et avatars, du script au montage, pour raconter une histoire, une marque ou un artiste.",
      "The AI creation studio: images, videos, films, music, voices and avatars, from script to final cut, to tell the story of a person, a brand or an artist.",
    ),
    pitch: t(
      "Jelia tient son nom du jeli, le griot mandingue : celui qui raconte, chante et garde la mémoire. Le studio réunit ce qui demanderait d'habitude une dizaine d'abonnements, et passe d'un modèle à l'autre selon la tâche, au coût le plus juste.",
      "Jelia takes its name from the jeli, the Mande griot: the one who tells, sings and keeps memory. The studio brings together what would usually take a dozen subscriptions, and switches from one model to another depending on the task, at the fairest cost.",
    ),
    problem: t(
      "Produire une vidéo, une musique, une voix off ou une campagne demande plusieurs outils coûteux, payables par carte internationale, rarement pensés pour les langues, les voix et les visages du continent.",
      "Producing a video, a song, a voice-over or a campaign takes several expensive tools, payable by international card, rarely designed for the continent's languages, voices and faces.",
    ),
    answer: t(
      "Jelia rassemble tous les studios dans une seule application : on décrit, on ajuste, on publie. Chaque action a un coût affiché en crédits avant de lancer.",
      "Jelia brings every studio into one app: describe, refine, publish. Every action has a cost shown in credits before you start.",
    ),
    who: [
      i("Créateurs et influenceurs", "Creators and influencers", "Publier plus souvent, avec une qualité de production qui demandait hier une équipe entière, et un personnage récurrent décliné à l'infini.", "Publish more often, with production quality that used to take a whole team, and a recurring character endlessly reused."),
      i("Marques et agences", "Brands and agencies", "Identité de marque tirée d'une adresse web, campagnes cohérentes et publication sur plusieurs réseaux.", "Brand identity extracted from a web address, consistent campaigns and publishing across several networks."),
      i("Artistes et musiciens", "Artists and musicians", "Musique, albums multipistes, clips, pochettes, et une voix off dans sa propre voix.", "Music, multitrack albums, music videos, covers, and voice-overs in their own voice."),
    ],
    model: t(
      "Des forfaits avec crédits de création inclus, et des crédits supplémentaires payables en Mobile Money ou par carte. Le coût de chaque création est affiché avant de lancer.",
      "Plans with creation credits included, and extra credits payable by Mobile Money or card. The cost of each creation is shown before you start.",
    ),
    edge: t(
      "Jelia reprend le travail créatif de l'ancien Baarali et s'appuie sur les briques du studio ; il sert aussi de moteur créatif à d'autres ventures, comme l'assistant de Jemabi.",
      "Jelia carries forward the creative work of the former Baarali and builds on the studio's blocks; it also serves as the creative engine for other ventures, such as Jemabi's assistant.",
    ),
    vision: t(
      "Être le griot numérique de chaque créateur africain : mettre un studio de production complet dans son téléphone, et donner à ses histoires la qualité qu'il faut pour toucher le monde.",
      "To be every African creator's digital griot: put a complete production studio in their phone, and give their stories the quality they need to reach the world.",
    ),
    features: [
      i("Images et vidéos", "Images and videos", "Génération et retouche d'images, clips, image vers vidéo, cohérence garantie par une image de référence.", "Image generation and editing, clips, image to video, consistency kept by a reference image."),
      i("Cinéma", "Cinema", "Films et séries : du script aux scènes, de la production au montage, avec le son.", "Films and series: from script to scenes, from production to editing, with sound."),
      i("Musique et voix", "Music and voices", "Musiques, voix off, clonage de voix, podcasts à plusieurs voix, albums multipistes.", "Music, voice-overs, voice cloning, multi-voice podcasts, multitrack albums."),
      i("Avatars et influenceur IA", "Avatars and AI influencer", "Un avatar cohérent, un personnage récurrent et ses contenus, une narration dans votre propre voix.", "A consistent avatar, a recurring character and its content, narration in your own voice."),
      i("Marque et réseaux sociaux", "Brand and social media", "Identité de marque, campagnes, planification et publication sur plusieurs réseaux.", "Brand identity, campaigns, scheduling and publishing across several networks."),
      i("Vendre ses créations", "Selling your work", "Boutique, distribution musicale et revenus du créateur.", "Shop, music distribution and creator revenue."),
    ],
    today: [
      t("Studios image, vidéo, cinéma, audio et avatars construits", "Image, video, cinema, audio and avatar studios built"),
      t("Identité de marque, campagnes et publication sur les réseaux", "Brand identity, campaigns and social publishing"),
      t("Crédits, paiements locaux et boutique", "Credits, local payments and shop"),
      t("Déjà mis en ligne une première fois, sous le nom de Baarali", "Already put online once, under the Baarali name"),
    ],
    missing: [
      t("La nouvelle marque Jelia et sa mise en ligne", "The new Jelia brand and going live"),
    ],
  },
  {
    slug: "colisgo",
    name: "ColisGo",
    color: "#141414",
    palette: [
      { hex: "#141414", name: t("Noir", "Black") },
      { hex: "#FFFFFF", name: t("Blanc", "White") },
    ],
    paletteNote: t("Identité à venir ; ColisGo repose sur la base de Sahely.", "Identity to come; ColisGo is built on the Sahely foundation."),
    film: null,
    category: "mob",
    site: null,
    stageIdx: 1,
    progress: {
      within: 0 / 15,
      basis: t(
        "Début de la construction : 0 ticket fermé sur 15. Les règles de livraison ont été extraites de Sahely et testées ; aucune application ColisGo ne fonctionne encore.",
        "Start of build: 0 of 15 tickets closed. Delivery rules have been extracted from Sahely and tested; no ColisGo app works yet.",
      ),
    },
    cta: "notify",
    sector: t("Logistique", "Logistics"),
    market: t("Abidjan", "Abidjan"),
    stage: t("Construction : fondation", "Build: foundation"),
    next: t("Apps client et livreur sur la base Sahely", "Customer and courier apps on the Sahely foundation"),
    line: t(
      "La livraison de colis à Abidjan en moto, voiture et cargo, avec une flotte propre et des partenaires : prix affiché avant l'envoi, suivi en direct et une offre pour les commerçants.",
      "Parcel delivery in Abidjan by motorbike, car and van, with its own fleet and partners: price shown before sending, live tracking and an offer for merchants.",
    ),
    pitch: t(
      "ColisGo commence à Abidjan, là où le commerce en ligne grandit et où la livraison reste son point faible. Chaque envoi a un prix ferme, un livreur identifié et un suivi partagé jusqu'à la remise.",
      "ColisGo starts in Abidjan, where online commerce is growing and delivery is still its weak point. Every shipment has a fixed price, an identified courier and shared tracking until hand-over.",
    ),
    problem: t(
      "À Abidjan, envoyer un colis veut souvent dire trouver un livreur par téléphone, négocier le prix et attendre sans suivi, avec peu de recours en cas de perte.",
      "In Abidjan, sending a parcel often means finding a courier by phone, haggling over the price and waiting without tracking, with little recourse if it is lost.",
    ),
    answer: t(
      "ColisGo affiche le prix avant l'envoi, choisit le véhicule adapté et laisse l'expéditeur comme le destinataire suivre le colis jusqu'à sa remise.",
      "ColisGo shows the price before sending, picks the right vehicle and lets both sender and recipient follow the parcel until it is handed over.",
    ),
    who: [
      i("Particuliers", "Individuals", "Envoyer un document, un cadeau ou un achat à travers la ville, sans négocier.", "Send a document, a gift or a purchase across town, without haggling."),
      i("Commerçants : ColisGo Pro", "Merchants: ColisGo Pro", "Expédier chaque jour à des tarifs prévisibles, avec encaissement à la livraison.", "Ship every day at predictable rates, with cash collected on delivery."),
      i("Livreurs internes et partenaires", "In-house and partner couriers", "Des missions régulières, un revenu clair et un paiement rapide.", "Regular jobs, clear income and fast payment."),
    ],
    model: t(
      "Un prix par course selon la distance et le véhicule, et un abonnement ColisGo Pro pour les commerçants.",
      "A price per job based on distance and vehicle, and a ColisGo Pro subscription for merchants.",
    ),
    edge: t(
      "ColisGo reprend la base de Sahely : répartition des courses, suivi en direct, paiements. Le coût de lancement s'en trouve fortement réduit.",
      "ColisGo reuses the Sahely foundation: dispatch, live tracking, payments. That sharply cuts the cost of launching.",
    ),
    vision: t(
      "Devenir le réseau de livraison de référence d'Abidjan, puis des grandes villes de la sous-région, au service du commerce en ligne qui s'y développe.",
      "To become the reference delivery network in Abidjan, then in the region's major cities, serving the online commerce growing there.",
    ),
    features: [
      i("Moto, voiture, cargo", "Motorbike, car, van", "Le véhicule adapté à la taille du colis, choisi automatiquement.", "The right vehicle for the parcel's size, chosen automatically."),
      i("Suivi en direct", "Live tracking", "Un lien de suivi pour l'expéditeur et le destinataire.", "A tracking link for sender and recipient."),
      i("Paiement à la livraison", "Cash on delivery", "Le livreur encaisse pour le commerçant, qui reçoit le montant rapidement.", "The courier collects for the merchant, who receives the amount quickly."),
      i("Preuve de remise", "Proof of delivery", "Code de confirmation, photo ou signature à chaque livraison.", "Confirmation code, photo or signature on every delivery."),
      i("ColisGo Pro", "ColisGo Pro", "Une offre et un espace pour les commerçants qui expédient chaque jour.", "An offer and a space for merchants who ship every day."),
      i("Console d'opérations", "Operations console", "Répartition, support, finance et flotte, pour l'équipe.", "Dispatch, support, finance and fleet, for the team."),
    ],
    today: [
      t("Spécification produit, parcours, modèle de données et critères de lancement", "Product spec, journeys, data model and launch criteria"),
      t("Règles de livraison (prix, frais de retour, états) extraites de Sahely et testées", "Delivery rules (prices, return fees, states) extracted from Sahely and tested"),
    ],
    missing: [
      t("Les applications client et livreur, la console et le paiement", "The customer and courier apps, the console and payment"),
    ],
  },
  {
    slug: "baarali-entreprise",
    name: "Baarali Entreprise",
    color: "#101012",
    palette: [
      { hex: "#0B0B0C", name: t("Noir", "Black") },
      { hex: "#FFFFFF", name: t("Blanc", "White") },
      { hex: "#F4F4F5", name: t("Gris clair", "Light grey") },
    ],
    paletteNote: t("Volontairement sans couleur : le contraste fait la marque.", "Deliberately colourless: contrast is the brand."),
    film: null,
    category: "ia",
    site: null,
    stageIdx: 1,
    paused: t(
      "En pause depuis août 2026, le temps que Baarali avance. Le travail est consigné pour la reprise.",
      "Paused since August 2026 while Baarali moves forward. The work is documented for the restart.",
    ),
    progress: {
      within: null,
      basis: t(
        "Plateforme construite et testée (cloisonnement, connaissances, agents, canaux, supervision). L'encaissement manque. En pause.",
        "Platform built and tested (isolation, knowledge, agents, channels, monitoring). Billing is missing. Paused.",
      ),
    },
    cta: "demo",
    sector: t("Intelligence artificielle", "Artificial intelligence"),
    market: t("Afrique francophone", "French-speaking Africa"),
    stage: t("Construction : en pause", "Build: paused"),
    next: t("Reprise après Baarali", "Restart after Baarali"),
    line: t(
      "Une plateforme d'agents IA souveraine pour les entreprises et les institutions : construire, déployer et superviser des agents métier, sans que les données quittent l'infrastructure du client.",
      "A sovereign AI agent platform for companies and institutions: build, deploy and monitor business agents, without data ever leaving the client's infrastructure.",
    ),
    pitch: t(
      "Baarali Entreprise met la sécurité et la souveraineté des données au cœur du produit, pas en option : un réglage envoie toute l'IA vers un moteur local, jusqu'à l'installation sans connexion. Et l'agent propose, une personne habilitée signe : aucun chemin ne mène de l'agent à l'exécution.",
      "Baarali Enterprise puts data security and sovereignty at the heart of the product, not as an option: one setting routes all AI to a local engine, up to fully offline installation. And the agent proposes, an authorised person signs: no path leads from the agent to execution.",
    ),
    problem: t(
      "Les entreprises et les institutions veulent des agents IA branchés sur leurs données, mais ces données sont sensibles, réglementées, et ne peuvent pas quitter leur infrastructure.",
      "Companies and institutions want AI agents connected to their data, but that data is sensitive, regulated, and cannot leave their infrastructure.",
    ),
    answer: t(
      "Baarali Entreprise déploie des agents métier chez le client, les relie à ses documents et à ses systèmes avec des droits stricts, et mesure leur qualité, leur disponibilité et leur coût.",
      "Baarali Enterprise deploys business agents on the client's premises, connects them to its documents and systems with strict rights, and measures their quality, uptime and cost.",
    ),
    who: [
      i("Grandes entreprises", "Large companies", "Automatiser l'accueil, l'administration, les RH, le juridique et la relation client sans exposer leurs données.", "Automate front desk, administration, HR, legal and customer relations without exposing their data."),
      i("Banques, assurances, opérateurs", "Banks, insurers, operators", "Des agents conformes aux exigences de confidentialité de leur secteur.", "Agents that meet their sector's confidentiality requirements."),
      i("Administrations et institutions", "Public bodies and institutions", "Servir les usagers sur WhatsApp et par USSD, depuis un téléphone à touches, en gardant la maîtrise du système.", "Serve citizens on WhatsApp and by USSD, from a keypad phone, while keeping control of the system."),
    ],
    model: t(
      "Une licence par déploiement, l'intégration facturée au projet et un contrat de support. Le tarif de chaque appel est connu avant l'envoi.",
      "A licence per deployment, integration billed per project and a support contract. The price of each call is known before it is sent.",
    ),
    edge: t(
      "Les agents de Baarali, éprouvés chaque jour par ses utilisateurs, nourrissent Baarali Entreprise, qui les adapte aux exigences des grandes organisations.",
      "Baarali's agents, proven every day by its users, feed Baarali Enterprise, which adapts them to large organisations' requirements.",
    ),
    vision: t(
      "Permettre aux institutions africaines d'adopter l'IA sans renoncer à la maîtrise de leurs données, et faire émerger une IA d'entreprise conçue sur le continent.",
      "To let African institutions adopt AI without giving up control of their data, and to grow an enterprise AI designed on the continent.",
    ),
    features: [
      i("Souverain par conception", "Sovereign by design", "Moteur local, installation sur site jusqu'au fonctionnement sans connexion, aucune donnée sortante.", "Local engine, on-premises installation up to fully offline operation, no data leaving."),
      i("Cloisonnement à deux barrières", "Two-barrier isolation", "Espaces de travail séparés dans le code et dans la base ; la production refuse de démarrer si le cloisonnement n'est pas actif.", "Workspaces separated in the code and in the database; production refuses to start if isolation is not active."),
      i("Connaissances et connecteurs", "Knowledge and connectors", "Documents, pages web, bases SQL en lecture seule, Notion, Drive, SharePoint, avec citation des passages.", "Documents, web pages, read-only SQL databases, Notion, Drive, SharePoint, with cited passages."),
      i("Agents sous contrôle", "Agents under control", "Autorisations sur cinq axes, délégation bornée entre agents, mémoire effaçable, cinq packs métier.", "Permissions on five axes, bounded delegation between agents, erasable memory, five business packs."),
      i("WhatsApp, USSD et API", "WhatsApp, USSD and API", "L'agent se joint aussi depuis un téléphone à touches, sans connexion internet.", "The agent can also be reached from a keypad phone, without an internet connection."),
      i("Supervision", "Monitoring", "Traces, jeux d'épreuves, disponibilité mesurée et coût réel par modèle.", "Traces, test suites, measured uptime and real cost per model."),
    ],
    today: [
      t("Backend et console web, tests sur deux bases de données", "Backend and web console, tests on two databases"),
      t("Cloisonnement, comptes, rôles, authentification unique et journal d'audit", "Isolation, accounts, roles, single sign-on and audit log"),
      t("Connecteurs, recherche avec citations, agents, packs métier et canaux", "Connectors, search with citations, agents, business packs and channels"),
    ],
    missing: [
      t("L'encaissement, à concevoir en monnaie locale", "Billing, to be designed in local currency"),
      t("La reprise du chantier", "Restarting the work"),
    ],
  },
];

export function getVenture(slug: string): Venture | undefined {
  return ventures.find((v) => v.slug === slug);
}
