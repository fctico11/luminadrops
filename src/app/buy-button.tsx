"use client";

import { useState } from "react";

type Props = {
  productId: string;
  accentColor: string;
  backgroundColor: string;
  disabled?: boolean;
  label: string;
};

export default function BuyButton({ productId, accentColor, backgroundColor, disabled, label }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Something went wrong.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        style={{ backgroundColor: accentColor, color: backgroundColor }}
        className="w-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90"
      >
        {loading ? "Redirecting..." : label}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
