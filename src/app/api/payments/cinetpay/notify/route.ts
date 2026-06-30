import { NextResponse } from "next/server";
import { checkCinetPayTransaction } from "@/lib/payments/cinetpay";
import { sendLeadEmail, isEmailConfigured, escapeHtml } from "@/lib/email";

// Dédoublonnage best-effort en mémoire (par instance) pour éviter d'envoyer
// plusieurs e-mails admin si CinetPay rejoue la notification.
// Sans base de données, ce n'est pas une garantie inter-instances.
const handled = new Set<string>();

async function extractTransactionId(request: Request): Promise<string | null> {
  const ct = request.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      const j = (await request.json()) as Record<string, unknown>;
      return (j.cpm_trans_id as string) || (j.transaction_id as string) || null;
    }
    const form = await request.formData();
    return (form.get("cpm_trans_id") as string) || (form.get("transaction_id") as string) || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const transactionId = await extractTransactionId(request);
  // On répond toujours 200 à CinetPay une fois la notification reçue.
  if (!transactionId) return NextResponse.json({ ok: true });

  // Source de vérité = l'API check (on ne fait jamais confiance au POST).
  const check = await checkCinetPayTransaction(transactionId);

  if (check.status === "accepted" && !handled.has(transactionId)) {
    handled.add(transactionId);
    if (handled.size > 5000) handled.clear();

    if (isEmailConfigured()) {
      await sendLeadEmail({
        subject: `[Commande payée] ${transactionId}`,
        html: `<h2>Nouvelle commande payée (CinetPay)</h2>
          <p><strong>Transaction :</strong> ${escapeHtml(transactionId)}</p>
          <p><strong>Montant :</strong> ${check.amount ?? "—"} FCFA</p>
          <p><strong>Détails :</strong> ${escapeHtml(check.metadata || "—")}</p>`,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
