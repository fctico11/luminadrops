"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Drop01Content } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";
import Reveal from "./reveal";
import { trackOnce } from "@/lib/tracking";

type Props = { content: Drop01Content };

/** How much each step's photo overlaps the next one, as a share of its width.
 * The photos fade out over exactly this much of their edge (see `maskFor`), so
 * where two meet they cross-fade into each other and the row reads as one
 * continuous picture instead of separate frames. */
const OVERLAP = 0.2;

function maskFor(index: number, last: number) {
  const fade = `${OVERLAP * 100}%`;
  const left = index === 0 ? "#000 0" : `transparent 0, #000 ${fade}`;
  const right = index === last ? "#000 100%" : `#000 ${100 - OVERLAP * 100}%, transparent 100%`;
  const gradient = `linear-gradient(to right, ${left}, ${right})`;
  return { maskImage: gradient, WebkitMaskImage: gradient } as const;
}

function Arrow({ direction, onClick, disabled }: { direction: "prev" | "next"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous steps" : "Next steps"}
      data-track="StepsStripArrowClicked"
      data-track-direction={direction === "prev" ? "back" : "forward"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8a7a52] text-[#cfc6b1] transition-opacity hover:border-[#c9a227] hover:text-[#e9e1cd] disabled:opacity-30"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d={direction === "prev" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
      </svg>
    </button>
  );
}

/** "Here's what you actually do" — one continuous, horizontally scrolling
 * strip of the evening's steps, placed high on the product page. */
export default function DoStrip({ content }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ size: 100, pos: 0 });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const steps = content.doSteps;

  const sync = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const size = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    setThumb({ size, pos: max > 0 ? (el.scrollLeft / max) * (100 - size) : 0 });
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  // Only real scrolling counts (not the steps already in view on load, which
  // SectionViewed covers): report each step the first time it's mostly shown.
  const onScroll = useCallback(() => {
    sync();
    const el = scrollerRef.current;
    if (!el) return;
    const left = el.scrollLeft;
    const right = left + el.clientWidth;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const visible = Math.min(right, c.offsetLeft + c.offsetWidth) - Math.max(left, c.offsetLeft);
      if (i > 0 && visible / c.offsetWidth >= 0.6) {
        trackOnce(`steps-viewed-${i}`, "StepsStripCardViewed", {
          step: i + 1,
          title: c.querySelector("h3")?.textContent,
        });
      }
    });
  }, [sync]);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const step = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;
    el.scrollBy({ left: dir * first.offsetWidth * (1 - OVERLAP) * 1.5, behavior: "smooth" });
  };

  return (
    <Reveal
      as="section"
      id="drop01-steps"
      className="relative w-full border-y border-[#2a2620] bg-gradient-to-b from-[#16131a]/60 via-transparent to-[#16131a]/60 py-10 text-center sm:py-14"
    >
      <EditableText
        file="drop01"
        field="doTitle"
        value={content.doTitle}
        as="h2"
        className={`${cormorant.className} px-6 text-lg font-medium tracking-[0.3em] text-[#e9e1cd] sm:text-2xl`}
      />
      <EditableText
        file="drop01"
        field="doSubtitle"
        value={content.doSubtitle}
        as="p"
        className={`${cormorant.className} mt-2 px-6 text-sm italic text-[#9c9384] sm:text-base`}
      />

      <div
        ref={scrollerRef}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Steps of the evening"
        className="mx-auto mt-8 flex max-w-[1100px] [--w:46vw] sm:[--w:min(68vw,340px)] overflow-x-auto px-6 text-center [scrollbar-width:none] sm:mt-10 [&::-webkit-scrollbar]:hidden"
      >
        {steps.map((s, i) => (
          <article key={i} className={`relative w-[var(--w)] shrink-0 ${i > 0 ? "ml-[calc(var(--w)*-0.2)]" : ""}`}>
            <div className="relative aspect-[4/5] w-full overflow-hidden" style={maskFor(i, steps.length - 1)}>
              <EditableImage file="drop01" field={`doSteps.${i}.image`} src={s.image} alt={s.alt} className="object-cover" />
            </div>
            {/* Neighbouring steps overlap by OVERLAP of their width (for the photo
                blend), so a caption spanning the full inset would touch the
                next one. The side padding here leaves a clear gutter between
                captions: it must stay above (OVERLAP / 2) of the width. */}
            <div className="px-[16%] pt-3 sm:px-[14%] sm:pt-4">
              <span className={`${cormorant.className} block text-sm tracking-[0.25em] text-[#9c9384]`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <EditableText
                file="drop01"
                field={`doSteps.${i}.title`}
                value={s.title}
                as="h3"
                className={`${cormorant.className} mt-1 text-lg italic leading-tight text-[#e9e1cd] sm:text-2xl`}
              />
              <EditableText
                file="drop01"
                field={`doSteps.${i}.description`}
                value={s.description}
                as="p"
                className="mt-2 text-xs leading-relaxed text-[#c4bba8] sm:text-sm"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-6 flex max-w-md items-center gap-4 px-6">
        <Arrow direction="prev" onClick={() => step(-1)} disabled={atStart} />
        <div className="relative h-px flex-1 bg-[#3a352e]" aria-hidden>
          <span
            className="absolute -top-px h-[3px] bg-[#c9a227] transition-[left] duration-150"
            style={{ width: `${thumb.size}%`, left: `${thumb.pos}%` }}
          />
        </div>
        <Arrow direction="next" onClick={() => step(1)} disabled={atEnd} />
      </div>
    </Reveal>
  );
}
