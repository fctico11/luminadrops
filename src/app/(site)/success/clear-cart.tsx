"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartContext";

/** The purchase this cart represented is done — drop the local cart state so the
 * bag icon and /cart don't keep showing an order that's already been placed. */
export default function ClearCart() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
