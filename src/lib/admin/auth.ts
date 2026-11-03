// ─── Connexion à la console : mot de passe, puis double authentification (TOTP) ───
// La session est un jeton aléatoire en cookie httpOnly ; la base ne garde que son empreinte.

import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Secret, TOTP } from "otpauth";
import type { AdminRole, AdminUser } from "@prisma/client";
import { prisma } from "@/lib/db";

const COOKIE = "ob_admin";
const SESSION_HOURS = 12;

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(email: string, password: string): Promise<AdminUser | null> {
  const admin = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
  // Comparaison faite même sans compte, pour ne pas révéler quelles adresses existent.
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvali");
  return admin && ok ? admin : null;
}

export async function startSession(adminId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  await prisma.adminSession.create({
    data: { tokenHash: sha256(token), adminId, expiresAt: new Date(Date.now() + SESSION_HOURS * 3600_000) },
  });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_HOURS * 3600,
  });
}

async function readSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: sha256(token) }, include: { admin: true } });
  if (!session || session.expiresAt < new Date()) return null;
  return session;
}

/** Session ouverte par le mot de passe, double authentification pas encore passée. */
export async function getPendingSession() {
  const s = await readSession();
  return s && !s.verified ? s : null;
}

export async function markVerified(): Promise<void> {
  const s = await readSession();
  if (s) {
    await prisma.adminSession.update({ where: { id: s.id }, data: { verified: true } });
    await prisma.adminUser.update({ where: { id: s.adminId }, data: { lastLoginAt: new Date() } });
  }
}

export async function endSession(): Promise<void> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (token) await prisma.adminSession.deleteMany({ where: { tokenHash: sha256(token) } });
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

/**
 * À appeler en tête de chaque page et de chaque action de la console :
 * les actions serveur sont joignables directement, pas seulement depuis l'interface.
 */
export async function requireAdmin(roles?: AdminRole[]): Promise<AdminUser> {
  const s = await readSession();
  if (!s) redirect("/admin/login");
  if (!s.verified) redirect("/admin/verify");
  if (roles && !roles.includes(s.admin.role)) throw new Error("forbidden");
  return s.admin;
}

export const CAN_EDIT: AdminRole[] = ["owner", "editor"];

// ─── TOTP ───

export function newTotpSecret(): string {
  return new Secret({ size: 20 }).base32;
}

export function totpFor(email: string, secret: string): TOTP {
  return new TOTP({ issuer: "OpenBaara", label: email, secret: Secret.fromBase32(secret), digits: 6, period: 30 });
}

export function checkTotp(email: string, secret: string, code: string): boolean {
  const delta = totpFor(email, secret).validate({ token: code.replace(/\s/g, ""), window: 1 });
  return delta !== null;
}
