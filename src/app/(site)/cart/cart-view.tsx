"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/products";
import type { CartContent } from "@/lib/content";
import Motes from "../../motes";
import { cormorant, rise } from "../../ui";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  inventory: number;
  status: string;
};

type Props = {
  content: CartContent;
  product: Product | null;
  productImage: string;
  productImageAlt: string;
};

export default function CartView({ content, product, productImage, productImageAlt }: Props) {
  const router = useRouter();
  const { item, setItem, clear } = useCart();
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);

  const inCart = Boolean(item && product && item.productId === product.id && item.quantity > 0);
  const maxQuantity = Math.min(2, product?.inventory ?? 0);

  if (!inCart || !product) {
    return (
      <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center lg:py-28">
        <Motes />
        <div className="relative w-full max-w-xl">
          <EditableText
            file="cart"
            field="title"
            value={content.title}
            as="h1"
            className={`${cormorant.className} teaser-rise text-xl font-medium tracking-[0.3em] lg:text-3xl`}
            style={rise(0.1)}
          />

          <div
            className="teaser-rise mx-auto mt-10 flex max-w-xs items-center gap-5 lg:mt-14 lg:max-w-md"
            style={rise(0.3)}
            aria-hidden
          >
            <span className="h-px flex-1 bg-[#4c4740]" />
            <span className="teaser-twinkle text-[11px] text-[#cfc6b1] lg:text-sm">✦</span>
            <span className="h-px flex-1 bg-[#4c4740]" />
          </div>

          <EditableText
            file="cart"
            field="emptyLead"
            value={content.emptyLead}
            as="p"
            className={`${cormorant.className} teaser-rise mt-14 text-lg italic text-[#d6cdb8] lg:mt-20 lg:text-2xl`}
            style={rise(0.5)}
          />

          <EditableText
            file="cart"
            field="emptyBody"
            value={content.emptyBody}
            as="p"
            className={`${cormorant.className} teaser-rise mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg`}
            style={rise(0.65)}
          />

          <EditableLink
            href="/"
            className="teaser-rise mt-12 inline-block border border-[#6f695c] px-9 py-3.5 text-[12px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-16 lg:px-12 lg:py-4 lg:text-sm"
            style={rise(0.85)}
          >
            <EditableText file="cart" field="ctaLabel" value={content.ctaLabel} as="span" />
          </EditableLink>
        </div>
      </main>
    );
  }

  const quantity = item!.quantity;
  const soldOut = product.status !== "LIVE" || product.inventory <= 0;

  const flashLimitMessage = () => {
    setShowLimitMessage(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowLimitMessage(false), 3000);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 lg:py-24">
      <Motes />
      <div className="relative w-full max-w-3xl">
        <EditableText
          file="cart"
          field="title"
          value={content.title}
          as="h1"
          className={`${cormorant.className} text-xl font-medium tracking-[0.3em] text-center lg:text-3xl`}
        />

        <div className="mt-12 grid gap-8 border border-[#4c4740] p-6 sm:grid-cols-[160px_1fr] sm:p-8">
          <div className="relative aspect-square w-full overflow-hidden border border-[#3a352e] sm:aspect-auto sm:h-full">
            <Image src={productImage} alt={productImageAlt} fill className="object-cover" />
          </div>

          <div className="flex flex-col text-left">
            <h2 className={`${cormorant.className} text-lg font-medium tracking-[0.15em] text-[#e9e1cd]`}>
              {product.name}
            </h2>
            <p className={`${cormorant.className} mt-1 text-sm text-[#9c9384]`}>
              {formatPrice(product.priceCents, product.currency)} each
            </p>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div>
                <EditableText
                  file="cart"
                  field="quantityLabel"
                  value={content.quantityLabel}
                  as="p"
                  className="text-[10px] tracking-[0.3em] text-[#9c9384]"
                />
                <div className="mt-2 flex w-28 items-stretch justify-between border border-[#4c4740] text-[#e9e1cd]">
                  <button
                    type="button"
                    onClick={() => setItem(product.id, quantity - 1)}
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
                    onClick={() => {
                      if (quantity >= Math.max(1, maxQuantity)) {
                        flashLimitMessage();
                        return;
                      }
                      setItem(product.id, quantity + 1);
                    }}
                    aria-label="Increase quantity"
                    className="flex-1 py-2 text-sm transition-colors duration-300 hover:bg-white/[0.04] hover:text-[#fff6e0]"
                  >
                    +
                  </button>
                </div>
                <p
                  className={`mt-2 text-xs italic text-[#9c9384] transition-opacity duration-300 ${
                    showLimitMessage ? "opacity-100" : "opacity-0"
                  }`}
                  role="status"
                  aria-hidden={!showLimitMessage}
                >
                  {maxQuantity < 2 ? `Only ${maxQuantity} left in stock.` : "Drops limited to 2 per order."}
                </p>
              </div>

              <div className="text-right">
                <EditableText
                  file="cart"
                  field="subtotalLabel"
                  value={content.subtotalLabel}
                  as="p"
                  className="text-[10px] tracking-[0.3em] text-[#9c9384]"
                />
                <p className={`${cormorant.className} mt-2 text-xl text-[#e9e1cd]`}>
                  {formatPrice(product.priceCents * quantity, product.currency)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => clear()}
              className="mt-6 self-start text-xs tracking-[0.2em] text-[#9c9384] underline decoration-[#4c4740] underline-offset-4 transition-colors duration-300 hover:text-[#e9e1cd]"
            >
              <EditableText file="cart" field="removeLabel" value={content.removeLabel} as="span" />
            </button>
          </div>
        </div>

        {soldOut && (
          <p className="mt-6 text-center text-sm text-[#e07a5f]">
            This drop has sold out since you added it to your bag.
          </p>
        )}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={soldOut}
          className="mt-8 w-full border border-[#6f695c] bg-[#e9e1cd] px-8 py-3.5 text-sm font-medium tracking-[0.28em] text-[#141115] transition-all duration-500 hover:bg-[#fff6e0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <EditableText file="cart" field="checkoutLabel" value={content.checkoutLabel} as="span" />
        </button>
      </div>
    </main>
  );
}
