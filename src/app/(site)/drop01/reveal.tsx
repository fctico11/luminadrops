"use client";

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
  left: { x: -56, y: 0 },
  right: { x: 56, y: 0 },
};

/** Fades content into place the first time it scrolls into the viewport. Unlike the
 * page-load `teaser-rise` animation, this stays truthful on a long page where most
 * sections start below the fold — they'd otherwise finish animating before anyone
 * scrolls down to see them. */
export default function Reveal({ children, as = "div", className, style, delayMs = 0, direction = "up" }: Props) {
  const reduceMotion = useReducedMotion();
  const offset = offsetFor[direction];
  const Tag = tags[as];

  const variants: Variants = {
    hidden: { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.9, delay: delayMs / 1000, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <Tag
      className={className}
      style={style}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}
