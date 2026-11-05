import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ORDER_STATUS, fmtDateTime, formatXof } from "../_components/format";

export const metadata = { title: "Tableau de bord" };

export default async function Dashboard() {
  await requireAdmin();
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [paid, pendingCount, newQuotes, recent, scheduled] = await Promise.all([
    prisma.order.aggregate({ where: { status: "paid", paidAt: { gte: monthStart } }, _sum: { totalXof: true }, _count: true }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.quoteRequest.count({ where: { status: "new" } }),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { customer: true } }),
    prisma.price.findMany({ where: { validFrom: { gt: now } }, include: { product: true }, orderBy: { validFrom: "asc" }, take: 5 }),
  ]);
  const total = paid._sum.totalXof ?? 0;
  const avg = paid._count ? Math.round(total / paid._count) : 0;
  const month = new Intl.DateTimeFormat("fr-FR", { month: "long", timeZone: "Africa/Abidjan" }).format(now);

  return (
    <>
      <div className="head"><h1>Tableau de bord</h1></div>
      <div className="grid4" style={{ marginBottom: 24 }}>
        <div className="card kpi"><span className="muted small">Encaissé en {month}</span><div className="v num">{formatXof(total)}</div></div>
        <div className="card kpi"><span className="muted small">Commandes payées</span><div className="v num">{paid._count}</div></div>
        <div className="card kpi"><span className="muted small">Panier moyen</span><div className="v num">{avg ? formatXof(avg) : "Aucun"}</div></div>
        <div className="card kpi"><span className="muted small">Devis à traiter</span><div className="v num">{newQuotes}</div><Link href="/admin/devis" className="small muted">Voir les demandes</Link></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, alignItems: "start" }}>
        <section>
          <div className="head" style={{ marginBottom: 12 }}><h2 style={{ margin: 0 }}>Dernières commandes</h2><Link href="/admin/commandes" className="small">Toutes ({pendingCount} en attente)</Link></div>
          {recent.length ? (
            <table className="t"><thead><tr><th>Référence</th><th>Client</th><th>Date</th><th>Statut</th><th className="r">Total</th></tr></thead>
              <tbody>{recent.map((o) => (
                <tr key={o.id}><td className="mono small">{o.ref}</td><td>{o.customer.name}</td><td className="small muted">{fmtDateTime(o.createdAt)}</td>
                  <td><span className={`pill ${ORDER_STATUS[o.status][1]}`}>{ORDER_STATUS[o.status][0]}</span></td><td className="r num">{formatXof(o.totalXof)}</td></tr>
              ))}</tbody></table>
          ) : <div className="card empty">Aucune commande pour l&apos;instant.</div>}
        </section>
        <section className="card">
          <h2>Changements de prix programmés</h2>
          {scheduled.length ? (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {scheduled.map((p) => (
                <li key={p.id} style={{ display: "flex", flexDirection: "column" }}>
                  <Link href={`/admin/catalogue/${p.productId}`} style={{ fontWeight: 500 }}>{p.product.nameFr}</Link>
                  <span className="small muted"><span className="num">{formatXof(p.amountXof)}</span> le {fmtDateTime(p.validFrom)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="small muted" style={{ margin: 0 }}>Aucun changement prévu.</p>}
        </section>
      </div>
    </>
  );
}
