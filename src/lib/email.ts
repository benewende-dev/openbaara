// ─── Envoi d'email via l'API Resend (appel REST direct, sans dépendance) ───
// Config requise en prod (Vercel → Environment Variables) :
//   RESEND_API_KEY   (obligatoire pour envoyer)
//   LEAD_TO_EMAIL    (destinataire des leads ; défaut: contact@openbaara.com)
//   LEAD_FROM_EMAIL  (expéditeur ; défaut: onboarding@resend.dev — à remplacer par un domaine vérifié)

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string)
  );
}

type Attachment = { filename: string; content: string }; // content = base64

export async function sendLeadEmail(opts: {
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "not_configured" };

  const from = process.env.LEAD_FROM_EMAIL || "OpenBaara <onboarding@resend.dev>";
  const to = process.env.LEAD_TO_EMAIL || "contact@openbaara.com";

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        ...(opts.attachments?.length ? { attachments: opts.attachments } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `resend_${res.status}${detail ? `: ${detail.slice(0, 200)}` : ""}` };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "network_error" };
  }
}
