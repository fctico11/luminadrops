"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EditableText from "@/components/edit/EditableText";
import { cormorant } from "../ui";
import { ROOMS, findRoom, type Room, type RoomId } from "./rooms";
import { DoorButton } from "./door";
import RoomModal from "./room-modal";
import ListeningRoom from "./rooms/listening-room";
import Gallery from "./rooms/gallery";
import DrawingRoom from "./rooms/drawing-room";
import Kitchen from "./rooms/kitchen";
import Library from "./rooms/library";
import Note from "./rooms/note";
import type { TmmcContent } from "@/lib/content";

/* matches the modal-fade-out / modal-panel-out animation duration */
const CLOSE_MS = 420;

// On desktop the 4 top-row doors sit on an 8-column grid, each spanning 2
// columns; the 3 second-row doors are offset by one column so they land
// exactly in the gaps between the doors above them, instead of just being
// centered as their own independent (and subtly misaligned) row.
const GRID_COL_START: Record<RoomId, number> = {
  "listening-room": 1,
  gallery: 3,
  "drawing-room": 5,
  "back-room": 7,
  library: 2,
  kitchen: 4,
  note: 6,
};

function getModalMeta(id: RoomId, content: TmmcContent): { tagline?: string; closingLine?: string } {
  switch (id) {
    case "listening-room":
      return { tagline: content.listeningRoomTagline, closingLine: content.listeningRoomClosingLine };
    case "gallery":
      return { tagline: content.galleryTagline };
    case "drawing-room":
      return { tagline: content.drawingRoomTagline, closingLine: content.drawingRoomClosingLine };
    case "kitchen":
      return { tagline: content.kitchenTagline };
    case "library":
      return { tagline: content.libraryTagline };
    default:
      return {};
  }
}

function getRoomBody(id: RoomId, content: TmmcContent): ReactNode {
  switch (id) {
    case "listening-room":
      return <ListeningRoom content={content} />;
    case "gallery":
      return <Gallery content={content} />;
    case "drawing-room":
      return <DrawingRoom content={content} />;
    case "kitchen":
      return <Kitchen content={content} />;
    case "library":
      return <Library content={content} />;
    case "note":
      return <Note content={content} />;
    default:
      return null;
  }
}

export default function AfterHours({ content }: { content: TmmcContent }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Lets a side-rail thumbnail on another page (e.g. the Back Room) deep-link
  // straight into a modal here via /tmmc?room=<id>, instead of dropping the
  // visitor on the bare grid.
  const [activeRoom, setActiveRoom] = useState<Room | null>(() => {
    const room = findRoom(searchParams.get("room"));
    return room && !room.href ? room : null;
  });
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (searchParams.get("room")) {
      router.replace("/tmmc", { scroll: false });
    }
    return () => window.clearTimeout(closeTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = (room: Room) => {
    window.clearTimeout(closeTimer.current);
    setActiveRoom(room);
    setClosing(false);
  };

  const close = () => {
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setActiveRoom(null);
      setClosing(false);
    }, CLOSE_MS);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
      <span className="teaser-twinkle inline-block text-base text-[#cfc6b1]" aria-hidden>
        ✦
      </span>
      <EditableText
        file="tmmc"
        field="pageTitle"
        value={content.pageTitle}
        as="h1"
        className={`${cormorant.className} mt-4 text-4xl font-medium uppercase tracking-[0.3em] sm:text-5xl`}
      />
      <EditableText
        file="tmmc"
        field="pageSubtitle"
        value={content.pageSubtitle}
        as="p"
        className={`${cormorant.className} mx-auto mt-4 max-w-md text-base italic text-[#d6cdb8]`}
      />

      <div className="mt-16 hidden lg:grid lg:grid-cols-8 lg:gap-x-2 lg:gap-y-14">
        {ROOMS.map((room) => (
          <div key={room.id} className="flex justify-center" style={{ gridColumn: `${GRID_COL_START[room.id]} / span 2` }}>
            <DoorButton room={room} onOpen={open} />
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-12 sm:gap-x-10 lg:hidden">
        {ROOMS.map((room) => (
          <DoorButton key={room.id} room={room} onOpen={open} />
        ))}
      </div>

      {activeRoom && !activeRoom.href && (
        <RoomModal room={activeRoom} closing={closing} onClose={close} onNavigate={open} {...getModalMeta(activeRoom.id, content)}>
          {getRoomBody(activeRoom.id, content)}
        </RoomModal>
      )}
    </div>
  );
}
