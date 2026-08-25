"use client";

import { useState } from "react";

export default function QuantityStepper() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mx-auto flex w-28 items-stretch justify-between border border-[#4c4740] text-[#e9e1cd]">
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        aria-label="Decrease quantity"
        className="flex-1 py-2 text-sm transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#fff6e0]"
      >
        −
      </button>
      <span className="flex flex-1 items-center justify-center border-x border-[#4c4740] text-sm">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
        aria-label="Increase quantity"
        className="flex-1 py-2 text-sm transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#fff6e0]"
      >
        +
      </button>
    </div>
  );
}
