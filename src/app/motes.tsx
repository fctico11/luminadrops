import type { CSSProperties } from "react";

/* drifting ember motes: [top %, left %, size px, duration s, delay s, x-drift px, opacity] */
const MOTES = [
  [22, 12, 3, 15, 0, 30, 0.5],
  [30, 82, 2, 19, 4, -26, 0.4],
  [44, 26, 2, 17, 8, 20, 0.35],
  [52, 68, 3, 21, 2, -34, 0.45],
  [66, 42, 2, 16, 10, 26, 0.4],
  [74, 88, 2, 20, 6, -20, 0.35],
  [84, 18, 3, 18, 12, 32, 0.45],
] as const;

/** Slow gold specks drifting upward, like sparks off a candle. */
export default function Motes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {MOTES.map(([top, left, size, dur, delay, drift, opacity]) => (
        <span
          key={`${top}-${left}`}
          className="teaser-mote"
          style={
            {
              top: `${top}%`,
              left: `${left}%`,
              width: size,
              height: size,
              "--mote-t": `${dur}s`,
              "--mote-d": `${delay}s`,
              "--mote-x": `${drift}px`,
              "--mote-o": opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
