"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/products";
import EditableText from "@/components/edit/EditableText";
import { useEditMode } from "@/components/edit/EditModeContext";
import { useCart } from "@/components/cart/CartContext";

type Props = {
  productId: string;
  priceCents: number;
  currency: string;
  ctaLabel: string;
  maxQuantity: number;
  soldOut: boolean;
};

export default function PurchaseControls({
  productId,
  priceCents,
  currency,
  ctaLabel,
  maxQuantity,
  soldOut,
}: Props) {
  const router = useRouter();
  const { isAdmin } = useEditMode();
  const { setItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);

  const handleJoin = () => {
    if (isAdmin || soldOut) return;
    setItem(productId, quantity);
    router.push("/cart");
  };

  const flashLimitMessage = () => {
    setShowLimitMessage(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowLimitMessage(false), 3000);
  };

  const limitMessage =
    maxQuantity < 2 ? `Only ${maxQuantity} left in stock.` : "Drops limited to 2 per order.";

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-32 items-stretch justify-between border border-[#4c4740] text-[#e9e1cd]">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          disabled={soldOut}
          aria-label="Decrease quantity"
          className="flex-1 py-2 text-base transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#fff6e0] disabled:pointer-events-none disabled:opacity-40"
        >
          −
        </button>
        <span className="flex flex-1 items-center justify-center border-x border-[#4c4740] text-base">
          {soldOut ? 0 : quantity}
        </span>
        <button
          type="button"
          disabled={soldOut}
          onClick={() =>
            setQuantity((q) => {
              if (q >= Math.max(1, maxQuantity)) {
                flashLimitMessage();
                return q;
              }
              return q + 1;
            })
          }
          aria-label="Increase quantity"
          className="flex-1 py-2 text-base transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#fff6e0] disabled:pointer-events-none disabled:opacity-40"
        >
          +
        </button>
      </div>
      <p
        className={`mt-3 text-sm italic text-[#9c9384] transition-opacity duration-300 ${
          showLimitMessage ? "opacity-100" : "opacity-0"
        }`}
        role="status"
        aria-hidden={!showLimitMessage}
      >
        {limitMessage}
      </p>

      <button
        type="button"
        onClick={handleJoin}
        disabled={soldOut}
        className="mt-2 w-full max-w-[320px] border border-[#6f695c] bg-[#e9e1cd] px-8 py-3.5 text-sm font-medium tracking-[0.28em] text-[#141115] transition-all duration-500 hover:bg-[#fff6e0] disabled:cursor-not-allowed disabled:border-[#4c4740] disabled:bg-[#4c4740] disabled:text-[#9c9384] disabled:hover:bg-[#4c4740]"
      >
        {soldOut ? (
          "SOLD OUT"
        ) : (
          <>
            <EditableText file="drop01" field="ctaLabel" value={ctaLabel} as="span" className="whitespace-nowrap" />
            <span className="mx-2">•</span>
            {formatPrice(priceCents * quantity, currency)}
          </>
        )}
      </button>
    </div>
  );
}
