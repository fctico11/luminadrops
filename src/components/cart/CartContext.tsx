"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type CartItem = { productId: string; quantity: number };
type AddOnItem = { addOnId: string; quantity: number };

type CartState = {
  item: CartItem | null;
  setItem: (productId: string, quantity: number) => void;
  addOn: AddOnItem | null;
  setAddOn: (addOnId: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "luminadrops-cart";
const ADDON_STORAGE_KEY = "luminadrops-cart-addon";

const CartCtx = createContext<CartState | null>(null);

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/** One drop is purchasable at a time right now, so the main item is a single line
 * rather than a list — swap this to an array if a future drop ever needs multiple
 * concurrent products in cart. The optional add-on is tracked separately since it
 * only makes sense alongside the main item, and is cleared whenever it is.
 * Persisted to localStorage since there's no login system to hang server-side
 * cart state on. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [item, setItemState] = useState<CartItem | null>(null);
  const [addOn, setAddOnState] = useState<AddOnItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItemState(JSON.parse(raw));
      const rawAddOn = window.localStorage.getItem(ADDON_STORAGE_KEY);
      if (rawAddOn) setAddOnState(JSON.parse(rawAddOn));
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

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (addOn) {
        window.localStorage.setItem(ADDON_STORAGE_KEY, JSON.stringify(addOn));
      } else {
        window.localStorage.removeItem(ADDON_STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [addOn, hydrated]);

  const setItem = (productId: string, quantity: number) => {
    if (quantity > 0) {
      setItemState({ productId, quantity });
    } else {
      setItemState(null);
      setAddOnState(null);
    }
  };

  const setAddOn = (addOnId: string, quantity: number) => {
    setAddOnState(quantity > 0 ? { addOnId, quantity } : null);
  };

  const clear = () => {
    setItemState(null);
    setAddOnState(null);
  };

  return <CartCtx.Provider value={{ item, setItem, addOn, setAddOn, clear }}>{children}</CartCtx.Provider>;
}
