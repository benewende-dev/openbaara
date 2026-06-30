import { NextResponse } from "next/server";
import { sendLeadEmail, isEmailConfigured, escapeHtml } from "@/lib/email";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const NOT_CONFIGURED =
  "L'inscription n'est pas encore active. Écrivez-nous à contact@openbaara.com.";

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "newsletter"), { limit: 5, windowMs: 60_000 });
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

  const { email } = body as Record<string, string>;

  if (!email) {
    return NextResponse.json({ success: false, error: "Email requis" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, error: "Adresse email invalide" }, { status: 400 });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ success: false, error: NOT_CONFIGURED }, { status: 503 });
  }

  const sent = await sendLeadEmail({
    subject: `[Newsletter] Nouvelle inscription — ${email}`,
    replyTo: email,
    html: `<h2>Nouvelle inscription newsletter</h2>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>`,
  });

  if (!sent.ok) {
    console.error("Newsletter email failed:", sent.error);
    return NextResponse.json(
      { success: false, error: "L'inscription a échoué. Réessayez plus tard." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, message: "Inscription enregistrée" }, { status: 200 });
}
