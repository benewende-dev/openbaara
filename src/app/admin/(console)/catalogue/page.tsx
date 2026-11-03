import Link from "next/link";
import { prisma } from "@/lib/db";
import { CAN_EDIT, requireAdmin } from "@/lib/admin/auth";
import { currentPrice, nextScheduledPrice } from "@/lib/shop/pricing";
import { toggleProduct } from "../../actions";
import { CATEGORY, KIND, fmtDate, formatXof } from "../../_components/format";

export const metadata = { title: "Forfaits et produits" };

export default async function CataloguePage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const admin = await requireAdmin();
  const canEdit = CAN_EDIT.includes(admin.role);
  const { cat } = await searchParams;
  const now = new Date();
  const all = await prisma.product.findMany({ include: { prices: true }, orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  const cats = [...new Set(all.map((p) => p.category))];
  const rows = cat ? all.filter((p) => p.category === cat) : all;

  return (
    <>
      <div className="head">
        <div><h1>Forfaits et produits</h1><p className="muted" style={{ margin: "4px 0 0" }}>Prix en F CFA. Un changement de prix peut être immédiat ou programmé ; l&apos;historique est conservé.</p></div>
      </div>
      <nav className="tabs" aria-label="Catégories">
        <Link href="/admin/catalogue" aria-current={!cat ? "page" : undefined}>Tout ({all.length})</Link>
        {cats.map((c) => (
          <Link key={c} href={`/admin/catalogue?cat=${c}`} aria-current={cat === c ? "page" : undefined}>{CATEGORY[c] ?? c} ({all.filter((p) => p.category === c).length})</Link>
        ))}
      </nav>
      <table className="t">
        <thead><tr><th>Produit</th><th>Type</th><th className="r">Prix en vigueur</th><th>Changement prévu</th><th>Vente en ligne</th><th>Statut</th><th></th></tr></thead>
        <tbody>
          {rows.map((p) => {
            const cur = currentPrice(p.prices, now);
            const next = nextScheduledPrice(p.prices, now);
            return (
              <tr key={p.id}>
                <td><Link href={`/admin/catalogue/${p.id}`} style={{ fontWeight: 500, textDecoration: "none" }}>{p.nameFr}</Link><div className="small muted mono">{p.slug}</div></td>
                <td className="small">{KIND[p.kind]}<div className="muted">{CATEGORY[p.category] ?? p.category}</div></td>
                <td className="r num">{cur ? formatXof(cur.amountXof) : <span className="muted">Aucun</span>}</td>
                <td className="small">{next ? <><span className="num">{formatXof(next.amountXof)}</span><div className="muted">le {fmtDate(next.validFrom)}</div></> : <span className="muted">Aucun</span>}</td>
                <td>
                  <form action={toggleProduct}><input type="hidden" name="productId" value={p.id} /><input type="hidden" name="field" value="purchasable" />
                    <button className={`pill ${p.purchasable ? "ok" : ""}`} style={{ border: 0, cursor: canEdit ? "pointer" : "default" }} disabled={!canEdit} title="Basculer">{p.purchasable ? "Payable en ligne" : "Sur devis"}</button>
                  </form>
                </td>
                <td>
                  <form action={toggleProduct}><input type="hidden" name="productId" value={p.id} /><input type="hidden" name="field" value="published" />
                    <button className={`pill ${p.published ? "ok" : "warn"}`} style={{ border: 0, cursor: canEdit ? "pointer" : "default" }} disabled={!canEdit} title="Basculer">{p.published ? "En ligne" : "Hors ligne"}</button>
                  </form>
                </td>
                <td className="r"><Link href={`/admin/catalogue/${p.id}`} className="btn sm">Modifier</Link></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
