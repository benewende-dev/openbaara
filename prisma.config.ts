import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js lit .env.local ; Prisma le lit aussi pour garder une seule configuration locale.
config({ path: ".env.local" });
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
