// ─── CinetPay (API Checkout v2) : Mobile Money par opérateur et cartes ───

import type { CheckResult, InitiateInput, InitiateResult, PaymentProvider } from "./types";

const BASE = "https://api-checkout.cinetpay.com/v2";

function configured(): boolean {
  return Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID);
}

const CHANNELS: Record<InitiateInput["method"], string> = {
  mobile_money: "MOBILE_MONEY",
  card: "CREDIT_CARD",
  pispi: "ALL",
};

async function initiate(p: InitiateInput): Promise<InitiateResult> {
  if (!configured()) return { ok: false, error: "not_configured" };
  try {
    const res = await fetch(`${BASE}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: p.ref,
        amount: p.amountXof,
        currency: "XOF",
        description: p.description.slice(0, 240),
        customer_name: p.customer.name,
        customer_surname: "",
        customer_email: p.customer.email,
        customer_phone_number: p.customer.phone ?? "",
        customer_country: "CI",
        channels: CHANNELS[p.method],
        lang: p.locale,
        metadata: p.ref,
        notify_url: p.notifyUrl,
        return_url: p.returnUrl,
      }),
    });
    const json = (await res.json()) as { code?: string; message?: string; data?: { payment_url?: string } };
    // code "201" = CREATED (succès d'initiation)
    if (json.code === "201" && json.data?.payment_url) {
      return { ok: true, providerRef: p.ref, redirectUrl: json.data.payment_url };
    }
    return { ok: false, error: json.message || "init_failed" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network_error" };
  }
}

async function check(providerRef: string): Promise<CheckResult> {
  if (!configured()) return { status: "unknown" };
  try {
    const res = await fetch(`${BASE}/payment/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: providerRef,
      }),
    });
    const json = (await res.json()) as {
      code?: string;
      message?: string;
      data?: { status?: string; amount?: number | string };
    };
    const apiStatus = (json.data?.status || "").toUpperCase();
    let status: CheckResult["status"] = "unknown";
    // code "00" = SUCCES (transaction trouvée et payée)
    if (json.code === "00" && apiStatus === "ACCEPTED") status = "accepted";
    else if (apiStatus === "REFUSED") status = "refused";
    else if (apiStatus === "PENDING" || apiStatus === "WAITING_FOR_CUSTOMER" || json.code === "662") status = "pending";
    const amountRaw = json.data?.amount;
    const amountXof = typeof amountRaw === "string" ? Number(amountRaw) : amountRaw;
    return { status, amountXof, raw: json };
  } catch {
    return { status: "unknown" };
  }
}

export const cinetpay: PaymentProvider = { id: "cinetpay", isConfigured: configured, initiate, check };
