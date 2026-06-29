"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useCart } from "@/features/store/CartContext";
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";

type View = "checking" | "accepted" | "pending" | "refused";

function ReturnInner() {
  const t = useTranslations("checkout.return");
  const { clearCart } = useCart();
  const params = useSearchParams();
  const id = params.get("id");
  const [view, setView] = useState<View>("checking");

  useEffect(() => {
    let active = true;
    if (!id) {
      setView("refused");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/payments/cinetpay/status?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!active) return;
        if (data.status === "accepted") {
          setView("accepted");
          clearCart();
        } else if (data.status === "pending") {
          setView("pending");
        } else {
          setView("refused");
        }
      } catch {
        if (active) setView("refused");
      }
    })();
    return () => {
      active = false;
    };
  }, [id, clearCart]);

  const config = {
    checking: { Icon: Loader2, spin: true, tone: "text-muted dark:text-muted-dark", title: t("checking"), body: "" },
    accepted: { Icon: CheckCircle2, spin: false, tone: "text-primary", title: t("successTitle"), body: t("successBody") },
    pending: { Icon: Clock, spin: false, tone: "text-amber-500", title: t("pendingTitle"), body: t("pendingBody") },
    refused: { Icon: XCircle, spin: false, tone: "text-red-500", title: t("failedTitle"), body: t("failedBody") },
  }[view];

  const { Icon } = config;

  return (
    <div className="section-padding">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className={`mx-auto w-16 h-16 rounded-2xl bg-surface dark:bg-[#111111] border border-border dark:border-border-dark flex items-center justify-center mb-6 ${config.tone}`}>
          <Icon className={`w-8 h-8 ${config.spin ? "animate-spin" : ""}`} />
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
          {config.title}
        </h1>
        {config.body && (
          <p className="text-muted dark:text-muted-dark leading-relaxed mb-8">{config.body}</p>
        )}

        {view !== "checking" && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {view === "refused" && (
              <Link
                href="/checkout"
                className="px-6 py-3 bg-primary text-black rounded-xl font-semibold hover:bg-primary-dark transition-colors"
              >
                {t("retry")}
              </Link>
            )}
            <Link
              href="/boutique"
              className="px-6 py-3 border border-border dark:border-border-dark rounded-xl font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {t("viewStore")}
            </Link>
            <Link
              href="/"
              className="px-6 py-3 text-sm text-muted dark:text-muted-dark hover:text-primary transition-colors"
            >
              {t("backHome")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <Suspense fallback={<div className="section-padding text-center text-muted dark:text-muted-dark" />}>
      <ReturnInner />
    </Suspense>
  );
}
