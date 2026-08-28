"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "left" | "right";

type Props = {
  children: ReactNode;
  as?: "div" | "section";
  className?: string;
  style?: React.CSSProperties;
  /** Extra delay (ms) after the element enters the viewport before it animates in —
   * used to stagger a group of siblings (e.g. the includes grid) as they come into view. */
  delayMs?: number;
  /** Which way the element travels in from. Defaults to a plain fade-up. */
  direction?: Direction;
};

const tags = { div: motion.div, section: motion.section };

const offsetFor: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  left: { x: -72, y: 0 },
  right: { x: 72, y: 0 },
};

/** Side reveals travel further and get a slower, gentler glide than the plain
 * fade-up, so they read as a flowy drift rather than a snappy slide-in. */
const motionFor: Record<Direction, { duration: number; ease: [number, number, number, number] }> = {
  up: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  left: { duration: 1.6, ease: [0.45, 0, 0.15, 1] },
  right: { duration: 1.6, ease: [0.45, 0, 0.15, 1] },
};

/** Fades content into place the first time it scrolls into the viewport. Unlike the
 * page-load `teaser-rise` animation, this stays truthful on a long page where most
 * sections start below the fold — they'd otherwise finish animating before anyone
 * scrolls down to see them.
 *
 * whileInView-based triggers can occasionally miss firing for content that's
 * already in view before web fonts finish loading and shift the layout — a
 * timeout fallback guarantees content never stays permanently hidden. */
export default function Reveal({ children, as = "div", className, style, delayMs = 0, direction = "up" }: Props) {
  const reduceMotion = useReducedMotion();
  const offset = offsetFor[direction];
  const { duration, ease } = motionFor[direction];
  const Tag = tags[as];
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

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay: delayMs / 1000, ease },
    },
  };

  return (
    <Tag
      className={className}
      style={style}
      initial={reduceMotion ? "visible" : "hidden"}
      animate={forcedVisible ? "visible" : undefined}
      whileInView="visible"
      onViewportEnter={show}
      viewport={{ once: true, amount: 0, margin: "200px 0px 200px 0px" }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}
