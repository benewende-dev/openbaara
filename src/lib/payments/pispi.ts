// ─── PI-SPI : paiement instantané interopérable de la BCEAO ───
// On ne se connecte pas à la BCEAO directement : on passe par l'API Business
// homologuée de l'établissement qui tient le compte d'OpenBaara. Tant que la
// banque n'a pas fourni sa documentation et ses accès, ce moyen reste désactivé
// et le site propose Mobile Money et carte via CinetPay.
//
// À brancher ici, d'après la documentation de la banque :
// - initiate : créer un QR dynamique (montant + référence) ou une demande de
//   paiement vers l'alias du client, et renvoyer qrPayload ou redirectUrl ;
// - check : lire le statut de l'opération par sa référence ;
// - une route /api/payments/pispi/notify, à créer, vérifie la signature (PISPI_WEBHOOK_SECRET)
//   avant toute lecture, puis appelle confirmPayment comme pour CinetPay.

import type { PaymentProvider } from "./types";

export const pispi: PaymentProvider = {
  id: "pispi",
  isConfigured: () => false,
  async initiate() {
    return { ok: false, error: "not_configured" };
  },
  async check() {
    return { status: "unknown" };
  },
};
