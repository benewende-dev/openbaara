import { cinetpay } from "./cinetpay";
import { pispi } from "./pispi";
import type { PaymentMethod, PaymentProvider, ProviderId } from "./types";

export const providers: Record<ProviderId, PaymentProvider> = { pispi, cinetpay };

/** Prestataire qui sert une méthode choisie à l'écran. */
export function providerFor(method: PaymentMethod): PaymentProvider {
  return method === "pispi" ? pispi : cinetpay;
}

/** Méthodes réellement disponibles, dans l'ordre d'affichage. */
export function availableMethods(): PaymentMethod[] {
  const out: PaymentMethod[] = [];
  if (pispi.isConfigured()) out.push("pispi");
  if (cinetpay.isConfigured()) out.push("mobile_money", "card");
  return out;
}

export type { PaymentMethod, ProviderId } from "./types";
