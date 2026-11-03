"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "@/features/store/CartContext";
import { formatXOF } from "@/lib/utils";
import { ShoppingBag, Smartphone, Lock, ArrowLeft, Loader2, QrCode, CreditCard } from "lucide-react";

type Method = "pispi" | "mobile_money" | "card";
type Totals = { subtotalXof: number; discountXof: number; totalXof: number };

const METHOD_ICON = { pispi: QrCode, mobile_money: Smartphone, card: CreditCard } as const;

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { state } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Les montants affichés viennent du serveur, jamais du panier local.
  const [totals, setTotals] = useState<Totals | null>(null);
  const [methods, setMethods] = useState<Method[]>([]);
  const [method, setMethod] = useState<Method | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<string | null>(null);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [quoting, setQuoting] = useState(false);

  const isEmpty = state.items.length === 0;
  const items = state.items.map((i) => ({ id: i.id, quantity: i.quantity }));
  const itemsKey = JSON.stringify(items);

  const quote = useCallback(
    async (code: string | null) => {
      setQuoting(true);
      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: JSON.parse(itemsKey), promoCode: code ?? undefined, email: email || undefined, locale }),
        });
        const data = await res.json();
        if (!res.ok) {
          setTotals(null);
          setStatus("error");
          setErrorMsg(t("errPrices"));
          return;
        }
        setTotals(data.totals);
        setMethods(data.methods);
        setMethod((m) => (m && data.methods.includes(m) ? m : data.methods[0] ?? null));
        if (code) {
          if (data.promoCode) {
            setPromo(data.promoCode);
            setPromoMsg({ ok: true, text: t("promoApplied", { code: data.promoCode }) });
          } else {
            setPromo(null);
            setPromoMsg({ ok: false, text: data.promoError });
          }
        }
      } finally {
        setQuoting(false);
      }
    },
    [itemsKey, email, locale, t],
  );

  // Requoter seulement quand le panier change ; le code promo est revalidé à la demande.
  // Les totaux viennent du serveur, d'où l'appel réseau dans l'effet.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isEmpty) quote(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey, isEmpty]);

  const errorFor = (code: string, message?: string) => {
    if (message) return message;
    if (code === "not_configured") return t("errNotConfigured");
    if (code === "invalid") return t("errInvalid");
    if (code === "empty" || code === "invalid_item") return t("errPrices");
    return t("errFailed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !method) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, customer: { name, email, phone }, promoCode: promo ?? undefined, method, locale }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // page sécurisée du prestataire
        return;
      }
      setStatus("error");
      setErrorMsg(errorFor(data.error || "failed", data.message));
    } catch {
      setStatus("error");
      setErrorMsg(t("errFailed"));
    }
  };

  const input =
    "w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";
  const methodLabel: Record<Method, [string, string]> = {
    pispi: [t("methodPispi"), t("methodPispiNote")],
    mobile_money: [t("methodMobileMoney"), t("mobileMoneyNote")],
    card: [t("methodCard"), t("methodCardNote")],
  };

  return (
    <div className="section-padding">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-sm text-muted dark:text-muted-dark hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToStore")}
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">{t("title")}</h1>
        <p className="text-muted dark:text-muted-dark mb-10">{t("subtitle")}</p>

        {isEmpty ? (
          <div className="rounded-2xl border border-border dark:border-border-dark p-10 md:p-14 text-center">
            <ShoppingBag className="w-12 h-12 text-muted/30 dark:text-muted-dark/30 mx-auto mb-4" />
            <h2 className="font-bold text-lg mb-2">{t("emptyTitle")}</h2>
            <p className="text-muted dark:text-muted-dark mb-6">{t("empty")}</p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl font-semibold hover:bg-primary-dark transition-colors"
            >
              {t("backToStore")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Récapitulatif */}
            <aside className="lg:col-span-2 order-1 lg:order-2">
              <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-[#111111] p-6">
                <h2 className="font-bold mb-4">{t("summaryTitle")}</h2>
                <ul className="space-y-3 mb-4">
                  {state.items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-muted dark:text-muted-dark">
                        {item.quantity}× {item.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-border dark:border-border-dark pt-4 mb-4">
                  <label htmlFor="checkout-promo" className="text-sm font-semibold">{t("promo")}</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="checkout-promo"
                      value={promo ?? promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={t("promoPh")}
                      disabled={!!promo || quoting}
                      className={`${input} uppercase`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (promo) {
                          setPromo(null);
                          setPromoInput("");
                          setPromoMsg(null);
                          quote(null);
                        } else if (promoInput.trim()) quote(promoInput.trim());
                      }}
                      disabled={quoting}
                      className="px-4 rounded-xl border border-border dark:border-border-dark text-sm font-semibold hover:border-primary transition-colors disabled:opacity-50"
                    >
                      {promo ? t("remove") : t("apply")}
                    </button>
                  </div>
                  {promoMsg && (
                    <p role={promoMsg.ok ? "status" : "alert"} className={`mt-2 text-xs font-semibold ${promoMsg.ok ? "text-primary" : "text-red-500"}`}>
                      {promoMsg.text}
                    </p>
                  )}
                </div>

                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between"><dt className="text-muted dark:text-muted-dark">{t("subtotal")}</dt><dd>{totals ? formatXOF(totals.subtotalXof) : "…"}</dd></div>
                  {totals && totals.discountXof > 0 && (
                    <div className="flex justify-between text-primary"><dt>{t("discount")}</dt><dd>- {formatXOF(totals.discountXof)}</dd></div>
                  )}
                  <div className="flex items-center justify-between border-t border-border dark:border-border-dark pt-3 font-bold">
                    <dt>{t("total")}</dt>
                    <dd className="text-primary">{quoting ? t("updating") : totals ? formatXOF(totals.totalXof) : "…"}</dd>
                  </div>
                </dl>
              </div>
            </aside>

            {/* Informations et moyen de paiement */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {status === "error" && (
                <div role="alert" className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-bold mb-3">{t("contactTitle")}</h2>
                  <div className="space-y-4">
                    <input id="checkout-name" type="text" placeholder={t("namePh")} aria-label={t("name")} value={name} onChange={(e) => setName(e.target.value)} required disabled={status === "loading"} className={input} autoComplete="name" />
                    <input id="checkout-email" type="email" placeholder={t("emailPh")} aria-label={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={status === "loading"} className={input} autoComplete="email" />
                    <input id="checkout-phone" type="tel" placeholder={t("phonePh")} aria-label={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={status === "loading"} className={input} autoComplete="tel" />
                  </div>
                </div>

                <fieldset>
                  <legend className="font-bold mb-3">{t("method")}</legend>
                  {methods.length === 0 && totals ? (
                    <p className="text-sm text-muted dark:text-muted-dark">{t("errNotConfigured")}</p>
                  ) : (
                    <div className="space-y-2">
                      {methods.map((m) => {
                        const Icon = METHOD_ICON[m];
                        const on = method === m;
                        return (
                          <label
                            key={m}
                            className={`rounded-xl border p-4 flex items-start gap-3 cursor-pointer transition-colors ${on ? "border-primary bg-primary/5" : "border-border dark:border-border-dark"}`}
                          >
                            <input type="radio" name="method" value={m} checked={on} onChange={() => setMethod(m)} className="mt-1 accent-[var(--color-primary)]" />
                            <span className="p-2 rounded-lg bg-primary/10 text-primary shrink-0"><Icon className="w-5 h-5" /></span>
                            <span>
                              <span className="block font-semibold text-sm">{methodLabel[m][0]}</span>
                              <span className="block text-xs text-muted dark:text-muted-dark">{methodLabel[m][1]}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </fieldset>

                <button
                  type="submit"
                  disabled={status === "loading" || quoting || !totals || !method || !name || !email || !phone}
                  className="w-full py-3.5 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  id="checkout-pay"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("pay", { amount: totals ? formatXOF(totals.totalXof) : "" })
                  )}
                </button>

                <p className="flex items-center justify-center gap-1.5 text-xs text-muted dark:text-muted-dark">
                  <Lock className="w-3.5 h-3.5" />
                  {t("secure")}
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
