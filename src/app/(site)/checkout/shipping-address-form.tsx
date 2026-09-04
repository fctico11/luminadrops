"use client";

import { useState } from "react";
import { cormorant } from "../../ui";
import { formatPrice } from "@/lib/products";

export type DestinationAddress = {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: "US" | "CA";
};

export type ShippingQuote = { amountCents: number; provider: string; serviceLevel: string };

const emptyAddress: DestinationAddress = {
  name: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

type Props = {
  productId: string;
  quantity: number;
  currency: string;
  onConfirm: (address: DestinationAddress, quote: ShippingQuote) => void;
};

export default function ShippingAddressForm({ productId, quantity, currency, onConfirm }: Props) {
  const [address, setAddress] = useState<DestinationAddress>(emptyAddress);
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const field = (key: keyof DestinationAddress) => ({
    value: address[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setQuote(null);
      setAddress((prev) => ({ ...prev, [key]: e.target.value }));
    },
  });

  const inputClass =
    "w-full border border-[#4c4740] bg-transparent px-3 py-2.5 text-sm text-[#e9e1cd] outline-none focus:border-[#cfc0a0]";

  const handleGetRate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const res = await fetch("/api/shipping-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, address }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#4c4740] p-5 text-left">
      <h2 className={`${cormorant.className} text-lg font-medium tracking-[0.1em] text-[#e9e1cd]`}>
        SHIPPING ADDRESS
      </h2>

      <form onSubmit={handleGetRate} className="mt-5 space-y-4">
        <input placeholder="Full name" required className={inputClass} {...field("name")} />
        <input placeholder="Street address" required className={inputClass} {...field("street1")} />
        <input placeholder="Apt, suite, etc. (optional)" className={inputClass} {...field("street2")} />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="City" required className={inputClass} {...field("city")} />
          <input placeholder="State (e.g. NC)" required maxLength={2} className={inputClass} {...field("state")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="ZIP code" required className={inputClass} {...field("zip")} />
          <select className={inputClass} {...field("country")}>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
          </select>
        </div>

        {error && <p className="text-sm text-[#e07a5f]">{error}</p>}

        {quote && (
          <div className="border border-[#4c4740] bg-white/[0.03] px-4 py-3 text-sm text-[#c4bba8]">
            {quote.provider} {quote.serviceLevel} — {formatPrice(quote.amountCents, currency)}
          </div>
        )}

        {quote ? (
          <button
            type="button"
            onClick={() => onConfirm(address, quote)}
            className="w-full border border-[#6f695c] bg-[#e9e1cd] px-8 py-3.5 text-sm font-medium tracking-[0.28em] text-[#141115] transition-all duration-500 hover:bg-[#fff6e0]"
          >
            CONTINUE TO PAYMENT
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-[#6f695c] px-8 py-3.5 text-sm font-medium tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Getting rates..." : "GET SHIPPING RATE"}
          </button>
        )}
      </form>
    </div>
  );
}
