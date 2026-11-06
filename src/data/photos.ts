// ─── Photos réelles du site (Wikimedia Commons) ───
// Chaque photo garde son auteur et sa licence : les licences CC BY et CC BY-SA imposent
// de les citer, ce que fait la légende affichée sous l'image.

type T = { fr: string; en: string };

export type Photo = {
  src: string;
  alt: T;
  author: string;
  license: "CC0" | "Domaine public" | "CC BY 4.0" | "CC BY-SA 4.0";
  source: string;
};

const LICENSE_URL: Record<Photo["license"], string | null> = {
  CC0: "https://creativecommons.org/publicdomain/zero/1.0/",
  "Domaine public": null,
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
};
export const licenseUrl = (p: Photo) => LICENSE_URL[p.license];

export const PHOTOS = {
  abidjan: {
    src: "/images/photos/abidjan-plateau.jpg",
    alt: { fr: "Le Plateau, à Abidjan, de nuit, vu depuis le pont Alassane Ouattara", en: "The Plateau district of Abidjan at night, seen from the Alassane Ouattara bridge" },
    author: "Edison McCullen",
    license: "CC BY 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Le_Plateau_depuis_le_Pont_ADO_%E2%80%93_Abidjan.jpg",
  },
  ouagadougou: {
    src: "/images/photos/ouagadougou-monument-heros.jpg",
    alt: { fr: "Le monument aux héros nationaux, à Ouagadougou", en: "The Monument to the National Heroes in Ouagadougou" },
    author: "The black photographer",
    license: "CC0",
    source: "https://commons.wikimedia.org/wiki/File:Monument_aux_h%C3%A9ros_nationaux_-_Ouagadougou_-_2024_(2).jpg",
  },
  bamako: {
    src: "/images/photos/bamako-tour-de-l-afrique.jpg",
    alt: { fr: "La tour de l'Afrique, à Bamako", en: "The Tower of Africa in Bamako" },
    author: "Rgaudin",
    license: "Domaine public",
    source: "https://commons.wikimedia.org/wiki/File:Tour_d%27Afrique_-_Bamako.jpg",
  },
  niamey: {
    src: "/images/photos/niamey-pont-kennedy.jpg",
    alt: { fr: "Le pont Kennedy sur le fleuve Niger, à Niamey", en: "The Kennedy bridge over the Niger river in Niamey" },
    author: "NigerTZai",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Niger,_Niamey,_Pont_Kennedy_(1).jpg",
  },
  lome: {
    src: "/images/photos/lome-monument-independance.jpg",
    alt: { fr: "Le monument de l'Indépendance, à Lomé", en: "The Independence Monument in Lomé" },
    author: "Bamouzou",
    license: "CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Monument_de_l%27ind%C3%A9pendance_du_Togo_%C3%A0_Lom%C3%A9_06.jpg",
  },
} satisfies Record<string, Photo>;

/** Villes où les ventures opèrent ou se préparent, avec les ventures concernées. */
export const MARKETS: { city: T; country: T; photo: Photo; ventures: string[] }[] = [
  { city: { fr: "Abidjan", en: "Abidjan" }, country: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" }, photo: PHOTOS.abidjan, ventures: ["baarali", "colisgo", "jemabi", "baarali-entreprise"] },
  { city: { fr: "Ouagadougou", en: "Ouagadougou" }, country: { fr: "Burkina Faso", en: "Burkina Faso" }, photo: PHOTOS.ouagadougou, ventures: ["sahely"] },
  { city: { fr: "Bamako", en: "Bamako" }, country: { fr: "Mali", en: "Mali" }, photo: PHOTOS.bamako, ventures: ["sahely"] },
  { city: { fr: "Niamey", en: "Niamey" }, country: { fr: "Niger", en: "Niger" }, photo: PHOTOS.niamey, ventures: ["sahely"] },
  { city: { fr: "Lomé", en: "Lomé" }, country: { fr: "Togo", en: "Togo" }, photo: PHOTOS.lome, ventures: ["baarali", "nafolia"] },
];
