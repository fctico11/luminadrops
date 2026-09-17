"use client";

import Image from "next/image";
import Link from "next/link";
import type { Room } from "./rooms";

type FrameSize = "lg" | "md" | "sm";

/** Renders a room's door graphic: the shared arch frame around a swappable
 * line-icon glyph for most rooms, or — for a room with its own bespoke
 * iconImage — that image standing in for the whole door, arch included. */
function DoorArt({ room, size }: { room: Room; size: FrameSize }) {
  if (room.iconImage) {
    const dims = { lg: "h-32 w-28 sm:h-36 sm:w-32", md: "h-24 w-20", sm: "h-20 w-[4.5rem]" }[size];
    return (
      <div className={`relative ${dims} transition-opacity duration-300 group-hover:opacity-80`}>
        <Image src={room.iconImage.src} alt={room.iconImage.alt} fill className="object-contain" />
      </div>
    );
  }

  const Icon = room.icon!;
  return (
    <DoorFrame size={size}>
      <Icon className="h-full w-full" />
    </DoorFrame>
  );
}

/** The arched alcove every door icon sits inside — a small star on a dotted
 * stem above, a smaller star tucked in the bottom-right corner. Shared by
 * the full-size grid doors, the small side-rail thumbnails, and the
 * decorative mid-size accent some room modals repeat inside their content. */
export function DoorFrame({ size, children }: { size: FrameSize; children: React.ReactNode }) {
  const dims = { lg: "h-32 w-28 sm:h-36 sm:w-32", md: "h-24 w-20", sm: "h-20 w-[4.5rem]" }[size];
  const iconSize = { lg: "h-10 w-10 sm:h-11 sm:w-11", md: "h-8 w-8", sm: "h-6 w-6" }[size];
  const starTop = { lg: "-top-7", md: "-top-6", sm: "-top-5" }[size];
  const stemHeight = { lg: "h-5", md: "h-4", sm: "h-3" }[size];

  return (
    <div className="relative">
      <span
        className={`absolute ${starTop} left-1/2 -translate-x-1/2 text-[10px] text-[#cfc0a0]`}
        aria-hidden
      >
        ✦
      </span>
      <div
        className={`absolute left-1/2 top-[-1.1rem] ${stemHeight} w-px -translate-x-1/2 bg-[#4c4740]`}
        aria-hidden
      />
      <div
        className={`relative flex ${dims} items-center justify-center rounded-t-full border border-[#4c4740] text-[#cfc0a0] transition-colors duration-300 group-hover:border-[#cfc0a0]/70 group-hover:text-[#fff6e0]`}
      >
        <span className={iconSize}>{children}</span>
        {size === "lg" && (
          <span className="absolute bottom-3 right-4 text-[8px] text-[#cfc0a0]" aria-hidden>
            ✦
          </span>
        )}
      </div>
    </div>
  );
}

/** A full-size door in the After Hours grid. */
export function DoorButton({ room, onOpen }: { room: Room; onOpen: (room: Room) => void }) {
  const body = (
    <>
      <DoorArt room={room} size="lg" />
      <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-[#e9e1cd]">
        {room.label}
      </p>
    </>
  );

  if (room.href) {
    return (
      <Link href={room.href} className="group flex flex-col items-center">
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onOpen(room)} className="group flex flex-col items-center">
      {body}
    </button>
  );
}

/** A small side-rail thumbnail inside a modal / the Back Room page, jumping
 * to another room. Modal-to-modal jumps stay client-side (no navigation);
 * anything involving The Back Room, or a jump made from the Back Room page
 * itself, is a real link so the URL and back button behave correctly. */
export function DoorThumb({
  room,
  onNavigate,
}: {
  room: Room;
  onNavigate?: (room: Room) => void;
}) {
  const body = (
    <>
      <DoorArt room={room} size="sm" />
      <p className="mt-2 text-center text-[9px] font-medium uppercase leading-tight tracking-[0.2em] text-[#b9b09d]">
        {room.label}
      </p>
    </>
  );

  if (room.href || !onNavigate) {
    return (
      <Link href={room.href ?? `/tmmc?room=${room.id}`} className="group flex flex-col items-center">
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => onNavigate(room)} className="group flex flex-col items-center">
      {body}
    </button>
  );
}
