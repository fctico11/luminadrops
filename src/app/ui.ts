import type { CSSProperties } from "react";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

/** Stagger delay for the shared `teaser-rise` entrance animation. */
export const rise = (seconds: number) => ({ "--rise": `${seconds}s` }) as CSSProperties;
