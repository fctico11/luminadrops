"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: React.CSSProperties;
  /** Extra delay (ms) after the element enters the viewport before it animates in —
   * used to stagger a group of siblings (e.g. the includes grid) as they come into view. */
  delayMs?: number;
};

/** Fades content up into place the first time it scrolls into the viewport. Unlike the
 * page-load `teaser-rise` animation, this stays truthful on a long page where most
 * sections start below the fold — they'd otherwise finish animating before anyone
 * scrolls down to see them. */
export default function Reveal({ children, as: Tag = "div", className, style, delayMs = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = window.setTimeout(() => setVisible(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [delayMs]);

  const Comp = Tag as ElementType;

  return (
    <Comp
      ref={ref}
      style={style}
      className={`${className ?? ""} transition-[opacity,transform] duration-[900ms] ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </Comp>
  );
}
