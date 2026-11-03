"use server";

// Actions de la console. Chacune revérifie la session et le rôle, valide ses entrées
// et laisse une trace dans le journal d'audit.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  CAN_EDIT,
  checkTotp,
  endSession,
  getPendingSession,
  markVerified,
  requireAdmin,
  startSession,
  verifyPassword,
} from "@/lib/admin/auth";
import { audit } from "@/lib/admin/audit";
import { normalizeCode } from "@/lib/shop/pricing";
import { rateLimitKey } from "@/lib/admin/rate";

export type FormState = { error?: string; ok?: string } | undefined;

/** Les champs date du navigateur n'ont pas de fuseau : on les lit à l'heure d'Abidjan (UTC). */
function abidjanDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(/T\d{2}:\d{2}$/.test(value) ? `${value}:00Z` : /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// ─── Connexion ───

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!(await rateLimitKey(`login:${email.toLowerCase()}`))) return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  const admin = await verifyPassword(email, password);
  if (!admin) return { error: "Adresse ou mot de passe incorrect." };
  await startSession(admin.id);
  redirect("/admin/verify");
}

export async function verifyTotp(_: FormState, form: FormData): Promise<FormState> {
  const s = await getPendingSession();
  if (!s) redirect("/admin/login");
  if (!(await rateLimitKey(`totp:${s.adminId}`))) return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  const code = String(form.get("code") ?? "");
  const secret = s.admin.totpEnabled ? s.admin.totpSecret : String(form.get("secret") ?? "");
  if (!secret || !checkTotp(s.admin.email, secret, code)) return { error: "Code incorrect ou expiré." };
  if (!s.admin.totpEnabled) {
    await prisma.adminUser.update({ where: { id: s.adminId }, data: { totpSecret: secret, totpEnabled: true } });
    await audit(s.adminId, "admin.totp_enabled", "admin", s.adminId);
  }
  await markVerified();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

// ─── Catalogue ───

const PriceInput = z.object({
  productId: z.string().min(1),
  amount: z.string().trim(),
  when: z.enum(["now", "later"]),
  validFrom: z.string().optional(),
  note: z.string().trim().max(200).optional(),
});

/** Ajoute un prix (immédiat ou programmé). Un prix n'est jamais modifié : l'historique reste complet. */
export async function setPrice(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = PriceInput.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Formulaire incomplet." };
  const raw = p.data.amount.replace(/[\s  ]/g, "");
  const amountXof = raw === "" || /^sur devis$/i.test(p.data.amount) ? null : Number(raw);
  if (amountXof !== null && (!Number.isInteger(amountXof) || amountXof < 0 || amountXof % 5 !== 0)) {
    return { error: "Le prix doit être un nombre entier de F CFA, multiple de 5." };
  }
  let validFrom = new Date();
  if (p.data.when === "later") {
    const at = abidjanDate(p.data.validFrom);
    if (!at || at <= new Date()) return { error: "Choisissez une date à venir." };
    validFrom = at;
  }
  const product = await prisma.product.findUnique({ where: { id: p.data.productId } });
  if (!product) return { error: "Produit introuvable." };
  await prisma.$transaction(async (tx) => {
    const price = await tx.price.create({
      data: { productId: product.id, amountXof, validFrom, note: p.data.note || null, createdById: admin.id },
    });
    await audit(admin.id, p.data.when === "now" ? "price.set" : "price.schedule", "product", product.id, null,
      { slug: product.slug, amountXof, validFrom: validFrom.toISOString(), priceId: price.id }, tx);
  });
  revalidatePath("/admin/catalogue");
  revalidatePath("/", "layout");
  return { ok: p.data.when === "now" ? "Nouveau prix en ligne." : "Changement de prix programmé." };
}

/** Annule un changement de prix programmé qui n'est pas encore entré en vigueur. */
export async function cancelScheduledPrice(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const id = String(form.get("priceId") ?? "");
  const price = await prisma.price.findUnique({ where: { id } });
  if (!price || price.validFrom <= new Date()) return;
  await prisma.$transaction(async (tx) => {
    await tx.price.delete({ where: { id } });
    await audit(admin.id, "price.cancel", "product", price.productId, { amountXof: price.amountXof, validFrom: price.validFrom.toISOString() }, null, tx);
  });
  revalidatePath("/admin/catalogue");
}

export async function toggleProduct(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const id = String(form.get("productId") ?? "");
  const field = String(form.get("field") ?? "");
  if (field !== "published" && field !== "purchasable") return;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  const next = !product[field];
  await prisma.$transaction(async (tx) => {
    await tx.product.update({ where: { id }, data: { [field]: next } });
    await audit(admin.id, `product.${field}`, "product", id, { [field]: product[field] }, { [field]: next }, tx);
  });
  revalidatePath("/admin/catalogue");
  revalidatePath("/", "layout");
}

const ProductInput = z.object({
  productId: z.string().min(1),
  nameFr: z.string().trim().min(2).max(160),
  nameEn: z.string().trim().min(2).max(160),
  descriptionFr: z.string().trim().max(2000),
  descriptionEn: z.string().trim().max(2000),
  deliveryFr: z.string().trim().max(80),
  deliveryEn: z.string().trim().max(80),
  audienceFr: z.string().trim().max(160),
  audienceEn: z.string().trim().max(160),
  featuresFr: z.string().max(4000),
  featuresEn: z.string().max(4000),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export async function updateProduct(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = ProductInput.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Vérifiez les champs : les noms sont obligatoires." };
  const d = p.data;
  const fr = d.featuresFr.split("\n").map((s) => s.trim()).filter(Boolean);
  const en = d.featuresEn.split("\n").map((s) => s.trim()).filter(Boolean);
  const features = fr.map((t, i) => ({ fr: t, en: en[i] ?? t }));
  const before = await prisma.product.findUnique({ where: { id: d.productId } });
  if (!before) return { error: "Produit introuvable." };
  const data = {
    nameFr: d.nameFr, nameEn: d.nameEn, descriptionFr: d.descriptionFr, descriptionEn: d.descriptionEn,
    deliveryFr: d.deliveryFr || null, deliveryEn: d.deliveryEn || null, audienceFr: d.audienceFr || null,
    audienceEn: d.audienceEn || null, features, sortOrder: d.sortOrder,
  };
  await prisma.$transaction(async (tx) => {
    await tx.product.update({ where: { id: d.productId }, data });
    await audit(admin.id, "product.update", "product", d.productId,
      { nameFr: before.nameFr, deliveryFr: before.deliveryFr, sortOrder: before.sortOrder },
      { nameFr: data.nameFr, deliveryFr: data.deliveryFr, sortOrder: data.sortOrder }, tx);
  });
  revalidatePath("/admin/catalogue");
  revalidatePath("/", "layout");
  return { ok: "Fiche enregistrée." };
}

// ─── Codes promo ───

const PromoInput = z.object({
  code: z.string().trim().min(3).max(30),
  kind: z.enum(["percent", "fixed"]),
  value: z.coerce.number().int().min(1),
  scope: z.enum(["all", "some"]),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  maxUses: z.string().optional(),
  onePerCustomer: z.string().optional(),
  note: z.string().trim().max(200).optional(),
});

export async function createPromo(_: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin(CAN_EDIT);
  const p = PromoInput.safeParse(Object.fromEntries(form));
  if (!p.success) return { error: "Vérifiez le code (3 à 30 caractères) et la valeur." };
  const d = p.data;
  const code = normalizeCode(d.code);
  if (!/^[A-Z0-9_-]+$/.test(code)) return { error: "Le code ne peut contenir que des lettres, des chiffres, - et _." };
  if (d.kind === "percent" && d.value > 100) return { error: "Un pourcentage ne peut pas dépasser 100." };
  if (d.kind === "fixed" && d.value % 5 !== 0) return { error: "Un montant fixe doit être un multiple de 5 F CFA." };
  const productSlugs = d.scope === "some" ? form.getAll("products").map(String).filter(Boolean) : [];
  if (d.scope === "some" && productSlugs.length === 0) return { error: "Choisissez au moins un produit." };
  const startsAt = abidjanDate(d.startsAt);
  const endsAt = abidjanDate(d.endsAt);
  if (startsAt && endsAt && endsAt <= startsAt) return { error: "La fin doit suivre le début." };
  const maxUses = d.maxUses ? Number(d.maxUses) : null;
  if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses < 1)) return { error: "Nombre d'utilisations invalide." };
  if (await prisma.promoCode.findUnique({ where: { code } })) return { error: `Le code ${code} existe déjà.` };

  await prisma.$transaction(async (tx) => {
    const promo = await tx.promoCode.create({
      data: { code, kind: d.kind, value: d.value, productSlugs, startsAt, endsAt, maxUses, onePerCustomer: d.onePerCustomer === "on", note: d.note || null },
    });
    await audit(admin.id, "promo.create", "promo", promo.id, null, { code, kind: d.kind, value: d.value, productSlugs, maxUses }, tx);
  });
  revalidatePath("/admin/promos");
  return { ok: `Code ${code} créé.` };
}

export async function togglePromo(form: FormData): Promise<void> {
  const admin = await requireAdmin(CAN_EDIT);
  const id = String(form.get("promoId") ?? "");
  const promo = await prisma.promoCode.findUnique({ where: { id } });
  if (!promo) return;
  await prisma.$transaction(async (tx) => {
    await tx.promoCode.update({ where: { id }, data: { active: !promo.active } });
    await audit(admin.id, promo.active ? "promo.disable" : "promo.enable", "promo", id, { active: promo.active }, { active: !promo.active }, tx);
  });
  revalidatePath("/admin/promos");
}

// ─── Devis ───

const QUOTE_STATUSES = ["new", "call_scheduled", "quote_sent", "signed", "lost"] as const;

export async function setQuoteStatus(form: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(form.get("quoteId") ?? "");
  const status = String(form.get("status") ?? "") as (typeof QUOTE_STATUSES)[number];
  if (!QUOTE_STATUSES.includes(status)) return;
  const q = await prisma.quoteRequest.findUnique({ where: { id } });
  if (!q || q.status === status) return;
  await prisma.$transaction(async (tx) => {
    await tx.quoteRequest.update({ where: { id }, data: { status } });
    await audit(admin.id, "quote.status", "quote", id, { status: q.status }, { status }, tx);
  });
  revalidatePath("/admin/devis");
}
