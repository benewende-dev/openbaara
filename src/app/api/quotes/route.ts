import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { escapeHtml, sendLeadEmail } from "@/lib/email";
import { formatXof } from "@/lib/shop/pricing";
import { rateLimit, clientKey } from "@/lib/rate-limit";

// Demande de devis envoyée par l'estimateur de la page Services.
const Body = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(160).optional(),
  category: z.enum(["vitrine", "ecommerce", "mobile", "saas", "ia", "maintenance"]),
  size: z.number().int().min(0).max(1000).optional(),
  estimateLo: z.number().int().min(0).optional(),
  estimateHi: z.number().int().min(0).optional(),
  message: z.string().trim().max(4000).optional(),
});

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "quotes"), { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const q = await prisma.quoteRequest.create({ data: parsed.data });
  await sendLeadEmail({
    subject: `[Devis] ${q.company || q.name} · ${q.category}`,
    replyTo: q.email,
    html: `<p><strong>${escapeHtml(q.name)}</strong>${q.company ? `, ${escapeHtml(q.company)}` : ""} (${escapeHtml(q.email)}${q.phone ? `, ${escapeHtml(q.phone)}` : ""})</p>
      <p>Type : ${escapeHtml(q.category)}${q.estimateLo != null ? ` · estimation ${formatXof(q.estimateLo)} à ${formatXof(q.estimateHi)}` : ""}</p>
      <p>${escapeHtml(q.message ?? "")}</p>`,
  });
  return NextResponse.json({ ok: true });
}
