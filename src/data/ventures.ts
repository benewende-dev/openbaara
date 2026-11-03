// ─── Les ventures du studio ───
// Source unique des textes des pages Ventures, des fiches et de l'accueil.
// Ordre = ordre d'affichage. `stageIdx` : 0 conception, 1 construction, 2 pilote, 3 lancement, 4 expansion.

type T = { fr: string; en: string };
type Item = { t: T; d: T };

export type VentureCategory = "ia" | "crea" | "mob" | "mode" | "fin";

export type Venture = {
  slug: string;
  name: string;
  color: string;
  category: VentureCategory;
  site: string | null;
  stageIdx: number;
  /** Bouton principal de la fiche : démo si le produit existe, sinon liste d'attente. */
  cta: "demo" | "waitlist" | "notify";
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

export const ventures: Venture[] = [
  {
    slug: "baarali",
    name: "Baarali",
    color: "#5B47D6",
    category: "ia",
    site: "baarali.com",
    stageIdx: 2,
    cta: "demo",
    sector: t("Intelligence artificielle", "Artificial intelligence"),
    market: t("Côte d'Ivoire, UEMOA", "Côte d'Ivoire, WAEMU"),
    stage: t("Finalisation", "Final stretch"),
    next: t("Lancement commercial", "Commercial launch"),
    line: t(
      "Des agents IA qui prennent en charge le travail répétitif des PME : devis, relances, service client et suivi des paiements, sur WhatsApp et en français.",
      "AI agents that take on the repetitive work of small businesses: quotes, reminders, customer service and payment follow-up, on WhatsApp and in French.",
    ),
    pitch: t(
      "Baarali se branche sur WhatsApp, l'e-mail et les documents de l'entreprise, puis apprend sa façon de travailler. Les agents préparent, relancent et répondent ; l'équipe garde la main sur chaque décision qui engage l'entreprise.",
      "Baarali connects to the company's WhatsApp, email and documents, then learns how it works. The agents prepare, follow up and reply; the team keeps the final say on every decision that commits the business.",
    ),
    problem: t(
      "Devis, relances, réponses aux clients, suivi des paiements : les PME y passent leurs journées, avec des logiciels conçus pour d'autres marchés, d'autres langues et d'autres habitudes.",
      "Quotes, reminders, customer replies, payment follow-up: small businesses spend their days on them, with software designed for other markets, other languages and other habits.",
    ),
    answer: t(
      "Baarali confie ces tâches à des agents qui comprennent le contexte local, travaillent là où se trouvent déjà les clients et soumettent à l'équipe tout ce qui mérite une validation.",
      "Baarali hands these tasks to agents that understand the local context, work where customers already are, and submit anything that deserves approval to the team.",
    ),
    who: [
      i("Commerces et distributeurs", "Retailers and distributors", "Des commandes, des devis et des relances qui arrivent chaque jour sur WhatsApp et se perdent dans les conversations.", "Orders, quotes and reminders that arrive on WhatsApp every day and get lost in the conversations."),
      i("Cabinets et agences", "Firms and agencies", "Prise de rendez-vous, suivi des dossiers et réponses aux questions qui reviennent sans cesse.", "Booking appointments, tracking files and answering the questions that keep coming back."),
      i("Écoles, cliniques, prestataires", "Schools, clinics, service providers", "Un accueil disponible le soir et le week-end, sans recruter une équipe de plus.", "A front desk that is available in the evening and at weekends, without hiring another team."),
    ],
    model: t(
      "Abonnement mensuel par entreprise, selon le nombre d'agents et le volume de conversations. Paiement en Mobile Money ou par carte, sans engagement annuel.",
      "Monthly subscription per company, based on the number of agents and the volume of conversations. Paid by Mobile Money or card, with no annual commitment.",
    ),
    edge: t(
      "Baarali repose sur les briques du studio : agents IA, paiements locaux, langues. Ses agents servent aussi de socle à Baarali Entreprise, qui les adapte aux grandes organisations.",
      "Baarali runs on the studio's building blocks: AI agents, local payments, languages. Its agents also form the base of Baarali Enterprise, which adapts them to large organisations.",
    ),
    vision: t(
      "Devenir le collègue numérique de chaque PME d'Afrique francophone : disponible à toute heure, attentif à chaque client, et qui laisse l'équipe se consacrer à ce qui demande un jugement humain.",
      "To become the digital colleague of every small business in French-speaking Africa: available at any hour, attentive to every customer, leaving the team free for what calls for human judgement.",
    ),
    features: [
      i("Assistant d'équipe", "Team assistant", "Une IA partagée qui connaît les documents, les produits et les clients de l'entreprise, et répond à chacun avec le bon contexte.", "A shared AI that knows the company's documents, products and customers, and answers each person with the right context."),
      i("Agents métiers", "Business agents", "Devis, relances de factures, service client et prise de rendez-vous, chacun réglé selon les règles de la maison.", "Quotes, invoice reminders, customer service and booking, each set up according to the house rules."),
      i("WhatsApp et e-mail", "WhatsApp and email", "Les agents répondent sur les canaux que les clients utilisent déjà, sans leur demander d'installer quoi que ce soit.", "The agents reply on the channels customers already use, without asking them to install anything."),
      i("Validation humaine", "Human approval", "Chaque action qui engage l'entreprise attend un accord explicite, et tout est tracé.", "Every action that commits the company waits for explicit approval, and everything is logged."),
      i("Tableau de bord", "Dashboard", "Conversations traitées, montants relancés, demandes en attente : l'activité des agents se lit en un coup d'œil.", "Conversations handled, amounts chased, pending requests: the agents' activity at a glance."),
      i("Connexions", "Connections", "Agendas, tableurs et logiciels de facturation : Baarali s'insère dans les outils existants au lieu de les remplacer.", "Calendars, spreadsheets and invoicing software: Baarali fits into existing tools instead of replacing them."),
    ],
  },
  {
    slug: "sahely",
    name: "Sahely",
    color: "#C2352F",
    category: "mob",
    site: null,
    stageIdx: 1,
    cta: "waitlist",
    sector: t("Mobilité et commerce", "Mobility and commerce"),
    market: t("Burkina Faso, Mali, Niger", "Burkina Faso, Mali, Niger"),
    stage: t("En construction", "In build"),
    next: t("Lancement à Ouagadougou", "Launch in Ouagadougou"),
    line: t(
      "La super-app du quotidien au Sahel : courses, livraisons, boutiques et billets de bus, réunis dans une seule application et payés en Mobile Money.",
      "The everyday super-app for the Sahel: rides, deliveries, shops and bus tickets in a single app, paid by Mobile Money.",
    ),
    pitch: t(
      "Sahely part d'Ouagadougou avec une conviction simple : les habitants n'ont pas besoin de cinq applications, mais d'une seule qui fonctionne, même sur un réseau lent et un téléphone modeste. Tous les services partagent le même compte, le même portefeuille et le même support.",
      "Sahely starts in Ouagadougou with a simple conviction: people don't need five apps, they need one that works, even on a slow network and a modest phone. Every service shares the same account, the same wallet and the same support.",
    ),
    problem: t(
      "Pour une course, une livraison ou un billet de bus, il faut jongler entre numéros de téléphone, intermédiaires et espèces, sans suivi, sans recours et sans garantie de prix.",
      "A ride, a delivery or a bus ticket means juggling phone numbers, middlemen and cash, with no tracking, no recourse and no guaranteed price.",
    ),
    answer: t(
      "Sahely réunit ces services dans une application fiable : le prix est affiché avant de partir, les prestataires sont vérifiés et le paiement se fait en Mobile Money.",
      "Sahely brings these services together in one reliable app: the price is shown before you set off, providers are verified and payment is made by Mobile Money.",
    ),
    who: [
      i("Les habitants des villes", "City residents", "Se déplacer, se faire livrer et réserver un voyage depuis le même téléphone, avec un prix connu d'avance.", "Get around, have things delivered and book a trip from the same phone, with the price known in advance."),
      i("Chauffeurs, livreurs et commerçants", "Drivers, couriers and shopkeepers", "Un revenu complémentaire, des clients réguliers et un paiement reçu chaque jour.", "Extra income, regular customers and payment received every day."),
      i("Compagnies de transport", "Transport companies", "Vendre leurs places en ligne, remplir leurs bus et réduire la fraude au guichet.", "Sell seats online, fill their buses and reduce fraud at the ticket office."),
    ],
    model: t(
      "Commission sur chaque course, livraison et vente en boutique, frais de service sur les billets. Les partenaires sont payés chaque jour en Mobile Money.",
      "A commission on every ride, delivery and shop sale, and a service fee on tickets. Partners are paid daily by Mobile Money.",
    ),
    edge: t(
      "Sahely et ColisGo partagent la même base : répartition des courses, suivi en direct, paiements. Chaque amélioration profite aux deux.",
      "Sahely and ColisGo share the same foundation: dispatch, live tracking, payments. Every improvement benefits both.",
    ),
    vision: t(
      "Devenir l'application que l'on ouvre chaque matin au Burkina Faso, au Mali et au Niger, puis porter le modèle dans les autres villes du Sahel.",
      "To become the app people open every morning in Burkina Faso, Mali and Niger, then take the model to the other cities of the Sahel.",
    ),
    features: [
      i("Courses", "Rides", "Voitures et motos, chauffeurs vérifiés, prix connu avant de monter.", "Cars and motorbikes, verified drivers, price known before you get in."),
      i("Livraisons", "Deliveries", "Colis, repas et courses du marché, suivis en direct jusqu'à la porte.", "Parcels, meals and market shopping, tracked live to the door."),
      i("Boutiques", "Shops", "Les commerces du quartier réunis dans une seule application, avec livraison ou retrait.", "Neighbourhood shops in a single app, with delivery or pick-up."),
      i("Voyages en bus", "Bus travel", "Réservation de places entre les villes, billet sur le téléphone, sans file d'attente.", "Book intercity seats, ticket on your phone, no queue."),
      i("Portefeuille Sahely", "Sahely wallet", "Un solde unique pour tous les services, avec historique et remboursements simples.", "One balance for every service, with history and simple refunds."),
      i("Pensée pour le réseau", "Built for the network", "Une application légère qui reste utilisable en 3G et sur les téléphones d'entrée de gamme.", "A light app that stays usable on 3G and entry-level phones."),
    ],
  },
  {
    slug: "jemabi",
    name: "Jemabi",
    color: "#B3502F",
    category: "mode",
    site: null,
    stageIdx: 0,
    cta: "notify",
    sector: t("Mode et accessoires", "Fashion and accessories"),
    market: t("Afrique de l'Ouest, diaspora", "West Africa, diaspora"),
    stage: t("En définition", "In definition"),
    next: t("Premier prototype", "First prototype"),
    line: t(
      "La boutique en ligne des créateurs de mode ouest-africains : une vitrine soignée, le paiement intégré et une livraison suivie, jusqu'à la diaspora.",
      "The online store for West African fashion designers: a polished storefront, built-in payment and tracked delivery, all the way to the diaspora.",
    ),
    pitch: t(
      "La création ouest-africaine a le talent et la demande. Ce qui lui manque, c'est l'infrastructure : une vitrine professionnelle, un paiement fiable et une logistique qui tient ses promesses. Jemabi prend en charge tout ce qui se passe après la création.",
      "West African design has the talent and the demand. What it lacks is infrastructure: a professional storefront, reliable payment and logistics that keep their promises. Jemabi takes care of everything that happens after the design.",
    ),
    problem: t(
      "Les créateurs vendent surtout par messages sur les réseaux sociaux : pas de vitrine durable, pas de paiement intégré, des livraisons incertaines et une clientèle limitée à leur ville.",
      "Designers mostly sell through social media messages: no lasting storefront, no built-in payment, uncertain deliveries and customers limited to their own city.",
    ),
    answer: t(
      "Jemabi leur donne une boutique à la hauteur de leur travail, le paiement intégré et une logistique fiable, jusqu'aux clients de la diaspora.",
      "Jemabi gives them a store worthy of their work, built-in payment and reliable logistics, all the way to customers in the diaspora.",
    ),
    who: [
      i("Créateurs et ateliers", "Designers and workshops", "Des marques de vêtements, de bijoux et de maroquinerie qui veulent vendre au-delà de leur cercle.", "Clothing, jewellery and leather-goods brands that want to sell beyond their own circle."),
      i("Clients de la région", "Customers in the region", "Acheter en confiance, payer en Mobile Money et suivre sa commande.", "Buy with confidence, pay by Mobile Money and track the order."),
      i("La diaspora", "The diaspora", "Retrouver la création de chez soi, livrée à l'étranger dans de bonnes conditions.", "Find design from home, delivered abroad in good condition."),
    ],
    model: t(
      "Commission sur chaque vente, et services optionnels pour les créateurs : photographie produit, mise en avant, expédition internationale.",
      "A commission on every sale, plus optional services for designers: product photography, promotion, international shipping.",
    ),
    edge: t(
      "Les paiements du studio et, à Abidjan, le réseau de ColisGo donnent à Jemabi une logistique et un encaissement fiables dès le premier jour.",
      "The studio's payments and, in Abidjan, the ColisGo network give Jemabi reliable logistics and collection from day one.",
    ),
    vision: t(
      "Devenir l'adresse de référence pour acheter en ligne la mode africaine contemporaine, d'Abidjan comme de l'étranger.",
      "To become the go-to address for buying contemporary African fashion online, from Abidjan and from abroad.",
    ),
    features: [
      i("Vitrines de créateurs", "Designer storefronts", "Une page soignée pour chaque marque, avec son histoire, ses collections et ses photos.", "A polished page for each brand, with its story, collections and photos."),
      i("Paiement intégré", "Built-in payment", "Mobile Money et carte, sans échange de numéros ni virement à l'aveugle.", "Mobile Money and card, with no swapping numbers or blind transfers."),
      i("Livraison suivie", "Tracked delivery", "Du créateur jusqu'au client, avec un suivi partagé à chaque étape.", "From designer to customer, with shared tracking at every step."),
      i("Vente à distance", "Selling abroad", "Expédition vers la diaspora et l'international, prix et délais annoncés à l'avance.", "Shipping to the diaspora and abroad, with prices and lead times stated upfront."),
      i("Sur mesure", "Made to measure", "Prise de mesures guidée et suivi de fabrication pour les pièces réalisées à la commande.", "Guided measurements and production tracking for made-to-order pieces."),
      i("Outils du créateur", "Designer tools", "Stock, commandes et ventes réunis dans un espace simple, utilisable depuis un téléphone.", "Stock, orders and sales in one simple space, usable from a phone."),
    ],
  },
  {
    slug: "nafolia",
    name: "Nafolia",
    color: "#2C55D9",
    category: "fin",
    site: null,
    stageIdx: 0,
    cta: "waitlist",
    sector: t("Finance", "Finance"),
    market: t("UEMOA, diaspora, international", "WAEMU, diaspora, international"),
    stage: t("En conception", "In design"),
    next: t("Partenaires agréés, version 1", "Licensed partners, version 1"),
    line: t(
      "Une banque en ligne haut de gamme pour l'Afrique de l'Ouest et sa diaspora : comptes multi-devises, envois vers le Mobile Money et un service exigeant, avec des partenaires agréés.",
      "A premium online bank for West Africa and its diaspora: multi-currency accounts, transfers to Mobile Money and demanding service, with licensed partners.",
    ),
    pitch: t(
      "Nafolia s'adresse à ceux qui vivent entre plusieurs pays et plusieurs monnaies : entrepreneurs, cadres, familles de la diaspora. Nafolia n'est pas un établissement bancaire : les comptes sont tenus par des partenaires agréés, et Nafolia leur apporte une expérience claire, rapide et sûre.",
      "Nafolia is for people who live across several countries and currencies: entrepreneurs, executives, diaspora families. Nafolia is not a bank: accounts are held by licensed partners, and Nafolia brings them a clear, fast and secure experience.",
    ),
    problem: t(
      "Ouvrir un compte, envoyer de l'argent à sa famille ou épargner en devises reste lent, coûteux et opaque entre l'Afrique de l'Ouest et le reste du monde.",
      "Opening an account, sending money to family or saving in foreign currency is still slow, costly and opaque between West Africa and the rest of the world.",
    ),
    answer: t(
      "Nafolia rend ces opérations rapides et lisibles, avec des frais affichés avant chaque opération et la sécurité de partenaires bancaires agréés.",
      "Nafolia makes these operations fast and clear, with fees shown before each one and the security of licensed banking partners.",
    ),
    who: [
      i("La diaspora", "The diaspora", "Soutenir sa famille, investir au pays et gérer ses comptes sans multiplier les intermédiaires.", "Support family, invest back home and manage accounts without piling up intermediaries."),
      i("Professionnels de la région", "Professionals in the region", "Encaisser, payer et épargner en plusieurs devises, avec un service à la hauteur.", "Get paid, pay and save in several currencies, with service to match."),
      i("Les proches bénéficiaires", "Family recipients", "Recevoir directement sur son Mobile Money, sans déplacement ni attente.", "Receive straight to Mobile Money, with no trip and no wait."),
    ],
    model: t(
      "Formules par abonnement, frais de change transparents et revenus partagés avec les partenaires bancaires.",
      "Subscription plans, transparent exchange fees and revenue shared with banking partners.",
    ),
    edge: t(
      "Nafolia s'appuie sur la brique Identité et confiance du studio et sur ses agents IA, qui agissent uniquement dans le mandat fixé par le client.",
      "Nafolia builds on the studio's Identity and trust block and on its AI agents, which act only within the mandate set by the customer.",
    ),
    vision: t(
      "Offrir aux Ouest-Africains, où qu'ils vivent, une banque qui comprend une vie partagée entre plusieurs pays, avec un niveau de service digne des meilleures banques privées.",
      "To give West Africans, wherever they live, a bank that understands a life split across several countries, with service worthy of the best private banks.",
    ),
    features: [
      i("Comptes multi-devises", "Multi-currency accounts", "Franc CFA, euro et dollar dans une seule application, avec le taux affiché avant chaque conversion.", "CFA franc, euro and dollar in one app, with the rate shown before every conversion."),
      i("Envois vers le Mobile Money", "Transfers to Mobile Money", "Ponctuels ou programmés, suivis jusqu'à réception par le bénéficiaire.", "One-off or scheduled, tracked until the recipient receives them."),
      i("Cartes", "Cards", "Cartes virtuelles et physiques pour payer en ligne et à l'étranger.", "Virtual and physical cards to pay online and abroad."),
      i("Épargne et objectifs", "Savings and goals", "Mettre de côté pour un projet, une rentrée scolaire ou un retour au pays.", "Put money aside for a project, the school year or a return home."),
      i("Cercle de confiance", "Circle of trust", "Des proches désignés peuvent aider en cas de perte d'accès ou d'urgence.", "Designated relatives can help if access is lost or in an emergency."),
      i("Assistant sous mandat", "Assistant under mandate", "Il propose, vous validez, dans les limites que vous avez fixées.", "It suggests, you approve, within the limits you have set."),
    ],
  },
  {
    slug: "outio",
    name: "Outio",
    color: "#B23C6E",
    category: "crea",
    site: null,
    stageIdx: 0,
    cta: "waitlist",
    sector: t("Création et IA", "Creation and AI"),
    market: t("Afrique, international", "Africa, international"),
    stage: t("En conception", "In design"),
    next: t("Première version", "First version"),
    line: t(
      "Un studio de génération par IA : vidéo, audio, images et voix, produits en quelques minutes, dans les langues et aux prix du continent.",
      "An AI generation studio: video, audio, images and voice, produced in minutes, in the continent's languages and at its prices.",
    ),
    pitch: t(
      "Outio réunit dans un seul studio les meilleurs modèles de génération du moment. On décrit ce que l'on veut, Outio produit la vidéo, la bande son, les visuels ou la voix off, puis les ajuste jusqu'au résultat final, prêt à publier.",
      "Outio brings today's best generation models together in one studio. You describe what you want; Outio produces the video, soundtrack, visuals or voice-over, then refines them into a final result, ready to publish.",
    ),
    problem: t(
      "Produire une vidéo, un visuel ou une voix off demande plusieurs outils coûteux, payables seulement par carte internationale et rarement pensés pour les langues et les visages du continent.",
      "Producing a video, a visual or a voice-over takes several expensive tools, payable only by international card and rarely designed for the continent's languages and faces.",
    ),
    answer: t(
      "Outio rassemble la génération de vidéo, d'audio, d'images et de voix dans un seul studio, avec des tarifs locaux, le paiement en Mobile Money et des agents qui enchaînent les étapes.",
      "Outio brings video, audio, image and voice generation into one studio, with local pricing, Mobile Money payment and agents that chain the steps together.",
    ),
    who: [
      i("Créateurs de contenu", "Content creators", "Publier plus souvent, avec une qualité de production qui demandait hier une équipe entière.", "Publish more often, with production quality that used to take a whole team."),
      i("Marques et agences", "Brands and agencies", "Produire des campagnes, des déclinaisons et des versions en plusieurs langues en une fraction du temps.", "Produce campaigns, variants and versions in several languages in a fraction of the time."),
      i("Artistes et musiciens", "Artists and musicians", "Clips, pochettes, visuels de promotion et habillages sonores pour accompagner chaque sortie.", "Music videos, covers, promotional visuals and sound branding for every release."),
    ],
    model: t(
      "Formule gratuite pour découvrir, puis abonnements avec crédits de génération inclus. Crédits supplémentaires à l'unité, payables en Mobile Money.",
      "A free plan to try it, then subscriptions with generation credits included. Extra credits sold individually, payable by Mobile Money.",
    ),
    edge: t(
      "Outio s'appuie sur les agents IA et la brique Langues du studio : il passe d'un modèle à l'autre selon la tâche, sans que l'utilisateur ait à s'en soucier.",
      "Outio builds on the studio's AI agents and Languages block: it switches from one model to another depending on the task, without the user having to think about it.",
    ),
    vision: t(
      "Mettre un studio de production complet dans le téléphone de chaque créateur africain, et donner à ses histoires la qualité qu'il faut pour toucher un public mondial.",
      "To put a complete production studio in every African creator's phone, and give their stories the quality they need to reach a global audience.",
    ),
    features: [
      i("Vidéo", "Video", "Génération et montage de séquences à partir d'un texte, d'une image ou d'un script.", "Generate and edit sequences from a text, an image or a script."),
      i("Audio et musique", "Audio and music", "Bandes son, habillages et effets sonores, libres de droits pour l'utilisateur.", "Soundtracks, sound branding and effects, royalty-free for the user."),
      i("Images", "Images", "Visuels, affiches et déclinaisons aux formats de chaque réseau.", "Visuals, posters and variants in every network's formats."),
      i("Voix et avatars", "Voices and avatars", "Voix off et présentateurs virtuels, en français, en anglais et en langues locales.", "Voice-overs and virtual presenters, in French, English and local languages."),
      i("Agents créatifs", "Creative agents", "Ils enchaînent écriture, visuels, son et montage à partir d'une seule consigne.", "They chain writing, visuals, sound and editing from a single brief."),
      i("Prix locaux", "Local prices", "Des tarifs adaptés au marché et le paiement en Mobile Money.", "Prices suited to the market and payment by Mobile Money."),
    ],
  },
  {
    slug: "colisgo",
    name: "ColisGo",
    color: "#C86E1E",
    category: "mob",
    site: null,
    stageIdx: 0,
    cta: "notify",
    sector: t("Logistique", "Logistics"),
    market: t("Abidjan", "Abidjan"),
    stage: t("En définition", "In definition"),
    next: t("Pilote à Abidjan", "Pilot in Abidjan"),
    line: t(
      "La livraison de colis à Abidjan en moto, voiture et cargo : prix affiché avant l'envoi, suivi en direct et une offre dédiée aux commerçants.",
      "Parcel delivery in Abidjan by motorbike, car and van: price shown before sending, live tracking and a dedicated offer for merchants.",
    ),
    pitch: t(
      "ColisGo commence à Abidjan, là où le commerce en ligne grandit le plus vite et où la livraison reste son point faible. Chaque envoi a un prix ferme, un livreur identifié et un suivi partagé jusqu'à la remise.",
      "ColisGo starts in Abidjan, where online commerce is growing fastest and delivery is still its weak point. Every shipment has a fixed price, an identified courier and shared tracking until hand-over.",
    ),
    problem: t(
      "À Abidjan, envoyer un colis veut souvent dire trouver un livreur par téléphone, négocier le prix et attendre sans aucun suivi, avec peu de recours en cas de perte.",
      "In Abidjan, sending a parcel often means finding a courier by phone, haggling over the price and waiting without any tracking, with little recourse if it is lost.",
    ),
    answer: t(
      "ColisGo affiche le prix avant l'envoi, choisit le véhicule adapté et permet à l'expéditeur comme au destinataire de suivre le colis jusqu'à sa remise.",
      "ColisGo shows the price before sending, picks the right vehicle and lets both sender and recipient follow the parcel until it is handed over.",
    ),
    who: [
      i("Particuliers", "Individuals", "Envoyer un document, un cadeau ou un achat à travers la ville, sans négocier.", "Send a document, a gift or a purchase across town, without haggling."),
      i("Commerçants et vendeurs en ligne", "Merchants and online sellers", "Expédier chaque jour à des tarifs prévisibles, avec encaissement à la livraison.", "Ship every day at predictable rates, with cash collected on delivery."),
      i("Livreurs partenaires", "Partner couriers", "Des courses régulières, un revenu clair et un paiement rapide.", "Regular jobs, clear income and fast payment."),
    ],
    model: t(
      "Prix par course selon la distance et le véhicule. Abonnement ColisGo Pro pour les commerçants, avec tarifs dégressifs et facturation mensuelle.",
      "Price per job based on distance and vehicle. A ColisGo Pro subscription for merchants, with volume discounts and monthly invoicing.",
    ),
    edge: t(
      "ColisGo partage avec Sahely la répartition des courses, le suivi en direct et les paiements, ce qui réduit fortement le coût de lancement.",
      "ColisGo shares dispatch, live tracking and payments with Sahely, which sharply cuts the cost of launching.",
    ),
    vision: t(
      "Devenir le réseau de livraison de référence d'Abidjan, puis des grandes villes de la sous-région, au service du commerce en ligne qui s'y développe.",
      "To become the reference delivery network in Abidjan, then in the region's major cities, serving the online commerce growing there.",
    ),
    features: [
      i("Moto, voiture, cargo", "Motorbike, car, van", "Le véhicule adapté à la taille du colis, choisi automatiquement.", "The right vehicle for the parcel's size, chosen automatically."),
      i("Suivi en direct", "Live tracking", "Un lien de suivi public pour l'expéditeur et le destinataire.", "A public tracking link for sender and recipient."),
      i("Paiement à la livraison", "Cash on delivery", "Le livreur encaisse pour le commerçant, qui reçoit le montant rapidement.", "The courier collects for the merchant, who receives the amount quickly."),
      i("Preuve de remise", "Proof of delivery", "Code de confirmation, photo ou signature à chaque livraison.", "Confirmation code, photo or signature on every delivery."),
      i("ColisGo Pro", "ColisGo Pro", "Une offre pour les commerçants qui expédient chaque jour, avec un espace dédié.", "An offer for merchants who ship every day, with a dedicated space."),
      i("Console d'opérations", "Operations console", "Répartition, support et finance pour l'équipe, en temps réel.", "Dispatch, support and finance for the team, in real time."),
    ],
  },
  {
    slug: "baarali-entreprise",
    name: "Baarali Entreprise",
    color: "#344A63",
    category: "ia",
    site: null,
    stageIdx: 1,
    cta: "demo",
    sector: t("Intelligence artificielle", "Artificial intelligence"),
    market: t("Afrique francophone", "French-speaking Africa"),
    stage: t("En construction", "In build"),
    next: t("Premiers clients pilotes", "First pilot customers"),
    line: t(
      "Des agents IA souverains pour les grandes entreprises et les institutions : installés chez le client, ses données ne quittent jamais son infrastructure.",
      "Sovereign AI agents for large companies and institutions: installed on the customer's premises, their data never leaves their infrastructure.",
    ),
    pitch: t(
      "Baarali Entreprise reprend les agents de Baarali et les adapte aux exigences des grandes organisations : installation sur site, modèles hébergés localement, contrôle des accès et traçabilité complète. L'entreprise garde la propriété de ses données, de bout en bout.",
      "Baarali Enterprise takes Baarali's agents and adapts them to the requirements of large organisations: on-premises installation, locally hosted models, access control and full traceability. The company keeps ownership of its data, end to end.",
    ),
    problem: t(
      "Les entreprises et les institutions veulent des agents IA branchés sur leurs données, mais ces données sont sensibles, réglementées, et ne peuvent pas quitter leur infrastructure.",
      "Companies and institutions want AI agents connected to their data, but that data is sensitive, regulated, and cannot leave their infrastructure.",
    ),
    answer: t(
      "Baarali Entreprise déploie des agents métiers chez le client, jusqu'au fonctionnement entièrement hors ligne, et chaque action est validée par une personne habilitée.",
      "Baarali Enterprise deploys business agents on the customer's premises, up to fully offline operation, and every action is approved by an authorised person.",
    ),
    who: [
      i("Grandes entreprises", "Large companies", "Automatiser le support, les achats et les opérations internes sans exposer leurs données.", "Automate support, purchasing and internal operations without exposing their data."),
      i("Banques, assurances, opérateurs", "Banks, insurers, operators", "Des agents conformes aux exigences de confidentialité de leur secteur.", "Agents that meet their sector's confidentiality requirements."),
      i("Administrations et institutions", "Public bodies and institutions", "Servir les usagers sur WhatsApp, au téléphone et par USSD, en gardant la maîtrise du système.", "Serve citizens on WhatsApp, by phone and by USSD, while keeping control of the system."),
    ],
    model: t(
      "Licence annuelle par déploiement, intégration facturée au projet et contrat de support avec engagement de disponibilité.",
      "An annual licence per deployment, integration billed per project and a support contract with an uptime commitment.",
    ),
    edge: t(
      "Les agents sont éprouvés chaque jour chez les PME clientes de Baarali avant d'être déployés dans les grandes organisations.",
      "The agents are proven every day with Baarali's small-business customers before being deployed in large organisations.",
    ),
    vision: t(
      "Permettre aux institutions africaines d'adopter l'IA sans renoncer à la maîtrise de leurs données, et faire émerger une IA d'entreprise conçue sur le continent.",
      "To let African institutions adopt AI without giving up control of their data, and to grow an enterprise AI designed on the continent.",
    ),
    features: [
      i("Déploiement souverain", "Sovereign deployment", "Modèles locaux, installation sur site ou dans le cloud de son choix, aucune donnée sortante.", "Local models, installed on site or in the cloud of your choice, no data leaving."),
      i("WhatsApp et USSD", "WhatsApp and USSD", "L'agent se joint aussi depuis un téléphone à touches, sans connexion internet.", "The agent can also be reached from a keypad phone, without an internet connection."),
      i("Connexion aux systèmes", "Connected to your systems", "Logiciels de gestion, bases clients et outils internes, avec des droits d'accès stricts.", "Management software, customer databases and internal tools, with strict access rights."),
      i("Validation humaine", "Human approval", "L'agent propose, une personne habilitée signe. Toujours.", "The agent proposes, an authorised person signs off. Always."),
      i("Langues", "Languages", "Français, anglais et langues locales, à l'écrit comme à la voix.", "French, English and local languages, in writing and by voice."),
      i("Supervision", "Monitoring", "Traces, audit, disponibilité mesurée et coût par modèle.", "Logs, audit, measured uptime and cost per model."),
    ],
  },
];

export function getVenture(slug: string): Venture | undefined {
  return ventures.find((v) => v.slug === slug);
}
