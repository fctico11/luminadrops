"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
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
import ShippingAddressForm, { type DestinationAddress, type ShippingQuote } from "./shipping-address-form";

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
  const [shippingAddress, setShippingAddress] = useState<DestinationAddress | null>(null);
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inCart = Boolean(item && product && item.productId === product.id && item.quantity > 0);
  const quantity = item?.quantity ?? 1;

  useEffect(() => {
    if (!inCart || !product || !shippingAddress) return;
    let cancelled = false;

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity, shippingAddress }),
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
  }, [inCart, product?.id, quantity, shippingAddress]);

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

  if (!shippingAddress || !shippingQuote) {
    return (
      <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 lg:py-24">
        <Motes />
        <div className="relative w-full max-w-md">
          <h1 className={`${cormorant.className} text-center text-xl font-medium tracking-[0.3em] text-[#e9e1cd]`}>
            CHECKOUT
          </h1>
          <div className="mt-10">
            <ShippingAddressForm
              productId={product.id}
              quantity={quantity}
              currency={product.currency}
              onConfirm={(address, quote) => {
                setShippingAddress(address);
                setShippingQuote(quote);
              }}
            />
          </div>
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
                <span>{formatPrice(product.priceCents * quantity, product.currency)}</span>
              </div>
              <div className="flex items-center justify-between text-[#c4bba8]">
                <span>
                  Shipping <span className="text-xs text-[#9c9384]">({shippingQuote.provider} {shippingQuote.serviceLevel})</span>
                </span>
                <span>{formatPrice(shippingQuote.amountCents, product.currency)}</span>
              </div>
              <div
                className={`${cormorant.className} mt-3 flex items-center justify-between border-t border-[#4c4740] pt-3 text-lg font-medium tracking-[0.05em] text-[#e9e1cd]`}
              >
                <span>Total</span>
                <span>{formatPrice(product.priceCents * quantity + shippingQuote.amountCents, product.currency)}</span>
              </div>
            </div>
          </div>

          <CheckoutElementsProvider
            stripe={stripePromise}
            options={{ clientSecret, elementsOptions: { appearance: checkoutAppearance, fonts: checkoutFonts } }}
          >
            <CheckoutForm shippingAddress={shippingAddress} />
          </CheckoutElementsProvider>
        </div>
      </div>
    </main>
  );
}

function CheckoutForm({ shippingAddress }: { shippingAddress: DestinationAddress }) {
  const checkoutState = useCheckoutElements();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (checkoutState.type === "loading") {
    return <p className="text-sm italic text-[#9c9384]">Loading checkout...</p>;
  }

  if (checkoutState.type === "error") {
    return <p className="text-sm text-[#e07a5f]">{checkoutState.error.message}</p>;
  }

  const { checkout } = checkoutState;

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      <div>
        <p className="mb-2 text-[10px] tracking-[0.2em] text-[#9c9384]">CONTACT</p>
        <ContactDetailsElement />
      </div>
      <div>
        <p className="mb-2 text-[10px] tracking-[0.2em] text-[#9c9384]">SHIPPING ADDRESS</p>
        <ShippingAddressElement
          options={{
            contacts: [
              {
                name: shippingAddress.name,
                address: {
                  line1: shippingAddress.street1,
                  line2: shippingAddress.street2 || undefined,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  postal_code: shippingAddress.zip,
                  country: shippingAddress.country,
                },
              },
            ],
          }}
        />
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
  );
}
