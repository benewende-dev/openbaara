// ─── Intégration CinetPay (API Checkout v2) — encaissement Mobile Money / carte ───
// Pas de base de données sur ce site : on s'appuie sur l'API CinetPay comme
// source de vérité (initiate → page hébergée, check → statut réel).

const BASE = "https://api-checkout.cinetpay.com/v2";

export function isCinetPayConfigured(): boolean {
  return Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID);
}

/** XOF : CinetPay exige un montant entier, multiple de 5. */
export function normalizeXof(amount: number): number {
  return Math.round(amount / 5) * 5;
}

type InitiateParams = {
  transactionId: string;
  amount: number; // XOF, déjà normalisé
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl: string;
  metadata?: string;
};

type InitiateResult = { ok: true; url: string } | { ok: false; error: string };

export async function initiateCinetPayPayment(p: InitiateParams): Promise<InitiateResult> {
  if (!isCinetPayConfigured()) return { ok: false, error: "not_configured" };

  try {
    const res = await fetch(`${BASE}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: p.transactionId,
        amount: p.amount,
        currency: "XOF",
        description: p.description,
        customer_name: p.customerName,
        customer_surname: "",
        customer_email: p.customerEmail,
        customer_phone_number: p.customerPhone,
        customer_country: "CI",
        channels: "ALL",
        lang: "fr",
        metadata: p.metadata ?? "",
        notify_url: p.notifyUrl,
        return_url: p.returnUrl,
      }),
    });

    const json = (await res.json()) as {
      code?: string;
      message?: string;
      data?: { payment_url?: string; payment_token?: string };
    };

    // code "201" = CREATED (succès d'initiation)
    if (json.code === "201" && json.data?.payment_url) {
      return { ok: true, url: json.data.payment_url };
    }
    return { ok: false, error: json.message || "init_failed" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network_error" };
  }
}

export type CinetPayStatus = "accepted" | "pending" | "refused" | "unknown";

type CheckResult = {
  status: CinetPayStatus;
  amount?: number;
  metadata?: string;
  raw?: string;
};

export async function checkCinetPayTransaction(transactionId: string): Promise<CheckResult> {
  if (!isCinetPayConfigured()) return { status: "unknown" };

  try {
    const res = await fetch(`${BASE}/payment/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey: process.env.CINETPAY_API_KEY,
        site_id: process.env.CINETPAY_SITE_ID,
        transaction_id: transactionId,
      }),
    });

    const json = (await res.json()) as {
      code?: string;
      message?: string;
      data?: { status?: string; amount?: number | string; metadata?: string };
    };

    const apiStatus = (json.data?.status || "").toUpperCase();
    let status: CinetPayStatus = "unknown";
    // code "00" = SUCCES (transaction trouvée et payée)
    if (json.code === "00" && apiStatus === "ACCEPTED") status = "accepted";
    else if (apiStatus === "REFUSED") status = "refused";
    else if (apiStatus === "PENDING" || apiStatus === "WAITING_FOR_CUSTOMER" || json.code === "662")
      status = "pending";

    const amountRaw = json.data?.amount;
    const amount = typeof amountRaw === "string" ? Number(amountRaw) : amountRaw;

    return { status, amount, metadata: json.data?.metadata, raw: json.message };
  } catch {
    return { status: "unknown" };
  }
}
