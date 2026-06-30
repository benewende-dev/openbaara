import { NextResponse } from "next/server";
import { sendLeadEmail, isEmailConfigured, escapeHtml } from "@/lib/email";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const NOT_CONFIGURED =
  "Le service n'est pas encore configuré. Écrivez-nous directement à contact@openbaara.com.";

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "audit"), { limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { success: false, error: "Trop de tentatives. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Requête invalide" }, { status: 400 });
  }

  const { company, name, email, sector, message } = body as Record<string, string>;

  if (!company || !name || !email || !sector) {
    return NextResponse.json(
      { success: false, error: "Entreprise, nom, email et secteur sont requis" },
      { status: 400 }
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, error: "Adresse email invalide" }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ success: false, error: NOT_CONFIGURED }, { status: 503 });
  }

  const sent = await sendLeadEmail({
    subject: `[Audit B2B] ${company} — ${name}`,
    replyTo: email,
    html: `<h2>Demande d'audit B2B</h2>
      <p><strong>Entreprise :</strong> ${escapeHtml(company)}</p>
      <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>
      <p><strong>Secteur :</strong> ${escapeHtml(sector)}</p>
      <p><strong>Besoin :</strong></p>
      <p>${escapeHtml(message || "—").replace(/\n/g, "<br>")}</p>`,
  });

  if (!sent.ok) {
    console.error("Audit email failed:", sent.error);
    return NextResponse.json(
      { success: false, error: "L'envoi a échoué. Réessayez ou écrivez à contact@openbaara.com." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, message: "Demande reçue" }, { status: 200 });
}
