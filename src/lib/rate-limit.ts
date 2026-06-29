// ─── Limiteur de débit best-effort, en mémoire ───
// ⚠️ Par instance uniquement (réinitialisé au cold start, non partagé entre instances serverless).
// TODO prod : brancher Upstash Redis (@upstash/ratelimit) pour une limite distribuée fiable.

type Hit = { count: number; reset: number };

const store = new Map<string, Hit>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();

  // Élagage opportuniste des entrées expirées (borne la taille de la Map).
  if (store.size > 5000) {
    for (const [k, v] of store) if (now > v.reset) store.delete(k);
  }

  const hit = store.get(key);
  if (!hit || now > hit.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((hit.reset - now) / 1000) };
  }
  return { ok: true, remaining: limit - hit.count, retryAfter: 0 };
}

export function clientKey(req: Request, scope: string): string {
  const fwd = req.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
