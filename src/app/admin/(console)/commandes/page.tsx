import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { ORDER_STATUS, fmtDateTime, formatXof } from "../../_components/format";

export const metadata = { title: "Commandes" };

const FILTERS: (OrderStatus | "all")[] = ["all", "paid", "pending", "failed", "refunded"];

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  await requireAdmin();
  const { s } = await searchParams;
  const status = FILTERS.includes(s as OrderStatus) && s !== "all" ? (s as OrderStatus) : undefined;
  const orders = await prisma.order.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { customer: true, items: true, promoCode: true },
  });

  return (
    <>
      <div className="head"><h1>Commandes</h1></div>
      <nav className="tabs" aria-label="Statut">
        {FILTERS.map((f) => (
          <Link key={f} href={f === "all" ? "/admin/commandes" : `/admin/commandes?s=${f}`} aria-current={(status ?? "all") === f ? "page" : undefined}>
            {f === "all" ? "Toutes" : ORDER_STATUS[f][0]}
          </Link>
        ))}
      </nav>
      {orders.length ? (
        <table className="t">
          <thead><tr><th>Référence</th><th>Client</th><th>Articles</th><th>Code promo</th><th>Moyen</th><th>Date</th><th>Statut</th><th className="r">Total</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="mono small">{o.ref}</td>
                <td>{o.customer.name}<div className="small muted">{o.customer.email}</div></td>
                <td className="small">{o.items.map((i) => i.name).join(", ")}</td>
                <td className="small">{o.promoCode ? <><span className="mono">{o.promoCode.code}</span><div className="muted num">- {formatXof(o.discountXof)}</div></> : <span className="muted">Aucun</span>}</td>
                <td className="small">{o.provider === "pispi" ? "PI-SPI" : "CinetPay"}</td>
                <td className="small muted">{fmtDateTime(o.createdAt)}</td>
                <td><span className={`pill ${ORDER_STATUS[o.status][1]}`}>{ORDER_STATUS[o.status][0]}</span></td>
                <td className="r num">{formatXof(o.totalXof)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div className="card empty">Aucune commande{status ? " avec ce statut" : ""}.</div>}
    </>
  );
}
