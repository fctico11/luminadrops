"use client";

import { useCallback, useRef, useState } from "react";
import type { Drop01Content } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import { cormorant } from "../../ui";
import { trackOnce } from "@/lib/tracking";

type Props = { reviews: Drop01Content["reviews"] };

/** The customer quote under the buy box. Each review keeps the exact look
 * the single quote had; with more than one they sit side by side and swipe
 * (or step with the arrows / dots underneath). The box stays as tall as the
 * longest review and shorter ones are centered in it, so swiping never moves
 * the rest of the page. */
export default function ReviewQuotes({ reviews }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next === activeRef.current) return;
    activeRef.current = next;
    setActive(next);
    if (next > 0) trackOnce(`review-quote-${next}`, "ReviewQuoteViewed", { position: next + 1 });
  }, []);

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-sm sm:max-w-md">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((review, i) => (
          <div key={i} className="flex w-full shrink-0 snap-center flex-col justify-center">
            <span aria-hidden className={`${cormorant.className} text-4xl leading-none text-[#cfc0a0]`}>
              “
            </span>
            <EditableText
              file="drop01"
              field={`reviews.${i}.quote`}
              value={review.quote}
              as="p"
              className={`${cormorant.className} -mt-2 text-lg italic leading-relaxed text-[#e9e1cd] sm:text-xl`}
            />
            <EditableText
              file="drop01"
              field={`reviews.${i}.author`}
              value={review.author}
              as="p"
              className="mt-4 text-[11px] tracking-[0.2em] text-[#9c9384]"
              displayValue={`— ${review.author.toUpperCase()}`}
            />
          </div>
        ))}
      </div>

      {reviews.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3" aria-label="Choose a review">
          <Arrow direction="prev" disabled={active === 0} onClick={() => goTo(active - 1)} />
          <div className="flex items-center gap-2" role="tablist">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show review ${i + 1}`}
                onClick={() => goTo(i)}
                data-track="ReviewQuoteDotClicked"
                data-track-position={i + 1}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-[#c9a227]" : "w-1.5 bg-[#4c4740] hover:bg-[#8a7a52]"}`}
              />
            ))}
          </div>
          <Arrow direction="next" disabled={active === reviews.length - 1} onClick={() => goTo(active + 1)} />
        </div>
      )}
    </div>
  );
}

function Arrow({ direction, disabled, onClick }: { direction: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous review" : "Next review"}
      data-track="ReviewQuoteArrowClicked"
      data-track-direction={direction === "prev" ? "back" : "forward"}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8a7a52] text-[#cfc6b1] transition-opacity hover:border-[#c9a227] hover:text-[#e9e1cd] disabled:opacity-30"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d={direction === "prev" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
      </svg>
    </button>
  );
}
