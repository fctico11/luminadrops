"use client";

import { useRef, useState } from "react";

const MAX_QUANTITY = 2;

export default function QuantityStepper() {
  const [quantity, setQuantity] = useState(1);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);

  const flashLimitMessage = () => {
    setShowLimitMessage(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowLimitMessage(false), 3000);
  };

  return (
    <div>
      <div className="mx-auto flex w-32 items-stretch justify-between border border-[#4c4740] text-[#e9e1cd]">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="flex-1 py-2 text-base transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#fff6e0]"
        >
          −
        </button>
        <span className="flex flex-1 items-center justify-center border-x border-[#4c4740] text-base">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() =>
            setQuantity((q) => {
              if (q >= MAX_QUANTITY) {
                flashLimitMessage();
                return q;
              }
              return q + 1;
            })
          }
          aria-label="Increase quantity"
          className="flex-1 py-2 text-base transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#fff6e0]"
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
        Drops limited to 2 per order.
      </p>
    </div>
  );
}
