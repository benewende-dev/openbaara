"use server";

// Actions de l'espace apprenant. Chacune revérifie la session : une action serveur
// est joignable directement, pas seulement depuis le formulaire qui l'affiche.

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";
import { consumeLoginToken, endLearnerSession, requireLearner, sendLoginLink } from "@/lib/learner/auth";
import { canOpen } from "@/lib/courses/access";

const lang = (v: FormDataEntryValue | null) => (v === "en" ? "en" : "fr");

async function baseUrl(): Promise<string> {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  const h = await headers();
  return `${h.get("x-forwarded-proto") ?? "http"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
}

export async function requestLink(form: FormData): Promise<void> {
  const locale = lang(form.get("locale"));
  const email = z.string().trim().toLowerCase().email().max(200).safeParse(form.get("email"));
  if (!email.success) redirect(`/${locale}/espace/connexion?erreur=email`);
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const okIp = rateLimit(`learner-link:ip:${ip}`, { limit: 10, windowMs: 15 * 60_000 }).ok;
  const okMail = rateLimit(`learner-link:mail:${email.data}`, { limit: 3, windowMs: 15 * 60_000 }).ok;
  if (!okIp || !okMail) redirect(`/${locale}/espace/connexion?erreur=trop`);
  await sendLoginLink(email.data, locale, await baseUrl());
  redirect(`/${locale}/espace/connexion?envoye=1`);
}

export async function confirmLogin(form: FormData): Promise<void> {
  const locale = lang(form.get("locale"));
  const ok = await consumeLoginToken(String(form.get("token") ?? ""));
  redirect(ok ? `/${locale}/espace` : `/${locale}/espace/connexion?erreur=lien`);
}

export async function logout(form: FormData): Promise<void> {
  await endLearnerSession();
  redirect(`/${lang(form.get("locale"))}/espace/connexion`);
}

/** Marque une leçon comme terminée, ou annule. */
export async function toggleDone(form: FormData): Promise<void> {
  const locale = lang(form.get("locale"));
  const learner = await requireLearner(locale);
  const lessonId = String(form.get("lessonId") ?? "");
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId }, include: { module: { include: { product: true } } } });
  if (!lesson) return;
  const owned = Boolean(
    await prisma.entitlement.findUnique({ where: { customerId_productId: { customerId: learner.id, productId: lesson.module.productId } } }),
  );
  if (!canOpen(lesson, owned)) return;
  const key = { customerId_lessonId: { customerId: learner.id, lessonId } };
  if (await prisma.lessonProgress.findUnique({ where: key })) await prisma.lessonProgress.delete({ where: key });
  else await prisma.lessonProgress.create({ data: { customerId: learner.id, lessonId } });
  revalidatePath(`/${locale}/espace`, "layout");
}
