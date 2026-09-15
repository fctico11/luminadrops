"use client";

import { useEffect, type ReactNode } from "react";
import { cormorant } from "../ui";
import { SIDE_RAIL_LEFT, SIDE_RAIL_RIGHT, findRoom, type Room } from "./rooms";
import { DoorThumb } from "./door";

type Props = {
  room: Room;
  tagline?: string;
  closingLine?: string;
  closing?: boolean;
  onClose: () => void;
  onNavigate?: (room: Room) => void;
  children: ReactNode;
};

/** Shared chrome for every After Hours room: the modal backdrop/panel, the
 * fixed four-door side rail, close button, and title/tagline/closing-line
 * layout. Also reused (without the fixed backdrop) as page chrome for the
 * standalone Back Room. */
export default function RoomModal({ room, tagline, closingLine, closing, onClose, onNavigate, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftRooms = SIDE_RAIL_LEFT.map(findRoom).filter((r): r is Room => Boolean(r));
  const rightRooms = SIDE_RAIL_RIGHT.map(findRoom).filter((r): r is Room => Boolean(r));

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center gap-10 bg-black/75 px-4 py-10 backdrop-blur-sm sm:px-6 ${
        closing ? "modal-fade-out" : "modal-fade-in"
      }`}
      onClick={onClose}
    >
      <div className="hidden shrink-0 flex-col gap-14 xl:flex" onClick={(e) => e.stopPropagation()}>
        {leftRooms.map((r) => (
          <DoorThumb key={r.id} room={r} onNavigate={onNavigate} />
        ))}
      </div>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={room.label}
        className={`relative max-h-[88vh] w-full max-w-xl overflow-y-auto border border-[#4c4740] bg-[#141115] px-6 py-10 text-center text-[#e9e1cd] sm:px-10 ${
          closing ? "modal-panel-out" : "modal-panel-in"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-xl leading-none text-[#b9b09d] transition-colors duration-300 hover:text-[#fff6e0]"
        >
          ×
        </button>

        <span className="teaser-twinkle inline-block text-sm text-[#cfc6b1]" aria-hidden>
          ✦
        </span>
        <h2 className={`${cormorant.className} mt-3 text-2xl font-medium uppercase tracking-[0.2em] sm:text-3xl`}>
          {room.label}
        </h2>
        {tagline && (
          <p className={`${cormorant.className} mx-auto mt-3 max-w-sm text-base italic text-[#d6cdb8]`}>{tagline}</p>
        )}

        <div className="mt-8">{children}</div>

        {closingLine && (
          <>
            <div className="mx-auto mt-10 flex max-w-xs items-center gap-4" aria-hidden>
              <span className="h-px flex-1 bg-[#4c4740]" />
              <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
              <span className="h-px flex-1 bg-[#4c4740]" />
            </div>
            <p className={`${cormorant.className} mt-6 text-sm italic text-[#9c9384]`}>{closingLine}</p>
          </>
        )}
      </div>

      <div className="hidden shrink-0 flex-col gap-14 xl:flex" onClick={(e) => e.stopPropagation()}>
        {rightRooms.map((r) => (
          <DoorThumb key={r.id} room={r} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
