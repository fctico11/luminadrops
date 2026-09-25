"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/products";
import EditableText from "@/components/edit/EditableText";
import AnimatedStatText from "@/components/edit/AnimatedStatText";
import { useEditMode } from "@/components/edit/EditModeContext";
import { useCart } from "@/components/cart/CartContext";
import { trackTikTokEvent } from "@/lib/tiktok-pixel";
import { cormorant } from "../../ui";

type Props = {
  productId: string;
  productName: string;
  priceCents: number;
  currency: string;
  ctaLabel: string;
  maxQuantity: number;
  soldOut: boolean;
  /** This component renders `display: contents`, so its two blocks — the
   * quantity stepper and the CTA — are direct cells of the parent's grid.
   * These classNames place them (the CTA needs its own row so it always
   * starts below the product photo, however tall that is). */
  stepperClassName?: string;
  /** Rendered above the stepper inside the same grid cell, so the two are
   * placed (e.g. vertically centered against the photo) as one block. */
  stepperHeader?: ReactNode;
  ctaClassName?: string;
  /** Shown centered under the CTA button (e.g. "Secure checkout"). */
  ctaFooter?: ReactNode;
  /** Mobile-only: bolds the CTA label and plays a letter-wave once the
   * button scrolls into view, so it reads as more inviting to tap.
   * Desktop keeps the plain label when this is left off. */
  ctaEmphasis?: boolean;
  /** Product thumbnail for the sticky bar that slides up once the main CTA
   * has scrolled out of view. */
  stickyImage?: { src: string; alt: string };
};

export default function PurchaseControls({
  productId,
  productName,
  priceCents,
  currency,
  ctaLabel,
  maxQuantity,
  soldOut,
  stepperClassName = "",
  stepperHeader,
  ctaClassName = "",
  ctaFooter,
  ctaEmphasis,
  stickyImage,
}: Props) {
  const router = useRouter();
  const { isAdmin } = useEditMode();
  const { setItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pastCta, setPastCta] = useState(false);

  useEffect(() => setMounted(true), []);

  // "Past" means scrolled beyond it, not merely not yet reached — the bar
  // stays hidden on load, while the buy box is still below the fold.
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setPastCta(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const showBar = pastCta && !isAdmin && !soldOut;

  // The bar is fixed to the viewport, so without this it would sit on top of
  // the footer links once the page is scrolled all the way down.
  useEffect(() => {
    if (!showBar || !barRef.current) return;
    document.body.style.paddingBottom = `${barRef.current.offsetHeight}px`;
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [showBar]);

  const handleJoin = () => {
    if (isAdmin || soldOut) return;
    setItem(productId, quantity);
    trackTikTokEvent("AddToCart", {
      contents: [{ content_id: productId, content_type: "product", content_name: productName }],
      value: (priceCents * quantity) / 100,
      currency: currency.toUpperCase(),
    });
    // Straight to checkout instead of the bag — TikTok pixel data showed
    // people adding to cart but dropping off before ever clicking
    // "Proceed to Payment" on the bag page.
    router.push("/checkout");
  };

  const flashLimitMessage = () => {
    setShowLimitMessage(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowLimitMessage(false), 3000);
  };

  const limitMessage =
    maxQuantity < 2 ? `Only ${maxQuantity} left in stock.` : "Drops limited to 2 per order.";

  return (
    <div className="contents">
      <div className={`flex w-full flex-col items-center ${stepperClassName}`}>
        {stepperHeader}
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
      </div>

      <div className={`flex w-full flex-col items-center ${ctaClassName}`}>
        <button
          ref={ctaRef}
          type="button"
          onClick={handleJoin}
          disabled={soldOut}
          className={`mt-2 w-full max-w-[320px] border border-[#6f695c] bg-[#e9e1cd] px-3 py-3 text-[11px] ${ctaEmphasis ? "font-bold" : "font-medium"} tracking-[0.08em] text-[#141115] transition-all duration-500 hover:bg-[#fff6e0] disabled:cursor-not-allowed disabled:border-[#4c4740] disabled:bg-[#4c4740] disabled:text-[#9c9384] disabled:hover:bg-[#4c4740] sm:px-8 sm:py-3.5 sm:text-sm sm:tracking-[0.28em]`}
        >
          {soldOut ? (
            "SOLD OUT"
          ) : (
            <>
              {ctaEmphasis ? (
                <AnimatedStatText
                  file="drop01"
                  field="ctaLabel"
                  value={ctaLabel}
                  className="whitespace-nowrap"
                  charClassName="cta-wave-ch"
                  triggerOnView
                />
              ) : (
                <EditableText file="drop01" field="ctaLabel" value={ctaLabel} as="span" className="whitespace-nowrap" />
              )}
              <span className="mx-1 sm:mx-2">•</span>
              {formatPrice(priceCents * quantity, currency)}
            </>
          )}
        </button>
        {ctaFooter}
      </div>

      {/* Portaled to <body> so an ancestor's transform/opacity (the scroll
          reveal animations) can't turn "fixed" into "fixed to that ancestor". */}
      {mounted &&
        createPortal(
          <div
            ref={barRef}
            inert={!showBar}
            className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#2a2620] bg-[#0a0a0a] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 ease-out motion-reduce:transition-none ${
              showBar ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 sm:gap-4">
              {stickyImage && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-[#4c4740]">
                  <Image src={stickyImage.src} alt={stickyImage.alt} fill sizes="56px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className={`${cormorant.className} text-[15px] font-medium leading-tight text-[#e9e1cd] sm:text-lg`}>
                  {productName}
                </p>
                <p className="mt-1 text-sm font-medium text-[#e9e1cd]">{formatPrice(priceCents * quantity, currency)}</p>
              </div>
              <button
                type="button"
                onClick={handleJoin}
                className="shrink-0 whitespace-nowrap border border-[#6f695c] bg-[#e9e1cd] px-5 py-3.5 text-[11px] font-bold tracking-[0.08em] text-[#141115] transition-colors duration-300 hover:bg-[#fff6e0] sm:px-8 sm:text-sm sm:tracking-[0.2em]"
              >
                {ctaLabel}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
