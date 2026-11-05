"use server";

// Actions de la console pour le programme des cours : modules, leçons, accès offerts.
// Même règle que les autres actions : session et rôle revérifiés, entrées validées, trace au journal.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import type { FormState } from "./actions";

const page = (productId: string) => `/admin/cours/${productId}`;
const title = z.string().trim().min(2).max(160);

async function courseOf(productId: string) {
  return prisma.product.findFirst({ where: { id: productId, kind: "course" } });
}

// ─── Modules ───

export async function addModule(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = z.object({ productId: z.string().min(1), titleFr: title, titleEn: z.string().trim().max(160) }).safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Donnez un titre de module (2 caractères au moins)." };
  const course = await courseOf(p.data.productId);
  if (!course) return { error: "Cours introuvable." };
  const last = await prisma.courseModule.aggregate({ where: { productId: course.id }, _max: { sortOrder: true } });
  await prisma.$transaction(async (tx) => {
    const m = await tx.courseModule.create({
      data: { productId: course.id, titleFr: p.data.titleFr, titleEn: p.data.titleEn || p.data.titleFr, sortOrder: (last._max.sortOrder ?? -1) + 1 },
    });
    await audit(admin.id, "course.module.add", "product", course.id, null, { moduleId: m.id, titleFr: m.titleFr }, tx);
  });
  revalidatePath(page(course.id));
  return { ok: "Module ajouté." };
}

export async function updateModule(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = z
    .object({ moduleId: z.string().min(1), titleFr: title, titleEn: title, sortOrder: z.coerce.number().int().min(0).max(999) })
    .safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Vérifiez les titres et l'ordre." };
  const { moduleId, ...data } = p.data;
  const m = await prisma.courseModule.findUnique({ where: { id: moduleId } });
  if (!m) return { error: "Module introuvable." };
  await prisma.$transaction(async (tx) => {
    await tx.courseModule.update({ where: { id: moduleId }, data });
    await audit(admin.id, "course.module.update", "product", m.productId, { titleFr: m.titleFr, sortOrder: m.sortOrder }, data, tx);
  });
  revalidatePath(page(m.productId));
  return { ok: "Module enregistré." };
}

/** Supprime un module vide. Un module qui contient des leçons doit d'abord être vidé. */
export async function deleteModule(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const m = await prisma.courseModule.findUnique({ where: { id: String(form.get("moduleId") ?? "") }, include: { _count: { select: { lessons: true } } } });
  if (!m || m._count.lessons > 0) return;
  await prisma.$transaction(async (tx) => {
    await tx.courseModule.delete({ where: { id: m.id } });
    await audit(admin.id, "course.module.delete", "product", m.productId, { titleFr: m.titleFr }, null, tx);
  });
  revalidatePath(page(m.productId));
}

// ─── Leçons ───

const KINDS = ["video", "text", "exercise"] as const;

export async function addLesson(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = z
    .object({ moduleId: z.string().min(1), kind: z.enum(KINDS), titleFr: title, titleEn: z.string().trim().max(160) })
    .safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Donnez un titre de leçon (2 caractères au moins)." };
  const m = await prisma.courseModule.findUnique({ where: { id: p.data.moduleId } });
  if (!m) return { error: "Module introuvable." };
  const last = await prisma.lesson.aggregate({ where: { moduleId: m.id }, _max: { sortOrder: true } });
  await prisma.$transaction(async (tx) => {
    const l = await tx.lesson.create({
      data: { moduleId: m.id, kind: p.data.kind, titleFr: p.data.titleFr, titleEn: p.data.titleEn || p.data.titleFr, sortOrder: (last._max.sortOrder ?? -1) + 1 },
    });
    await audit(admin.id, "course.lesson.add", "product", m.productId, null, { lessonId: l.id, titleFr: l.titleFr }, tx);
  });
  revalidatePath(page(m.productId));
  return { ok: "Leçon ajoutée, hors ligne. Publiez-la quand elle est prête." };
}

const LessonInput = z.object({
  lessonId: z.string().min(1),
  kind: z.enum(KINDS),
  titleFr: title,
  titleEn: title,
  bodyFr: z.string().max(20000),
  bodyEn: z.string().max(20000),
  durationMin: z.string().trim().regex(/^\d{0,3}$/),
  videoId: z.string().trim().max(120).regex(/^[A-Za-z0-9_-]*$/),
  sortOrder: z.coerce.number().int().min(0).max(999),
  freePreview: z.string().optional(),
  published: z.string().optional(),
});

export async function updateLesson(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = LessonInput.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Vérifiez les champs : titres obligatoires, durée en minutes, identifiant vidéo sans espace." };
  const d = p.data;
  const before = await prisma.lesson.findUnique({ where: { id: d.lessonId }, include: { module: true } });
  if (!before) return { error: "Leçon introuvable." };
  const data = {
    kind: d.kind,
    titleFr: d.titleFr,
    titleEn: d.titleEn,
    bodyFr: d.bodyFr.trim(),
    bodyEn: d.bodyEn.trim(),
    durationMin: d.durationMin ? Number(d.durationMin) : null,
    videoId: d.videoId || null,
    sortOrder: d.sortOrder,
    freePreview: d.freePreview === "on",
    published: d.published === "on",
  };
  if (data.published && data.kind === "video" && !data.videoId && !data.bodyFr) {
    return { error: "Une leçon vidéo publiée a besoin d'une vidéo ou d'un texte." };
  }
  await prisma.$transaction(async (tx) => {
    await tx.lesson.update({ where: { id: d.lessonId }, data });
    await audit(admin.id, "course.lesson.update", "product", before.module.productId,
      { titleFr: before.titleFr, published: before.published, videoId: before.videoId },
      { titleFr: data.titleFr, published: data.published, videoId: data.videoId }, tx);
  });
  revalidatePath(page(before.module.productId));
  return { ok: data.published ? "Leçon enregistrée et en ligne." : "Leçon enregistrée, hors ligne." };
}

export async function deleteLesson(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const l = await prisma.lesson.findUnique({ where: { id: String(form.get("lessonId") ?? "") }, include: { module: true } });
  if (!l) return;
  await prisma.$transaction(async (tx) => {
    await tx.lesson.delete({ where: { id: l.id } });
    await audit(admin.id, "course.lesson.delete", "product", l.module.productId, { titleFr: l.titleFr }, null, tx);
  });
  revalidatePath(page(l.module.productId));
}

// ─── Accès offerts (invités, partenaires, tests) ───

export async function grantAccess(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = z
    .object({ productId: z.string().min(1), email: z.string().trim().toLowerCase().email().max(200), name: z.string().trim().min(2).max(120) })
    .safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Indiquez un nom et une adresse e-mail valides." };
  const course = await courseOf(p.data.productId);
  if (!course) return { error: "Cours introuvable." };
  await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { email: p.data.email },
      create: { email: p.data.email, name: p.data.name },
      update: {},
    });
    await tx.entitlement.upsert({
      where: { customerId_productId: { customerId: customer.id, productId: course.id } },
      create: { customerId: customer.id, productId: course.id, source: "admin" },
      update: {},
    });
    await audit(admin.id, "course.access.grant", "product", course.id, null, { email: p.data.email }, tx);
  });
  revalidatePath(page(course.id));
  return { ok: `Accès ouvert pour ${p.data.email}. La personne se connecte depuis « Mon espace » avec cette adresse.` };
}

/** Retire un accès offert. Un accès acheté ne se retire pas d'ici (remboursement à traiter à part). */
export async function revokeAccess(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const e = await prisma.entitlement.findUnique({ where: { id: String(form.get("entitlementId") ?? "") }, include: { customer: true } });
  if (!e || e.source !== "admin") return;
  await prisma.$transaction(async (tx) => {
    await tx.entitlement.delete({ where: { id: e.id } });
    await audit(admin.id, "course.access.revoke", "product", e.productId, { email: e.customer.email }, null, tx);
  });
  revalidatePath(page(e.productId));
}
