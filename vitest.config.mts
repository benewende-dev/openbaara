import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  // Les tests d'intégration partagent la même base de test : un fichier à la fois.
  test: { environment: "node", include: ["src/**/*.test.ts"], fileParallelism: false },
});
