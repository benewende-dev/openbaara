"use client";

import { useCart, type CartItem as CartItemType } from "@/features/store/CartContext";
import { useTranslations } from "next-intl";
import { formatXOF, formatUSD } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const t = useTranslations("cart");
  const { state, removeItem, updateQuantity, toggleCart, totalXOF, totalUSD } =
    useCart();

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/50 z-50"
            onClick={toggleCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-[#141414] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-border-dark">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {t("title")}
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted dark:text-muted-dark">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-30" />
                  <p>{t("empty")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onQuantityChange={(qty) =>
                        updateQuantity(item.id, qty)
                      }
                      removeLabel={t("remove")}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-border dark:border-border-dark px-6 py-4 space-y-4">
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>{t("total")}</span>
                  <div className="text-right">
                    <p>{formatXOF(totalXOF)}</p>
                    <p className="text-sm text-muted dark:text-muted-dark font-normal">
                      {formatUSD(totalUSD)}
                    </p>
                  </div>
                </div>
                <Link
                  href="/boutique"
                  onClick={toggleCart}
                  className="block w-full py-3 bg-primary text-white text-center rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                  id="cart-checkout"
                >
                  {t("checkout")}
                </Link>
                <button
                  onClick={toggleCart}
                  className="block w-full py-2.5 text-center text-sm text-muted dark:text-muted-dark hover:text-primary transition-colors"
                >
                  {t("continueShopping")}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItemRow({
  item,
  onRemove,
  onQuantityChange,
  removeLabel,
}: {
  item: CartItemType;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
  removeLabel: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-start gap-4 p-3 rounded-xl bg-surface dark:bg-[#1A1A1A]"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-sm text-primary font-semibold mt-1">
          {formatXOF(item.priceXOF)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(item.quantity - 1)}
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-medium w-6 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onQuantityChange(item.quantity + 1)}
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRemove}
          className="p-1 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label={removeLabel}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
