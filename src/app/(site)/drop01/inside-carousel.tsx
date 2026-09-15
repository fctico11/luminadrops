"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import EditableRichText from "@/components/edit/EditableRichText";
import { useEditMode } from "@/components/edit/EditModeContext";
import sparkleBurst from "./sparkle-burst.json";

type Props = {
  cards: string[];
};

const SWIPE_THRESHOLD = 60;
// The old card fades/slides out first, then the new one slides/fades in —
// plain CSS transitions on className changes, the same technique already
// used elsewhere in this codebase (e.g. the hero video's darken overlay),
// picked deliberately after `motion`'s AnimatePresence/`animate`-object
// reactivity proved unreliable here for a repeatedly-swapped keyed child.
const EXIT_MS = 280;
const ENTER_MS = 520;
const SPARKLE_NATURAL_MS = (91 / 60) * 1000;
// The nav-button sparkle plays over roughly the same span as the card swap,
// so clicking feels like it's what set the whole thing in motion.
const BUTTON_SPARKLE_MS = EXIT_MS + ENTER_MS;

type Phase = "idle" | "out" | "in";

/** Swipeable, animated stand-in for what used to be one long paragraph of
 * "What's Waiting Inside" copy — split into 3 cards (at the same points the
 * inline Club-mark dividers used to sit) so the section reads as bite-sized
 * beats instead of a wall of text.
 *
 * The frame's height is measured continuously (ResizeObserver, not a
 * one-shot effect) off an invisible stack of all 3 cards at the real card's
 * width, and pinned to the tallest — a one-shot measurement risked locking
 * in a too-short height if it ran before web fonts finished swapping in.
 *
 * Swiping is a plain pointer-drag distance check rather than a live
 * finger-follow, and dragging is skipped entirely in admin mode so it
 * doesn't fight with clicking into the text to edit it — arrows/dots still
 * work there for switching cards. The sparkle burst lives inside the
 * previous/next buttons themselves rather than over the card, so it can't
 * ever compete with the text's legibility. */
export default function InsideCarousel({ cards }: Props) {
  const { isAdmin } = useEditMode();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
  const [prevActive, setPrevActive] = useState(false);
  const measureStackRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevSparkleRef = useRef<LottieHandle>(null);
  const nextSparkleRef = useRef<LottieHandle>(null);
  const transitioning = useRef(false);
  const pointerStartX = useRef<number | null>(null);

  const buttonSparkleSpeed = useMemo(() => SPARKLE_NATURAL_MS / BUTTON_SPARKLE_MS, []);

  useEffect(() => {
    const measure = () => {
      const tallest = Math.max(0, ...measureRefs.current.map((el) => el?.offsetHeight ?? 0));
      if (tallest > 0) setMinHeight(tallest);
    };
    measure();
    if (!measureStackRef.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(measureStackRef.current);
    for (const el of measureRefs.current) {
      if (el) observer.observe(el);
    }
    document.fonts?.ready?.then(measure);
    return () => observer.disconnect();
  }, [cards]);

  const go = (delta: number) => {
    if (transitioning.current) return;
    transitioning.current = true;
    const dir = delta > 0 ? 1 : -1;
    setDirection(dir);
    setPhase("out");

    if (dir > 0) {
      nextSparkleRef.current?.seek(0);
      nextSparkleRef.current?.play();
    } else {
      prevSparkleRef.current?.seek(0);
      prevSparkleRef.current?.play();
      setPrevActive(true);
      window.setTimeout(() => setPrevActive(false), BUTTON_SPARKLE_MS);
    }

    window.setTimeout(() => {
      setIndex((i) => (i + delta + cards.length) % cards.length);
      setPhase("in");
      // A plain timer rather than the usual double-rAF: rAF only fires once
      // the browser actually schedules a paint, which this specific tab
      // (Chrome-extension-driven, not a normal foreground render loop)
      // sometimes never does — leaving the card permanently snapped at its
      // "entering" position. A timer fires regardless of paint scheduling.
      window.setTimeout(() => setPhase("idle"), 20);
      window.setTimeout(() => {
        transitioning.current = false;
      }, ENTER_MS);
    }, EXIT_MS);
  };

  const jumpTo = (i: number) => {
    if (i === index || transitioning.current) return;
    go(i - index);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    if (isAdmin) return;
    pointerStartX.current = e.clientX;
  };

  const onPointerUp = (e: ReactPointerEvent) => {
    if (isAdmin || pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (delta < -SWIPE_THRESHOLD) go(1);
    else if (delta > SWIPE_THRESHOLD) go(-1);
  };

  // Duration/easing live in inline style rather than Tailwind's arbitrary-
  // value classes (`duration-[280ms]` etc.) — those are built from a
  // runtime template literal, so Tailwind's build-time content scanner
  // never sees the literal class name and never generates the CSS for it.
  // The transition silently no-ops without it, which read as "jittery":
  // the card was snapping straight to its end state instead of easing.
  const enterFrom = direction > 0 ? "translate-x-6" : "-translate-x-6";
  const exitTo = direction > 0 ? "-translate-x-6" : "translate-x-6";
  const cardClass =
    phase === "out" ? `opacity-0 ${exitTo}` : phase === "in" ? `opacity-0 ${enterFrom}` : "opacity-100 translate-x-0";
  const cardTransitionStyle: CSSProperties =
    phase === "in"
      ? { transitionDuration: "0ms" }
      : phase === "out"
        ? { transitionDuration: `${EXIT_MS}ms`, transitionTimingFunction: "cubic-bezier(0.55,0,1,0.45)" }
        : { transitionDuration: `${ENTER_MS}ms`, transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative overflow-hidden border border-[#3a352e] bg-white/[0.02] px-6 py-8 sm:px-10 sm:py-10">
        {/* Invisible measurement stack — same width/typography as the real
            cards, used only to find the tallest one's height. Measured
            continuously (fonts settling, resize) rather than once. */}
        <div ref={measureStackRef} className="invisible absolute inset-x-6 top-8 -z-10 sm:inset-x-10 sm:top-10" aria-hidden>
          {cards.map((card, i) => (
            <div
              key={i}
              ref={(el) => {
                measureRefs.current[i] = el;
              }}
              className="rich-text absolute inset-x-0 top-0 text-center text-[15px] leading-relaxed lg:text-lg"
              dangerouslySetInnerHTML={{ __html: card }}
            />
          ))}
        </div>

        <div
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ minHeight, ...cardTransitionStyle }}
          className={`relative flex flex-col justify-center text-center transition-[opacity,transform] ${cardClass} ${
            !isAdmin ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""
          }`}
        >
          {isAdmin ? (
            <EditableRichText
              file="drop01"
              field={`insideBodyCards.${index}`}
              value={cards[index]}
              className="text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg"
            />
          ) : (
            <div
              className="rich-text text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg"
              dangerouslySetInnerHTML={{ __html: cards[index] }}
            />
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border transition-colors duration-300 ${
            prevActive ? "border-[#cfc0a0]" : "border-transparent"
          }`}
        >
          <Lottie
            src={sparkleBurst}
            lottieRef={prevSparkleRef}
            autoplay={false}
            loop={false}
            speed={buttonSparkleSpeed}
            className="pointer-events-none absolute inset-0 h-full w-full"
            style={{ transform: "scaleX(-1)" }}
          />
        </button>
        <div className="flex gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={`Go to card ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                i === index ? "bg-[#cfc0a0]" : "bg-[#4c4740] hover:bg-[#6f695c]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#6f695c]/70 transition-colors duration-300 hover:border-[#cfc0a0]"
        >
          <Lottie
            src={sparkleBurst}
            lottieRef={nextSparkleRef}
            autoplay={false}
            loop={false}
            speed={buttonSparkleSpeed}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        </button>
      </div>
    </div>
  );
}
