// ─── Lecture des vidéos de cours (Bunny Stream) ───
// L'adresse de lecture est signée et expire : elle n'est fabriquée qu'après vérification
// du droit d'accès, côté serveur. Sans configuration, la leçon affiche « vidéo en préparation ».
//
//   BUNNY_STREAM_LIBRARY_ID  identifiant de la bibliothèque
//   BUNNY_STREAM_TOKEN_KEY   clé d'authentification par jeton
// Signature : sha256_hex(clé + videoId + expiration), cf. docs.bunny.net « embed token authentication ».

import "server-only";
import { createHash } from "node:crypto";

export function isVideoConfigured(): boolean {
  return Boolean(process.env.BUNNY_STREAM_LIBRARY_ID && process.env.BUNNY_STREAM_TOKEN_KEY);
}

export function signedEmbedUrl(videoId: string, expiresInSeconds = 4 * 3600): string | null {
  const library = process.env.BUNNY_STREAM_LIBRARY_ID;
  const key = process.env.BUNNY_STREAM_TOKEN_KEY;
  if (!library || !key) return null;
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const token = createHash("sha256").update(key + videoId + expires).digest("hex");
  return `https://iframe.mediadelivery.net/embed/${library}/${encodeURIComponent(videoId)}?token=${token}&expires=${expires}&preload=false`;
}
