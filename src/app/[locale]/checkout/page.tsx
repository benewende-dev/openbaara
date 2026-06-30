"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "@/features/store/CartContext";
import { formatXOF } from "@/lib/utils";
import { ShoppingBag, Smartphone, Lock, ArrowLeft, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const { state, totalXOF } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isEmpty = state.items.length === 0;

  const errorFor = (code: string) => {
    if (code === "not_configured") return t("errNotConfigured");
    if (code === "invalid" || code === "empty" || code === "invalid_item") return t("errInvalid");
    return t("errFailed");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/payments/cinetpay/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items.map((i) => ({ id: i.id, quantity: i.quantity })),
          customer: { name, email, phone },
          locale,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // redirection vers la page CinetPay
        return;
      }
      setStatus("error");
      setErrorMsg(errorFor(data.error || "failed"));
    } catch {
      setStatus("error");
      setErrorMsg(t("errFailed"));
    }
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

        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">
          {t("title")}
        </h1>
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
            {/* Order summary */}
            <aside className="lg:col-span-2 order-1 lg:order-2">
              <div className="rounded-2xl border border-border dark:border-border-dark bg-surface dark:bg-[#111111] p-6">
                <h2 className="font-bold mb-4">{t("summaryTitle")}</h2>
                <ul className="space-y-3 mb-4">
                  {state.items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-muted dark:text-muted-dark">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="font-medium whitespace-nowrap">
                        {formatXOF(item.priceXOF * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-border dark:border-border-dark pt-4 font-bold">
                  <span>{t("total")}</span>
                  <span className="text-primary">{formatXOF(totalXOF)}</span>
                </div>
              </div>
            </aside>

            {/* Customer form */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {status === "error" && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="font-bold mb-3">{t("contactTitle")}</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={t("namePh")}
                      aria-label={t("name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      id="checkout-name"
                    />
                    <input
                      type="email"
                      placeholder={t("emailPh")}
                      aria-label={t("email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      id="checkout-email"
                    />
                    <input
                      type="tel"
                      placeholder={t("phonePh")}
                      aria-label={t("phone")}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={status === "loading"}
                      className="w-full px-4 py-3 rounded-xl border border-border dark:border-border-dark bg-white dark:bg-[#0A0A0A] text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      id="checkout-phone"
                    />
                  </div>
                </div>

                {/* Payment method */}
                <div className="rounded-xl border border-border dark:border-border-dark p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t("mobileMoney")}</p>
                    <p className="text-xs text-muted dark:text-muted-dark">{t("mobileMoneyNote")}</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || !name || !email || !phone}
                  className="w-full py-3.5 bg-primary text-black rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  id="checkout-pay"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("pay", { amount: formatXOF(totalXOF) })
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
