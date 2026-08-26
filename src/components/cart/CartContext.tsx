"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type CartItem = { productId: string; quantity: number };

type CartState = {
  item: CartItem | null;
  setItem: (productId: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "luminadrops-cart";

const CartCtx = createContext<CartState | null>(null);

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/** One drop is purchasable at a time right now, so the cart is a single line item
 * rather than a list — swap this to an array if a future drop ever needs multiple
 * concurrent products in cart. Persisted to localStorage since there's no login
 * system to hang server-side cart state on. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [item, setItemState] = useState<CartItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItemState(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (item) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [item, hydrated]);

  const setItem = (productId: string, quantity: number) => {
    setItemState(quantity > 0 ? { productId, quantity } : null);
  };

  const clear = () => setItemState(null);

  return <CartCtx.Provider value={{ item, setItem, clear }}>{children}</CartCtx.Provider>;
}
