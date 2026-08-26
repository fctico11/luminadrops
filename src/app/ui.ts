import type { CSSProperties } from "react";
import { Cormorant_Garamond } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

/** Stagger delay for the shared `teaser-rise` entrance animation. */
export const rise = (seconds: number) => ({ "--rise": `${seconds}s` }) as CSSProperties;
