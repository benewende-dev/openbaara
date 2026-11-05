import "server-only";
import { rateLimit } from "@/lib/rate-limit";

/** Freine les essais de mot de passe et de code : 8 tentatives par quart d'heure et par compte. */
export async function rateLimitKey(key: string): Promise<boolean> {
  return rateLimit(`admin:${key}`, { limit: 8, windowMs: 15 * 60_000 }).ok;
}
