import type { Metadata } from "next";
import { LegalPage, type LegalContent } from "@/components/legal/LegalPage";

const content: { fr: LegalContent; en: LegalContent } = {
  fr: {
    title: "Mentions légales",
    updatedLabel: "Légal",
    updated: "Dernière mise à jour : 29 juin 2026",
    sections: [
      {
        heading: "Éditeur du site",
        body: [
          "Le présent site est édité par OpenBaara SAS (ci-après « OpenBaara »), société par actions simplifiée au capital de [À COMPLÉTER].",
          [
            "Siège social : [À COMPLÉTER], Abidjan, Côte d'Ivoire",
            "Registre du Commerce et du Crédit Mobilier (RCCM) : [À COMPLÉTER]",
            "Directeur de la publication : [À COMPLÉTER]",
            "Contact : contact@openbaara.com",
          ],
        ],
      },
      {
        heading: "Hébergement",
        body: [
          "Le site est hébergé par Vercel Inc., 340 S Lemon Avenue #4133, Walnut, CA 91789, États-Unis (vercel.com).",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        body: [
          "L'ensemble des contenus présents sur ce site (textes, marques, logos, identité visuelle, code et éléments graphiques) est la propriété d'OpenBaara ou de ses partenaires, et est protégé par le droit de la propriété intellectuelle.",
          "Toute reproduction, représentation ou exploitation, totale ou partielle, sans autorisation écrite préalable d'OpenBaara, est interdite.",
        ],
      },
      {
        heading: "Responsabilité",
        body: [
          "OpenBaara s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, sans pouvoir en garantir l'exhaustivité. Les informations sont fournies à titre indicatif et sont susceptibles d'évoluer.",
          "Le site peut contenir des liens vers des sites tiers. OpenBaara n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.",
        ],
      },
      {
        heading: "Données personnelles",
        body: [
          "Le traitement des données personnelles collectées via ce site est détaillé dans notre Politique de confidentialité.",
        ],
      },
      {
        heading: "Droit applicable",
        body: [
          "Les présentes mentions légales sont régies par le droit ivoirien. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence des tribunaux d'Abidjan.",
        ],
      },
    ],
  },
  en: {
    title: "Legal notice",
    updatedLabel: "Legal",
    updated: "Last updated: June 29, 2026",
    sections: [
      {
        heading: "Site publisher",
        body: [
          "This website is published by OpenBaara SAS (hereinafter \"OpenBaara\"), a simplified joint-stock company (SAS) with a share capital of [TO BE COMPLETED].",
          [
            "Registered office: [TO BE COMPLETED], Abidjan, Côte d'Ivoire",
            "Trade and Personal Property Credit Register (RCCM): [TO BE COMPLETED]",
            "Publication director: [TO BE COMPLETED]",
            "Contact: contact@openbaara.com",
          ],
        ],
      },
      {
        heading: "Hosting",
        body: [
          "The website is hosted by Vercel Inc., 340 S Lemon Avenue #4133, Walnut, CA 91789, United States (vercel.com).",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All content on this website (text, trademarks, logos, visual identity, code and graphic elements) is the property of OpenBaara or its partners and is protected by intellectual property law.",
          "Any reproduction, representation or use, in whole or in part, without OpenBaara's prior written authorization, is prohibited.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "OpenBaara strives to ensure that the information published on this site is accurate and up to date, but cannot guarantee that it is exhaustive. Information is provided for guidance only and is subject to change.",
          "The site may contain links to third-party sites. OpenBaara has no control over these sites and accepts no responsibility for their content.",
        ],
      },
      {
        heading: "Personal data",
        body: [
          "The processing of personal data collected through this site is detailed in our Privacy Policy.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "This legal notice is governed by Ivorian law. Any dispute relating to its interpretation or execution falls under the jurisdiction of the courts of Abidjan.",
        ],
      },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Legal notice" : "Mentions légales" };
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalPage {...(locale === "en" ? content.en : content.fr)} />;
}
