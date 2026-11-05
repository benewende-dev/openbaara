// ─── Interface commune des prestataires de paiement ───
// Le site ne parle qu'à cette interface. Ajouter ou retirer un prestataire
// ne touche ni aux pages ni au calcul des commandes.

export type ProviderId = "pispi" | "cinetpay";

/** Ce que le client choisit à l'écran ; chaque méthode est servie par un prestataire. */
export type PaymentMethod = "pispi" | "mobile_money" | "card";

export type InitiateInput = {
  ref: string; // référence de commande, réutilisée comme référence chez le prestataire
  amountXof: number;
  description: string;
  method: PaymentMethod;
  customer: { name: string; email: string; phone?: string | null };
  returnUrl: string;
  notifyUrl: string;
  locale: "fr" | "en";
};

export type InitiateResult =
  | { ok: true; providerRef: string; redirectUrl?: string; qrPayload?: string }
  | { ok: false; error: string };

export type CheckStatus = "accepted" | "pending" | "refused" | "unknown";

export type CheckResult = { status: CheckStatus; amountXof?: number; raw?: unknown };

export interface PaymentProvider {
  id: ProviderId;
  isConfigured(): boolean;
  initiate(input: InitiateInput): Promise<InitiateResult>;
  /** Source de vérité : on interroge toujours le prestataire, jamais le corps d'une notification. */
  check(providerRef: string): Promise<CheckResult>;
}
