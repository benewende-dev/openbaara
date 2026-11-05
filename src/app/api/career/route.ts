import { NextResponse } from "next/server";
import { sendLeadEmail, isEmailConfigured, escapeHtml } from "@/lib/email";
import { rateLimit, clientKey } from "@/lib/rate-limit";

const NOT_CONFIGURED =
  "Les candidatures ne sont pas encore activées. Écrivez-nous à contact@openbaara.com.";

const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 Mo

type CvFile = { name?: string; type?: string; content?: string }; // content = base64

export async function POST(request: Request) {
  const rl = rateLimit(clientKey(request, "career"), { limit: 3, windowMs: 60_000 });
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

  const { name, email, linkedin, github, message } = body as Record<string, string>;
  const cvFile = body.cvFile as CvFile | null;

  if (!name || !email) {
    return NextResponse.json(
      { success: false, error: "Nom et email sont requis" },
      { status: 400 }
    );
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ success: false, error: "Adresse email invalide" }, { status: 400 });
  }

  // Validation taille du CV (base64 ≈ 4/3 de la taille réelle)
  const attachments: { filename: string; content: string }[] = [];
  if (cvFile?.content && cvFile.name) {
    const approxBytes = Math.floor((cvFile.content.length * 3) / 4);
    if (approxBytes > MAX_CV_BYTES) {
      return NextResponse.json(
        { success: false, error: "Le CV dépasse 5 Mo." },
        { status: 400 }
      );
    }
    attachments.push({ filename: cvFile.name, content: cvFile.content });
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({ success: false, error: NOT_CONFIGURED }, { status: 503 });
  }

  const sent = await sendLeadEmail({
    subject: `[Candidature] ${name}`,
    replyTo: email,
    attachments,
    html: `<h2>Nouvelle candidature</h2>
      <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>
      <p><strong>LinkedIn / Portfolio :</strong> ${escapeHtml(linkedin || "—")}</p>
      <p><strong>GitHub :</strong> ${escapeHtml(github || "—")}</p>
      <p><strong>Message :</strong></p>
      <p>${escapeHtml(message || "—").replace(/\n/g, "<br>")}</p>
      <p><strong>CV :</strong> ${cvFile?.name ? escapeHtml(cvFile.name) + (attachments.length ? " (joint)" : " (non transmis)") : "aucun"}</p>`,
  });

  if (!sent.ok) {
    console.error("Career email failed:", sent.error);
    return NextResponse.json(
      { success: false, error: "L'envoi a échoué. Réessayez ou écrivez à contact@openbaara.com." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, message: "Candidature envoyée" }, { status: 200 });
}
