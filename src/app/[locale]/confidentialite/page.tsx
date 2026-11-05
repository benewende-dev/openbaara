import type { Metadata } from "next";
import { LegalPage, type LegalContent } from "@/components/legal/LegalPage";

const content: { fr: LegalContent; en: LegalContent } = {
  fr: {
    title: "Politique de confidentialité",
    updatedLabel: "Confidentialité",
    updated: "Dernière mise à jour : 29 juin 2026",
    intro:
      "OpenBaara accorde une grande importance à la protection de vos données personnelles. Cette politique explique quelles données nous collectons, pourquoi, et quels sont vos droits.",
    sections: [
      {
        heading: "Responsable du traitement",
        body: [
          "Le responsable du traitement des données est OpenBaara SAS, Abidjan, Côte d'Ivoire. Pour toute question, écrivez-nous à contact@openbaara.com.",
        ],
      },
      {
        heading: "Données que nous collectons",
        body: [
          "Nous ne collectons que les données que vous nous transmettez volontairement via nos formulaires :",
          [
            "Formulaire de contact : nom, adresse e-mail, sujet et message",
            "Inscription à la newsletter : adresse e-mail",
            "Demande d'audit B2B : société, nom, e-mail, secteur et message",
            "Candidature : nom, e-mail, liens (LinkedIn/GitHub), message et CV éventuel",
          ],
          "Nous collectons également des données techniques minimales (adresse IP, journaux de connexion) à des fins de sécurité et de prévention des abus.",
        ],
      },
      {
        heading: "Finalités",
        body: [
          "Vos données sont utilisées uniquement pour : répondre à vos demandes, traiter les candidatures, vous envoyer la newsletter à laquelle vous vous êtes inscrit, et assurer la sécurité du site.",
        ],
      },
      {
        heading: "Base légale",
        body: [
          "Le traitement repose, selon le cas, sur votre consentement (newsletter), sur notre intérêt légitime (répondre à vos messages, sécurité) ou sur des mesures précontractuelles (candidatures).",
        ],
      },
      {
        heading: "Destinataires et sous-traitants",
        body: [
          "Vos données ne sont jamais vendues. Les e-mails issus de nos formulaires sont acheminés via Resend, Inc. (prestataire d'envoi d'e-mails). Le site est hébergé par Vercel Inc. Ces prestataires agissent comme sous-traitants pour notre compte.",
        ],
      },
      {
        heading: "Durée de conservation",
        body: [
          [
            "Messages de contact et demandes B2B : [À COMPLÉTER, ex. 24 mois]",
            "Candidatures : [À COMPLÉTER, ex. 24 mois]",
            "Inscriptions newsletter : jusqu'à votre désinscription",
          ],
        ],
      },
      {
        heading: "Cookies",
        body: [
          "Ce site n'utilise pas de cookies publicitaires ni de traceurs tiers. Nous utilisons uniquement un stockage local de votre navigateur pour mémoriser votre préférence d'affichage (mode clair/sombre).",
        ],
      },
      {
        heading: "Vos droits",
        body: [
          "Vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition au traitement de vos données. Pour exercer ces droits, écrivez à contact@openbaara.com.",
        ],
      },
      {
        heading: "Sécurité et transferts",
        body: [
          "Les données échangées via le site sont chiffrées en transit (HTTPS). Certains de nos prestataires (Vercel, Resend) étant situés hors de la Côte d'Ivoire, des transferts internationaux encadrés par des garanties appropriées peuvent avoir lieu.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updatedLabel: "Privacy",
    updated: "Last updated: June 29, 2026",
    intro:
      "OpenBaara takes the protection of your personal data seriously. This policy explains what data we collect, why, and what your rights are.",
    sections: [
      {
        heading: "Data controller",
        body: [
          "The data controller is OpenBaara SAS, Abidjan, Côte d'Ivoire. For any question, write to us at contact@openbaara.com.",
        ],
      },
      {
        heading: "Data we collect",
        body: [
          "We only collect the data you voluntarily provide through our forms:",
          [
            "Contact form: name, email address, subject and message",
            "Newsletter signup: email address",
            "B2B audit request: company, name, email, sector and message",
            "Job application: name, email, links (LinkedIn/GitHub), message and optional CV",
          ],
          "We also collect minimal technical data (IP address, connection logs) for security and abuse-prevention purposes.",
        ],
      },
      {
        heading: "Purposes",
        body: [
          "Your data is used only to: respond to your requests, process applications, send you the newsletter you subscribed to, and ensure the security of the site.",
        ],
      },
      {
        heading: "Legal basis",
        body: [
          "Processing is based, as applicable, on your consent (newsletter), our legitimate interest (replying to your messages, security) or pre-contractual measures (applications).",
        ],
      },
      {
        heading: "Recipients and processors",
        body: [
          "Your data is never sold. Emails generated by our forms are delivered via Resend, Inc. (email delivery provider). The site is hosted by Vercel Inc. These providers act as processors on our behalf.",
        ],
      },
      {
        heading: "Retention period",
        body: [
          [
            "Contact messages and B2B requests: [TO BE COMPLETED, e.g. 24 months]",
            "Job applications: [TO BE COMPLETED, e.g. 24 months]",
            "Newsletter subscriptions: until you unsubscribe",
          ],
        ],
      },
      {
        heading: "Cookies",
        body: [
          "This site uses no advertising cookies and no third-party trackers. We only use your browser's local storage to remember your display preference (light/dark mode).",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access, rectify, erase and object to the processing of your data. To exercise these rights, write to contact@openbaara.com.",
        ],
      },
      {
        heading: "Security and transfers",
        body: [
          "Data exchanged through the site is encrypted in transit (HTTPS). As some of our providers (Vercel, Resend) are located outside Côte d'Ivoire, international transfers framed by appropriate safeguards may occur.",
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
  return { title: locale === "en" ? "Privacy Policy" : "Politique de confidentialité" };
}

export default async function ConfidentialitePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalPage {...(locale === "en" ? content.en : content.fr)} />;
}
