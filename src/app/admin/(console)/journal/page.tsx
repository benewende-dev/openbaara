import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDateTime } from "../../_components/format";

export const metadata = { title: "Journal d'audit" };

const ACTIONS: Record<string, string> = {
  "price.set": "Prix modifié",
  "price.schedule": "Prix programmé",
  "price.cancel": "Prix programmé annulé",
  "product.published": "Mise en ligne modifiée",
  "product.purchasable": "Vente en ligne modifiée",
  "product.update": "Fiche modifiée",
  "promo.create": "Code créé",
  "promo.disable": "Code désactivé",
  "promo.enable": "Code réactivé",
  "quote.status": "Devis déplacé",
  "admin.totp_enabled": "Double authentification activée",
};

export default async function AuditPage() {
  await requireAdmin(["owner", "editor"]);
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 300, include: { admin: true } });
  return (
    <>
      <div className="head"><div><h1>Journal d&apos;audit</h1><p className="muted" style={{ margin: "4px 0 0" }}>Chaque changement fait depuis la console, avec son auteur.</p></div></div>
      {logs.length ? (
        <table className="t">
          <thead><tr><th>Date</th><th>Qui</th><th>Action</th><th>Détail</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="small muted" style={{ whiteSpace: "nowrap" }}>{fmtDateTime(l.createdAt)}</td>
                <td>{l.admin?.name ?? "Compte supprimé"}</td>
                <td>{ACTIONS[l.action] ?? l.action}</td>
                <td className="small mono" style={{ color: "var(--fg2)", maxWidth: 520, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {l.before ? `${JSON.stringify(l.before)} → ` : ""}{l.after ? JSON.stringify(l.after) : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div className="card empty">Aucun changement enregistré.</div>}
    </>
  );
}
