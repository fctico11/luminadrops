"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeAddressElementChangeEvent } from "@stripe/stripe-js";
import {
  CheckoutElementsProvider,
  useCheckoutElements,
  ContactDetailsElement,
  ShippingAddressElement,
  PaymentElement,
} from "@stripe/react-stripe-js/checkout";
import Image from "next/image";
import EditableLink from "@/components/edit/EditableLink";
import Motes from "../../motes";
import { cormorant } from "../../ui";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/products";
import { checkoutAppearance, checkoutFonts } from "@/lib/stripe-appearance";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Product = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  inventory: number;
  status: string;
} | null;

type Props = {
  product: Product;
  productImage: string;
  productImageAlt: string;
};

export default function CheckoutView({ product, productImage, productImageAlt }: Props) {
  const { item } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inCart = Boolean(item && product && item.productId === product.id && item.quantity > 0);
  const quantity = item?.quantity ?? 1;

  useEffect(() => {
    if (!inCart || !product) return;
    let cancelled = false;

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.clientSecret) {
          throw new Error(data.error ?? "Something went wrong. Please try again.");
        }
        if (!cancelled) setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong.");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inCart, product?.id, quantity]);

  if (!inCart || !product) {
    return (
      <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <Motes />
        <div className="relative">
          <p className={`${cormorant.className} text-lg italic text-[#d6cdb8]`}>Your bag is empty.</p>
          <EditableLink
            href="/drop01"
            className="mt-8 inline-block border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0]"
          >
            Back to the drop
          </EditableLink>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm text-[#e07a5f]">{error}</p>
      </main>
    );
  }

  if (!clientSecret) {
    return (
      <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm italic text-[#9c9384]">Preparing your checkout...</p>
      </main>
    );
  }

  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 lg:py-24">
      <Motes />
      <div className="relative w-full max-w-4xl">
        <h1 className={`${cormorant.className} text-center text-xl font-medium tracking-[0.3em] text-[#e9e1cd]`}>
          CHECKOUT
        </h1>

        <CheckoutElementsProvider
          stripe={stripePromise}
          options={{ clientSecret, elementsOptions: { appearance: checkoutAppearance, fonts: checkoutFonts } }}
        >
          <CheckoutContent product={product} productImage={productImage} productImageAlt={productImageAlt} quantity={quantity} />
        </CheckoutElementsProvider>
      </div>
    </main>
  );
}

function CheckoutContent({
  product,
  productImage,
  productImageAlt,
  quantity,
}: {
  product: NonNullable<Product>;
  productImage: string;
  productImageAlt: string;
  quantity: number;
}) {
  const checkoutState = useCheckoutElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (checkoutState.type === "loading") {
    return <p className="mt-10 text-sm italic text-[#9c9384]">Loading checkout...</p>;
  }

  if (checkoutState.type === "error") {
    return <p className="mt-10 text-sm text-[#e07a5f]">{checkoutState.error.message}</p>;
  }

  const { checkout } = checkoutState;

  // Stripe's ShippingAddressElement has address autocomplete built in, so as
  // soon as the customer picks or finishes typing a complete address we
  // re-quote a live carrier rate from Shippo and push it into the session —
  // debounced so we're not hitting Shippo on every keystroke.
  const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!event.complete) return;

    const { name, address } = event.value;
    debounceRef.current = setTimeout(() => {
      checkout.runServerUpdate(async () => {
        const res = await fetch("/api/checkout/update-shipping", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: checkout.id,
            address: {
              name,
              street1: address.line1,
              street2: address.line2 || undefined,
              city: address.city,
              state: address.state,
              zip: address.postal_code,
              country: address.country,
            },
          }),
        });
        if (!res.ok) throw new Error("Failed to update shipping rate.");
      });
    }, 700);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const result = await checkout.confirm();
    if (result.type === "error") {
      setMessage(result.error.message);
      setSubmitting(false);
    }
    // otherwise the browser is redirected to return_url
  };

  const shippingName = checkout.shipping?.shippingOption.displayName ?? "Standard Shipping";

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div className="border border-[#4c4740] p-5 text-left">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-[#3a352e]">
            <Image src={productImage} alt={productImageAlt} fill className="object-cover" />
          </div>
          <div>
            <p className={`${cormorant.className} text-base font-medium tracking-[0.1em] text-[#e9e1cd]`}>
              {product.name}
            </p>
            <p className="mt-1 text-sm text-[#9c9384]">Qty {quantity}</p>
          </div>
        </div>

        <div className="mt-5 space-y-2 border-t border-[#4c4740] pt-4 text-sm">
          <div className="flex items-center justify-between text-[#c4bba8]">
            <span>Subtotal</span>
            <span>{formatPrice(checkout.total.subtotal.minorUnitsAmount, product.currency)}</span>
          </div>
          <div className="flex items-center justify-between text-[#c4bba8]">
            <span>
              Shipping <span className="text-xs text-[#9c9384]">({shippingName})</span>
            </span>
            <span>{formatPrice(checkout.total.shippingRate.minorUnitsAmount, product.currency)}</span>
          </div>
          <div
            className={`${cormorant.className} mt-3 flex items-center justify-between border-t border-[#4c4740] pt-3 text-lg font-medium tracking-[0.05em] text-[#e9e1cd]`}
          >
            <span>Total</span>
            <span>{formatPrice(checkout.total.total.minorUnitsAmount, product.currency)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div>
          <p className="mb-2 text-[10px] tracking-[0.2em] text-[#9c9384]">CONTACT</p>
          <ContactDetailsElement />
        </div>
        <div>
          <p className="mb-2 text-[10px] tracking-[0.2em] text-[#9c9384]">SHIPPING ADDRESS</p>
          <ShippingAddressElement onChange={handleAddressChange} />
        </div>
        <div>
          <p className="mb-2 text-[10px] tracking-[0.2em] text-[#9c9384]">PAYMENT</p>
          <PaymentElement />
        </div>

        {message && <p className="text-sm text-[#e07a5f]">{message}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-[#6f695c] bg-[#e9e1cd] px-8 py-3.5 text-sm font-medium tracking-[0.28em] text-[#141115] transition-all duration-500 hover:bg-[#fff6e0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Processing..." : "PAY NOW"}
        </button>
      </form>
    </div>
  );
}
