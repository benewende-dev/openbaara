import { NextResponse } from "next/server";
import { confirmPayment, orderStatusByRef } from "@/lib/shop/orders";
import { sendOrderPaidEmails } from "@/lib/shop/notify";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import type { ProviderId } from "@/lib/payments";

// Page de retour : on revérifie auprès du prestataire, au cas où la notification serait en retard.
export async function GET(request: Request) {
  const rl = rateLimit(clientKey(request, "order-status"), { limit: 20, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ status: "unknown", error: "rate_limited" }, { status: 429 });

  const ref = new URL(request.url).searchParams.get("ref");
  if (!ref) return NextResponse.json({ status: "unknown", error: "missing_ref" }, { status: 400 });

  const order = await orderStatusByRef(ref);
  if (!order) return NextResponse.json({ status: "unknown" }, { status: 404 });

  if (order.status === "pending" && order.payments[0]) {
    const r = await confirmPayment(order.provider as ProviderId, order.payments[0].providerRef);
    if (r.newlyPaid && r.orderId) await sendOrderPaidEmails(r.orderId);
    if (r.status === "paid" || r.status === "failed") return NextResponse.json({ status: r.status === "paid" ? "accepted" : "refused" });
    return NextResponse.json({ status: "pending" });
  }
  const map = { paid: "accepted", pending: "pending", failed: "refused", cancelled: "refused", refunded: "refused" } as const;
  return NextResponse.json({ status: map[order.status] });
}
