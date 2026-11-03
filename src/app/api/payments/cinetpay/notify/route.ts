import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/shop/orders";
import { sendOrderPaidEmails } from "@/lib/shop/notify";

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

// CinetPay peut rejouer la notification : confirmPayment est idempotent,
// et le statut est toujours relu par l'API check, jamais pris dans ce corps.
export async function POST(request: Request) {
  const ref = await extractTransactionId(request);
  if (!ref) return NextResponse.json({ ok: true });
  const r = await confirmPayment("cinetpay", ref);
  if (r.newlyPaid && r.orderId) await sendOrderPaidEmails(r.orderId);
  return NextResponse.json({ ok: true });
}
