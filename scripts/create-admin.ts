// Crée (ou réinitialise) un compte de la console.
//   ADMIN_EMAIL=... ADMIN_NAME=... ADMIN_PASSWORD=... npm run admin:create
// Rôle par défaut : owner. La double authentification se configure à la première connexion ;
// une réinitialisation la remet à zéro.

import { config } from "dotenv";
config({ path: ".env.local" });
config();

import bcrypt from "bcryptjs";
import { PrismaClient, type AdminRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" }) });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.ADMIN_NAME?.trim() || "Administrateur";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const role = (process.env.ADMIN_ROLE as AdminRole) || "owner";
  if (!email || password.length < 12) {
    console.error("ADMIN_EMAIL et ADMIN_PASSWORD (12 caractères minimum) sont requis.");
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash, role, totpSecret: null, totpEnabled: false },
    create: { email, name, passwordHash, role },
  });
  await prisma.adminSession.deleteMany({ where: { admin: { email } } });
  console.log(`Compte ${email} prêt (${role}). Double authentification à configurer à la première connexion.`);
}

main().finally(() => prisma.$disconnect());
