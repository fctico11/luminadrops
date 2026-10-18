"use client";

import { useEditMode } from "./EditModeContext";
import type { ContentName } from "@/lib/content";

/** The display order of an array of cards (`path` like "items"), as original
 * indices. Visitors always get the saved order; an admin also sees any
 * unsaved reorder, and `move` stages a new one. Field paths for the cards
 * keep using the ORIGINAL index, so editing text works the same wherever a
 * card currently sits. */
export function useOrder(file: ContentName, path: string, count: number) {
  const { orderEdits, setOrder } = useEditMode();
  const key = `${file}:${path}`;
  const pending = orderEdits[key];
  const order = pending && pending.length === count ? pending : Array.from({ length: count }, (_, i) => i);

  /** Swaps the card at `position` with its neighbour (`dir` -1 earlier, +1 later). */
  const move = (position: number, dir: -1 | 1, min = 0) => {
    const to = position + dir;
    if (to < min || to >= order.length) return;
    const next = [...order];
    [next[position], next[to]] = [next[to], next[position]];
    setOrder(file, path, next);
  };

  return { order, move };
}
