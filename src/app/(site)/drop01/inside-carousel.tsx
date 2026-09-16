"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Lottie, type LottieHandle } from "lottie-react";
import EditableRichText from "@/components/edit/EditableRichText";
import { useEditMode } from "@/components/edit/EditModeContext";
import { cormorant } from "../../ui";
import sparkleBurst from "./sparkle-burst.json";

type Props = {
  cards: string[];
};

const SWIPE_THRESHOLD = 60;
const EXIT_MS = 320;
const ENTER_MS = 560;
const SPARKLE_NATURAL_MS = (91 / 60) * 1000;
// The nav-button sparkle plays over roughly the same span as the card swap,
// so clicking feels like it's what set the whole thing in motion.
const BUTTON_SPARKLE_MS = EXIT_MS + ENTER_MS;
const SLIDE_PX = 28;

/** Resolves when the animation finishes, or after its own duration plus a
 * buffer — whichever comes first. `.finished` alone is one bad edge case
 * (an element detached mid-animation, a timeline that never advances) away
 * from leaving the carousel permanently stuck mid-swipe, since everything
 * downstream is gated on this promise settling. */
function waitForAnimation(animation: Animation, durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    animation.finished.then(finish, finish);
    window.setTimeout(finish, durationMs + 150);
  });
}

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
 * The card swap itself runs on the Web Animations API (`element.animate`)
 * instead of toggling Tailwind/CSS classes. Two earlier approaches — an
 * inline `animate`-object on a `motion` component, and Tailwind's
 * arbitrary-value duration classes built from a template literal — each
 * turned out to silently no-op in ways that were hard to detect (the
 * latter because Tailwind's build-time scanner never sees a class name
 * assembled at runtime, so it never generates the CSS for it). WAAPI's
 * `.finished` promise gives an exact, real completion signal instead of a
 * guessed timeout, and the keyframes carry their own start/end values, so
 * there's no separate "snap to start, then transition" step to get wrong.
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
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);
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

  const go = async (delta: number) => {
    if (transitioning.current) return;
    transitioning.current = true;
    const dir = delta > 0 ? 1 : -1;

    if (dir > 0) {
      nextSparkleRef.current?.seek(0);
      nextSparkleRef.current?.play();
    } else {
      prevSparkleRef.current?.seek(0);
      prevSparkleRef.current?.play();
    }

    const el = cardRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (el && !reduceMotion) {
      // Fades and slides away while softening out of focus — a gentle
      // "dissolving" exit rather than a flat cut.
      const exitAnim = el.animate(
        [
          { opacity: 1, transform: "translateX(0) scale(1)", filter: "blur(0px)" },
          {
            opacity: 0,
            transform: `translateX(${dir > 0 ? -SLIDE_PX : SLIDE_PX}px) scale(0.96)`,
            filter: "blur(6px)",
          },
        ],
        { duration: EXIT_MS, easing: "cubic-bezier(0.6,0,1,0.4)", fill: "forwards" }
      );
      await waitForAnimation(exitAnim, EXIT_MS);
    }

    setIndex((i) => (i + delta + cards.length) % cards.length);

    if (el && !reduceMotion) {
      // ...then materializes back into focus from the opposite side —
      // the "magic" beat, since it reads as the new card resolving out of
      // a soft blur rather than just arriving.
      const enterAnim = el.animate(
        [
          {
            opacity: 0,
            transform: `translateX(${dir > 0 ? SLIDE_PX : -SLIDE_PX}px) scale(0.96)`,
            filter: "blur(6px)",
          },
          { opacity: 1, transform: "translateX(0) scale(1)", filter: "blur(0px)" },
        ],
        { duration: ENTER_MS, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "forwards" }
      );
      await waitForAnimation(enterAnim, ENTER_MS);
    }

    transitioning.current = false;
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
          ref={cardRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ minHeight }}
          className={`relative flex flex-col justify-center text-center ${
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

      <p className={`${cormorant.className} mt-3 text-center text-[11px] italic text-[#6f695c]`}>
        ← swipe to explore →
      </p>

      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#6f695c]/70 transition-colors duration-300 hover:border-[#cfc0a0]"
        >
          <Lottie
            src={sparkleBurst}
            lottieRef={prevSparkleRef}
            autoplay={false}
            loop={false}
            speed={buttonSparkleSpeed}
            className="pointer-events-none absolute inset-0 h-full w-full"
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
            style={{ transform: "scaleX(-1)" }}
          />
        </button>
      </div>
    </div>
  );
}
