"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Drop01Content } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";

type Props = {
  content: Drop01Content;
  isAdmin: boolean;
};

type Card = {
  imageField: string;
  image: string;
  alt: string;
  titleField: string;
  title: string;
  descField: string;
  description: string;
  noteField?: string;
  note?: string;
};

const cardClass =
  "relative flex w-[78vw] max-w-[300px] shrink-0 cursor-pointer snap-center flex-col border border-[#3a352e] bg-[#0e0c0b] sm:w-[300px]";

const titleClass = "text-[13px] font-medium tracking-[0.2em] text-[#e9e1cd]";
const descClass = "whitespace-pre-line text-[13px] leading-relaxed text-[#c4bba8]";
const noteClass = `${cormorant.className} mt-2 text-[13px] italic text-[#9c9384]`;

function ArrowButton({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={`absolute top-[calc(min(78vw,300px)*0.625-18px)] z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#8a7a52] bg-[#0a0a0a]/85 text-[#cfc6b1] transition-opacity hover:border-[#c9a227] hover:text-[#e9e1cd] disabled:pointer-events-none disabled:opacity-0 sm:top-[167px] sm:h-10 sm:w-10 ${
        direction === "prev" ? "-left-5" : "-right-5"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d={direction === "prev" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
      </svg>
    </button>
  );
}

/** "A Peek Inside" — a horizontally scrollable row of cards: the Club Manual
 * first, then every item in `content.items`. The "See What's Inside" button in
 * the buy box scrolls down to this section. Swipes on touch, snaps each card
 * to the center, and has arrow buttons + dots at every width so it's obvious
 * it scrolls.
 *
 * Visitors see one line of each description; the full text opens on hover
 * with a mouse (any card), or on tap with touch (centered card only, so
 * nothing jumps while swiping past). Admins always see everything, in flow, so it's editable. */
export default function MobileInsideExpandable({ content, isAdmin }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number | null>(null);

  const cards: Card[] = [
    {
      imageField: "manualImage",
      image: content.manualImage,
      alt: content.manualImageAlt,
      titleField: "manualTitle",
      title: content.manualTitle,
      descField: "manualDescription",
      description: content.manualDescription,
    },
    ...content.items.map((item, i) => ({
      imageField: `items.${i}.image`,
      image: item.image,
      alt: item.alt,
      titleField: `items.${i}.title`,
      title: item.title,
      descField: `items.${i}.description`,
      description: item.description,
      noteField: `items.${i}.note`,
      note: item.note,
    })),
  ];
  const cardCount = cards.length;

  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    // Active card = the one whose center is nearest the scroller's center.
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const dist = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
      setTapped(null);
    }
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const scrollToCard = (index: number) => {
    const el = scrollerRef.current;
    const card = el?.children[index] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  const step = (dir: 1 | -1) => scrollToCard(Math.min(cardCount - 1, Math.max(0, active + dir)));

  return (
    <div>
      <EditableText
        file="drop01"
        field="insideMobileTitle"
        value={content.insideMobileTitle}
        as="h2"
        className={`${cormorant.className} text-lg font-medium tracking-[0.3em] sm:text-2xl`}
      />

      <div className="relative mt-8 sm:mt-10">
        <ArrowButton direction="prev" onClick={() => step(-1)} disabled={atStart} />
        <ArrowButton direction="next" onClick={() => step(1)} disabled={atEnd} />

        <div
          ref={scrollerRef}
          onScroll={sync}
          tabIndex={0}
          aria-label="What's inside"
          className="relative -mx-6 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto scroll-smooth px-[11vw] pb-2 text-center [scrollbar-width:none] sm:mx-0 sm:px-[calc(50%-150px)] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((card, i) => {
            // Hover is mouse-only, so any card opens on desktop; touch taps only open the centered one.
            const expanded = hovered === i || (i === active && tapped === i);
            return (
              <div
                key={i}
                className={cardClass}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setHovered((h) => (h === i ? null : h))}
                onClick={() => {
                  if (i !== active) scrollToCard(i);
                  else setTapped((t) => (t === i ? null : i));
                }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <EditableImage
                    file="drop01"
                    field={card.imageField}
                    src={card.image}
                    alt={card.alt}
                    className="object-cover"
                  />
                </div>

                {isAdmin ? (
                  <div className="flex-1 border-t border-[#3a352e] px-4 pb-6 pt-4">
                    <CardNumber n={i + 1} />
                    <EditableText file="drop01" field={card.titleField} value={card.title} as="h3" className={`mt-2 ${titleClass}`} />
                    <EditableText file="drop01" field={card.descField} value={card.description} as="p" className={`mt-3 ${descClass}`} />
                    {card.noteField && (
                      <EditableText file="drop01" field={card.noteField} value={card.note ?? ""} as="p" className={noteClass} />
                    )}
                  </div>
                ) : (
                  // Fixed-height text zone; the panel is anchored to its bottom
                  // edge, so opening the full description grows it upward over
                  // the photo instead of making the card (and page) taller.
                  <div className="relative h-[168px] border-t border-[#3a352e]">
                    <div
                      className={`absolute inset-x-0 bottom-0 z-[5] bg-[#0e0c0b] px-4 pb-6 pt-4 transition-shadow duration-500 ${
                        expanded ? "shadow-[0_-14px_18px_-6px_rgba(0,0,0,0.65)]" : ""
                      }`}
                    >
                      <CardNumber n={i + 1} />
                      <h3 className={`mt-2 ${titleClass}`}>{card.title}</h3>
                      <div className="mt-3">
                        <Collapsible show={!expanded}>
                          <p aria-hidden className="truncate text-[13px] leading-relaxed text-[#c4bba8]">
                            {card.description.replace(/\s*\n\s*/g, " ")}
                          </p>
                        </Collapsible>
                        <Collapsible show={expanded}>
                          <p className={descClass}>{card.description}</p>
                          {card.note && <p className={noteClass}>{card.note}</p>}
                        </Collapsible>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Choose a card">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to card ${i + 1}`}
              onClick={() => scrollToCard(i)}
              className={`h-1.5 rounded-full transition-all ${i === active ? "w-4 bg-[#c9a227]" : "w-1.5 bg-[#4c4740] hover:bg-[#8a7a52]"}`}
            />
          ))}
        </div>
      </div>

      <EditableText
        file="drop01"
        field="includesClosingLine"
        value={content.includesClosingLine}
        as="p"
        className={`${cormorant.className} mt-10 text-sm italic text-[#9c9384] sm:text-base`}
      />
    </div>
  );
}

function CardNumber({ n }: { n: number }) {
  return (
    <span className={`${cormorant.className} block text-sm tracking-[0.25em] text-[#9c9384]`}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** Animates height (0 ↔ natural) and opacity together — the grid-rows trick,
 * since `height: auto` and line-clamp can't be transitioned directly. The
 * one-line preview and the full text swap through two of these at once, so
 * the panel eases open rather than snapping. */
function Collapsible({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        show ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
