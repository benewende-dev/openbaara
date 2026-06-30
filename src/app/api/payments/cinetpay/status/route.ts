import { NextResponse } from "next/server";
import { checkCinetPayTransaction, isCinetPayConfigured } from "@/lib/payments/cinetpay";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const rl = rateLimit(clientKey(request, "cinetpay-status"), { limit: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { status: "unknown", error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ status: "unknown", error: "missing_id" }, { status: 400 });
  if (!isCinetPayConfigured()) {
    return NextResponse.json({ status: "unknown", error: "not_configured" }, { status: 503 });
  }

  const result = await checkCinetPayTransaction(id);
  return NextResponse.json({ status: result.status, amount: result.amount });
}
