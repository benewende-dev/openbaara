"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

// ─── Types ───
export interface CartItem {
  id: string;
  name: string;
  priceXOF: number;
  priceUSD: number;
  quantity: number;
  isMonthly?: boolean;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR" }
  | { type: "TOGGLE_CART" }
  | { type: "LOAD"; payload: CartItem[] };

// ─── Reducer ───
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: action.payload.quantity }
              : i,
          )
          .filter((i) => i.quantity > 0),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "LOAD":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

// ─── Context ───
const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  totalXOF: number;
  totalUSD: number;
  itemCount: number;
}>({
  state: { items: [], isOpen: false },
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  toggleCart: () => {},
  totalXOF: 0,
  totalUSD: 0,
  itemCount: 0,
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ob-cart");
      if (saved) {
        dispatch({ type: "LOAD", payload: JSON.parse(saved) });
      }
    } catch {}
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("ob-cart", JSON.stringify(state.items));
  }, [state.items]);

  const totalXOF = state.items.reduce(
    (sum, i) => sum + i.priceXOF * i.quantity,
    0,
  );
  const totalUSD = state.items.reduce(
    (sum, i) => sum + i.priceUSD * i.quantity,
    0,
  );
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem: (item) => dispatch({ type: "ADD_ITEM", payload: item }),
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQuantity: (id, quantity) =>
          dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
        clearCart: () => dispatch({ type: "CLEAR" }),
        toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
        totalXOF,
        totalUSD,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
