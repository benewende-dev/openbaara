// ─── Connexion des apprenants ───
// Pas de mot de passe : l'apprenant reçoit par e-mail un lien à usage unique (20 min).
// Le lien ouvre une page qui demande un clic : les antivirus de messagerie qui visitent
// les liens ne consomment donc pas le jeton. La session est un cookie httpOnly ;
// la base ne garde que l'empreinte des jetons.

import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Customer } from "@prisma/client";
import { prisma } from "@/lib/db";
import { escapeHtml, isEmailConfigured, sendLeadEmail } from "@/lib/email";

const COOKIE = "ob_learner";
const SESSION_DAYS = 30;
const LINK_MINUTES = 20;

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

/**
 * Envoie un lien de connexion si un client existe avec cette adresse.
 * Ne dit jamais à l'appelant si l'adresse est connue.
 */
export async function sendLoginLink(email: string, locale: "fr" | "en", baseUrl: string): Promise<void> {
  const customer = await prisma.customer.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!customer) return;
  const token = randomBytes(32).toString("base64url");
  await prisma.customerLoginToken.create({
    data: { tokenHash: sha256(token), customerId: customer.id, expiresAt: new Date(Date.now() + LINK_MINUTES * 60_000) },
  });
  const url = `${baseUrl}/${locale}/espace/verifier?token=${token}`;
  if (!isEmailConfigured()) {
    // En local sans service d'e-mail, le lien s'affiche dans le terminal du serveur.
    if (process.env.NODE_ENV !== "production") console.info(`[espace] lien de connexion pour ${customer.email} : ${url}`);
    return;
  }
  const en = locale === "en";
  await sendLeadEmail({
    to: customer.email,
    subject: en ? "Your OpenBaara sign-in link" : "Votre lien de connexion OpenBaara",
    html: `<p>${en ? "Hello" : "Bonjour"} ${escapeHtml(customer.name)},</p>
      <p>${en ? "Click below to open your learning space. The link is valid for 20 minutes and works once." : "Cliquez ci-dessous pour ouvrir votre espace. Le lien est valable 20 minutes et ne sert qu'une fois."}</p>
      <p><a href="${url}">${en ? "Open my space" : "Ouvrir mon espace"}</a></p>
      <p>${en ? "If you did not ask for this, ignore this email." : "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message."}</p>`,
  });
}

/** Consomme le jeton et ouvre la session. Renvoie false si le lien est invalide, expiré ou déjà utilisé. */
export async function consumeLoginToken(token: string): Promise<boolean> {
  const now = new Date();
  // updateMany avec garde : deux clics simultanés n'ouvrent qu'une session.
  const row = await prisma.customerLoginToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!row || row.usedAt || row.expiresAt < now) return false;
  const { count } = await prisma.customerLoginToken.updateMany({ where: { id: row.id, usedAt: null }, data: { usedAt: now } });
  if (count !== 1) return false;

  const session = randomBytes(32).toString("base64url");
  await prisma.customerSession.create({
    data: { tokenHash: sha256(session), customerId: row.customerId, expiresAt: new Date(Date.now() + SESSION_DAYS * 86_400_000) },
  });
  (await cookies()).set(COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  return true;
}

export async function getLearner(): Promise<Customer | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const s = await prisma.customerSession.findUnique({ where: { tokenHash: sha256(token) }, include: { customer: true } });
  if (!s || s.expiresAt < new Date()) return null;
  return s.customer;
}

/** À appeler en tête de chaque page et action de l'espace apprenant. */
export async function requireLearner(locale: string): Promise<Customer> {
  const learner = await getLearner();
  if (!learner) redirect(`/${locale}/espace/connexion`);
  return learner;
}

export async function endLearnerSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await prisma.customerSession.deleteMany({ where: { tokenHash: sha256(token) } });
  store.delete({ name: COOKIE, path: "/" });
}
