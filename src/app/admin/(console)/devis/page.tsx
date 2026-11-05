import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { setQuoteStatus } from "../../actions";
import { CATEGORY, QUOTE_STATUS, fmtDate, formatXof } from "../../_components/format";

export const metadata = { title: "Demandes de devis" };

const COLS = Object.keys(QUOTE_STATUS) as (keyof typeof QUOTE_STATUS)[];

export default async function QuotesPage() {
  await requireAdmin();
  const quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 300 });

  return (
    <>
      <div className="head"><div><h1>Demandes de devis</h1><p className="muted" style={{ margin: "4px 0 0" }}>Elles arrivent de l&apos;estimateur de la page Services.</p></div></div>
      <div className="kanban">
        {COLS.map((c) => {
          const list = quotes.filter((q) => q.status === c);
          return (
            <section key={c} className="col" aria-label={QUOTE_STATUS[c]}>
              <h2 className="small" style={{ margin: "2px 4px 4px" }}>{QUOTE_STATUS[c]} <span className="muted">{list.length}</span></h2>
              {list.map((q) => (
                <article key={q.id} className="q">
                  <strong>{q.company || q.name}</strong>
                  <span className="small muted">{CATEGORY[q.category] ?? q.category} · {fmtDate(q.createdAt)}</span>
                  {q.estimateLo != null && <span className="small num">{formatXof(q.estimateLo)} à {formatXof(q.estimateHi)}</span>}
                  <a className="small" href={`mailto:${q.email}`}>{q.email}</a>
                  {q.phone && <span className="small">{q.phone}</span>}
                  {q.message && <p className="small" style={{ margin: 0, color: "var(--fg2)" }}>{q.message}</p>}
                  <form action={setQuoteStatus} style={{ display: "flex", gap: 6 }}>
                    <input type="hidden" name="quoteId" value={q.id} />
                    <select name="status" className="i" defaultValue={q.status} style={{ height: 28, fontSize: 12, flex: 1 }} aria-label="Étape">
                      {COLS.map((s) => <option key={s} value={s}>{QUOTE_STATUS[s]}</option>)}
                    </select>
                    <button className="btn sm">OK</button>
                  </form>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </>
  );
}
