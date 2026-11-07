"use server";

// Actions de la console pour le Journal. Même règle que les autres actions :
// session et rôle revérifiés, entrées validées, trace au journal d'audit.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { CATEGORY_IDS, mergeFaq, parseFaq, slugify } from "@/lib/journal/format";
import { getVenture } from "@/data/ventures";
import type { FormState } from "./actions";

function refresh(slug?: string) {
  for (const l of ["fr", "en"]) {
    revalidatePath(`/${l}/journal`);
    if (slug) revalidatePath(`/${l}/journal/${slug}`);
  }
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/admin/articles");
}

async function freeSlug(base: string, exceptId?: string) {
  let slug = base || "article";
  for (let k = 2; ; k++) {
    const other = await prisma.article.findUnique({ where: { slug } });
    if (!other || other.id === exceptId) return slug;
    slug = `${base}-${k}`;
  }
}

export async function createArticle(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = z.object({ titleFr: z.string().trim().min(8).max(160), category: z.enum(CATEGORY_IDS as [string, ...string[]]) }).safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Donnez un titre d'au moins 8 caractères et une catégorie." };
  const slug = await freeSlug(slugify(p.data.titleFr));
  const a = await prisma.$transaction(async (tx) => {
    const created = await tx.article.create({ data: { slug, titleFr: p.data.titleFr, category: p.data.category, excerptFr: "", bodyFr: "" } });
    await audit(admin.id, "article.create", "article", created.id, null, { slug, titleFr: created.titleFr }, tx);
    return created;
  });
  refresh();
  redirect(`/admin/articles/${a.id}`);
}

const ArticleInput = z.object({
  articleId: z.string().min(1),
  slug: z.string().trim().min(3).max(90).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(CATEGORY_IDS as [string, ...string[]]),
  ventureSlug: z.string().trim().max(40),
  titleFr: z.string().trim().min(8).max(160),
  titleEn: z.string().trim().max(160),
  excerptFr: z.string().trim().max(500),
  excerptEn: z.string().trim().max(500),
  bodyFr: z.string().max(60000),
  bodyEn: z.string().max(60000),
  faqFr: z.string().max(10000),
  faqEn: z.string().max(10000),
  authorName: z.string().trim().min(2).max(120),
});

export async function updateArticle(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = ArticleInput.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Vérifiez les champs : titre d'au moins 8 caractères, adresse en minuscules et tirets, résumé de 500 caractères au plus." };
  const d = p.data;
  const before = await prisma.article.findUnique({ where: { id: d.articleId } });
  if (!before) return { error: "Article introuvable." };
  if (d.ventureSlug && !getVenture(d.ventureSlug)) return { error: "Venture inconnue." };
  const taken = await prisma.article.findUnique({ where: { slug: d.slug } });
  if (taken && taken.id !== before.id) return { error: `L'adresse « ${d.slug} » est déjà utilisée.` };
  if (before.status === "published" && (!d.excerptFr || !d.bodyFr.trim())) return { error: "Un article publié garde son résumé et son texte." };

  const data = {
    slug: d.slug,
    category: d.category,
    ventureSlug: d.ventureSlug || null,
    titleFr: d.titleFr,
    titleEn: d.titleEn || null,
    excerptFr: d.excerptFr,
    excerptEn: d.excerptEn || null,
    bodyFr: d.bodyFr.trim(),
    bodyEn: d.bodyEn.trim() || null,
    faq: mergeFaq(parseFaq(d.faqFr), parseFaq(d.faqEn)),
    authorName: d.authorName,
  };
  await prisma.$transaction(async (tx) => {
    await tx.article.update({ where: { id: before.id }, data });
    await audit(admin.id, "article.update", "article", before.id, { slug: before.slug, titleFr: before.titleFr }, { slug: data.slug, titleFr: data.titleFr }, tx);
  });
  refresh(before.slug);
  if (before.slug !== data.slug) refresh(data.slug);
  return { ok: before.status === "published" ? "Article mis à jour en ligne." : "Brouillon enregistré." };
}

/** Publie : résumé et texte obligatoires. La date de première publication est conservée. */
export async function publishArticle(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const a = await prisma.article.findUnique({ where: { id: String(form.get("articleId") ?? "") } });
  if (!a) return { error: "Article introuvable." };
  if (a.excerptFr.trim().length < 80) return { error: "Avant de publier, écrivez un résumé d'au moins 80 caractères : c'est lui que reprennent Google et les moteurs IA." };
  if (a.bodyFr.trim().split(/\s+/).length < 150) return { error: "Avant de publier, le texte doit compter au moins 150 mots." };
  await prisma.$transaction(async (tx) => {
    await tx.article.update({ where: { id: a.id }, data: { status: "published", publishedAt: a.publishedAt ?? new Date() } });
    await audit(admin.id, "article.publish", "article", a.id, { status: a.status }, { status: "published" }, tx);
  });
  refresh(a.slug);
  return { ok: "Article publié." };
}

export async function unpublishArticle(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const a = await prisma.article.findUnique({ where: { id: String(form.get("articleId") ?? "") } });
  if (!a || a.status !== "published") return;
  await prisma.$transaction(async (tx) => {
    await tx.article.update({ where: { id: a.id }, data: { status: "draft" } });
    await audit(admin.id, "article.unpublish", "article", a.id, { status: "published" }, { status: "draft" }, tx);
  });
  refresh(a.slug);
}

/** Supprime un brouillon. Un article publié doit d'abord être retiré. */
export async function deleteArticle(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const a = await prisma.article.findUnique({ where: { id: String(form.get("articleId") ?? "") } });
  if (!a || a.status !== "draft") return;
  await prisma.$transaction(async (tx) => {
    await tx.article.delete({ where: { id: a.id } });
    await audit(admin.id, "article.delete", "article", a.id, { slug: a.slug, titleFr: a.titleFr }, null, tx);
  });
  refresh();
  redirect("/admin/articles");
}
