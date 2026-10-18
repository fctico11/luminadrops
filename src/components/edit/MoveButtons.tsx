"use client";

type Props = {
  onEarlier: () => void;
  onLater: () => void;
  canEarlier: boolean;
  canLater: boolean;
  /** Arrows only, for narrow cards. */
  compact?: boolean;
};

/** Admin-only pair of buttons for shifting a card one place earlier/later. */
export default function MoveButtons({ onEarlier, onLater, canEarlier, canLater, compact }: Props) {
  const base =
    "flex h-7 items-center justify-center border border-[#c9a227]/50 px-2 text-[10px] uppercase tracking-[0.15em] text-[#c9a227] transition hover:border-[#c9a227] hover:bg-[#c9a227]/10 disabled:cursor-not-allowed disabled:opacity-30";
  return (
    <div className="flex justify-center gap-2">
      <button type="button" onClick={onEarlier} disabled={!canEarlier} className={base} title="Move this card earlier" aria-label="Move card earlier">
        {compact ? "←" : "← Earlier"}
      </button>
      <button type="button" onClick={onLater} disabled={!canLater} className={base} title="Move this card later" aria-label="Move card later">
        {compact ? "→" : "Later →"}
      </button>
    </div>
  );
}
