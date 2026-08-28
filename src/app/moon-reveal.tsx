"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

/** Reveals a tile like moonlight breaking over it: a circular wipe rises from the
 * base of the frame while the image settles from a blown-out, blurred glow into
 * full clarity and color, with a soft flare underneath it — instead of the plain
 * fade-up used everywhere else on the site. Triggers once, the first time the
 * tile scrolls into view.
 *
 * whileInView-based triggers can occasionally miss firing for content that's
 * already in view before web fonts finish loading and shift the layout — since
 * the hidden state is fully clipped to invisible, a missed trigger would mean a
 * permanently blank tile. A timeout fallback guarantees it always reveals. */
export default function MoonReveal({ children, className, delayMs = 0 }: Props) {
  const reduceMotion = useReducedMotion();
  const delay = delayMs / 1000;
  const [forcedVisible, setForcedVisible] = useState(false);
  const shownRef = useRef(false);

  const show = () => {
    if (shownRef.current) return;
    shownRef.current = true;
    setForcedVisible(true);
  };

  useEffect(() => {
    if (reduceMotion) {
      show();
      return;
    }
    const timer = window.setTimeout(show, 2500);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const tileVariants: Variants = {
    hidden: {
      clipPath: "circle(0% at 50% 100%)",
      filter: "brightness(1.5) saturate(0.4) blur(4px)",
    },
    visible: {
      clipPath: "circle(140% at 50% 100%)",
      filter: "brightness(1) saturate(1) blur(0px)",
      transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const glowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 0.4, 0],
      transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? "visible" : "hidden"}
      animate={forcedVisible ? "visible" : undefined}
      whileInView="visible"
      onViewportEnter={show}
      viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
      variants={tileVariants}
    >
      {children}
      <motion.span
        variants={glowVariants}
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 100%, rgba(240,214,150,0.55), transparent 60%)",
        }}
        aria-hidden
      />
    </motion.div>
  );
}
