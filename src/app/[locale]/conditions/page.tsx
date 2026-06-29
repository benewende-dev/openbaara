import type { Metadata } from "next";
import { LegalPage, type LegalContent } from "@/components/legal/LegalPage";

const content: { fr: LegalContent; en: LegalContent } = {
  fr: {
    title: "Conditions d'utilisation",
    updatedLabel: "Conditions",
    updated: "Dernière mise à jour : 29 juin 2026",
    intro:
      "Les présentes conditions régissent l'accès et l'utilisation du site openbaara.com. En naviguant sur le site, vous acceptez ces conditions.",
    sections: [
      {
        heading: "Objet",
        body: [
          "Le site openbaara.com présente OpenBaara, ses divisions et ses activités. Il permet notamment de nous contacter, de candidater et de s'informer sur nos offres.",
        ],
      },
      {
        heading: "Accès au site",
        body: [
          "L'accès au site est gratuit. OpenBaara s'efforce d'assurer sa disponibilité mais ne saurait être tenue responsable d'une interruption, notamment pour maintenance, mise à jour ou cause indépendante de sa volonté.",
        ],
      },
      {
        heading: "Propriété intellectuelle",
        body: [
          "Les contenus, marques et éléments du site sont protégés. Vous vous engagez à ne pas les reproduire ou les exploiter sans autorisation, conformément aux Mentions légales.",
        ],
      },
      {
        heading: "Comportement de l'utilisateur",
        body: [
          "Vous vous engagez à utiliser le site de bonne foi et à ne pas en perturber le fonctionnement, notamment :",
          [
            "ne pas tenter d'accéder à des zones non autorisées",
            "ne pas soumettre de contenus illicites, injurieux ou frauduleux via les formulaires",
            "ne pas collecter automatiquement des données de manière abusive",
          ],
        ],
      },
      {
        heading: "Formulaires et candidatures",
        body: [
          "Les informations que vous transmettez via les formulaires doivent être exactes. Les données sont traitées conformément à notre Politique de confidentialité.",
        ],
      },
      {
        heading: "Achats et boutique",
        body: [
          "Les éventuels achats proposés sur la boutique sont soumis aux conditions affichées au moment de la commande et à un paiement via nos prestataires (Mobile Money / CinetPay). Cette section est susceptible d'évoluer à mesure que les fonctionnalités sont déployées.",
        ],
      },
      {
        heading: "Limitation de responsabilité",
        body: [
          "Le site est fourni « en l'état ». OpenBaara ne saurait être tenue responsable des dommages indirects résultant de l'utilisation du site ou de l'impossibilité d'y accéder.",
        ],
      },
      {
        heading: "Liens externes",
        body: [
          "Le site peut renvoyer vers des ressources tierces dont OpenBaara ne maîtrise pas le contenu et pour lesquelles elle décline toute responsabilité.",
        ],
      },
      {
        heading: "Modification des conditions",
        body: [
          "OpenBaara peut modifier les présentes conditions à tout moment. La version applicable est celle en vigueur lors de votre visite.",
        ],
      },
      {
        heading: "Droit applicable",
        body: [
          "Les présentes conditions sont régies par le droit ivoirien. Tout litige relève de la compétence des tribunaux d'Abidjan.",
        ],
      },
    ],
  },
  en: {
    title: "Terms of Use",
    updatedLabel: "Terms",
    updated: "Last updated: June 29, 2026",
    intro:
      "These terms govern access to and use of openbaara.com. By browsing the site, you accept these terms.",
    sections: [
      {
        heading: "Purpose",
        body: [
          "The openbaara.com website presents OpenBaara, its divisions and its activities. In particular, it allows you to contact us, apply for jobs and learn about our offerings.",
        ],
      },
      {
        heading: "Access to the site",
        body: [
          "Access to the site is free. OpenBaara strives to ensure its availability but cannot be held responsible for any interruption, in particular for maintenance, updates or causes beyond its control.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "The content, trademarks and elements of the site are protected. You agree not to reproduce or use them without authorization, in accordance with the Legal notice.",
        ],
      },
      {
        heading: "User conduct",
        body: [
          "You agree to use the site in good faith and not to disrupt its operation, in particular:",
          [
            "not attempting to access unauthorized areas",
            "not submitting unlawful, abusive or fraudulent content through the forms",
            "not collecting data automatically in an abusive manner",
          ],
        ],
      },
      {
        heading: "Forms and applications",
        body: [
          "The information you provide through the forms must be accurate. Data is processed in accordance with our Privacy Policy.",
        ],
      },
      {
        heading: "Purchases and store",
        body: [
          "Any purchases offered in the store are subject to the conditions displayed at the time of order and to payment via our providers (Mobile Money / CinetPay). This section is subject to change as features are rolled out.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "The site is provided “as is”. OpenBaara cannot be held liable for any indirect damage resulting from the use of, or inability to access, the site.",
        ],
      },
      {
        heading: "External links",
        body: [
          "The site may link to third-party resources whose content OpenBaara does not control and for which it accepts no responsibility.",
        ],
      },
      {
        heading: "Changes to the terms",
        body: [
          "OpenBaara may modify these terms at any time. The applicable version is the one in force at the time of your visit.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "These terms are governed by Ivorian law. Any dispute falls under the jurisdiction of the courts of Abidjan.",
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
  return { title: locale === "en" ? "Terms of Use" : "Conditions d'utilisation" };
}

export default async function ConditionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalPage {...(locale === "en" ? content.en : content.fr)} />;
}
