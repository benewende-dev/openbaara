// ─── E-mails envoyés quand une commande est payée ───

import { prisma } from "@/lib/db";
import { escapeHtml, isEmailConfigured, sendLeadEmail } from "@/lib/email";
import { formatXof } from "./pricing";

export async function sendOrderPaidEmails(orderId: string): Promise<void> {
  if (!isEmailConfigured()) return;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, customer: true, promoCode: true },
  });
  if (!order) return;
  const en = order.locale === "en";
  const rows = order.items
    .map((i) => `<tr><td>${i.quantity} × ${escapeHtml(i.name)}</td><td style="text-align:right">${formatXof(i.unitXof * i.quantity)}</td></tr>`)
    .join("");
  const promo = order.discountXof
    ? `<tr><td>${en ? "Discount" : "Remise"} (${escapeHtml(order.promoCode?.code ?? "")})</td><td style="text-align:right">- ${formatXof(order.discountXof)}</td></tr>`
    : "";
  const table = `<table style="width:100%;border-collapse:collapse">${rows}${promo}<tr><td><strong>Total</strong></td><td style="text-align:right"><strong>${formatXof(order.totalXof)}</strong></td></tr></table>`;
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://openbaara.com").replace(/\/$/, "");

  await sendLeadEmail({
    to: order.customer.email,
    subject: en ? `Your OpenBaara order ${order.ref}` : `Votre commande OpenBaara ${order.ref}`,
    html: `<p>${en ? "Hello" : "Bonjour"} ${escapeHtml(order.customer.name)},</p>
      <p>${en ? "Your payment has been received. Your access is open." : "Votre paiement est bien reçu. Vos accès sont ouverts."}</p>
      ${table}
      <p><a href="${site}/${order.locale}/academy">${en ? "Go to the Academy" : "Aller à l'Academy"}</a></p>
      <p>${en ? "Reference" : "Référence"} : ${escapeHtml(order.ref)}</p>`,
  });
  await sendLeadEmail({
    subject: `[Commande payée] ${order.ref} · ${formatXof(order.totalXof)}`,
    replyTo: order.customer.email,
    html: `<p><strong>${escapeHtml(order.customer.name)}</strong> (${escapeHtml(order.customer.email)}, ${escapeHtml(order.customer.phone ?? "")})</p>${table}<p>Moyen : ${escapeHtml(order.provider)}</p>`,
  });
}
