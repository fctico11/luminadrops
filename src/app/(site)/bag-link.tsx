"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

export default function BagLink() {
  const { item } = useCart();
  const count = item?.quantity ?? 0;

  return (
    <Link
      href="/cart"
      aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
      className="flex items-center gap-2 transition-colors duration-500 hover:text-[#fff6e0]"
    >
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4 lg:h-[18px] lg:w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <path d="M3.5 6.5h13l-1 10.5h-11z" strokeLinejoin="round" />
        <path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" strokeLinecap="round" />
      </svg>
      <span>({count})</span>
    </Link>
  );
}
