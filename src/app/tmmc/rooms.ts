import type { ComponentType } from "react";
import { PencilIcon } from "./door-icons";

export type RoomId = "listening-room" | "gallery" | "drawing-room" | "back-room" | "library" | "kitchen" | "note";

export type Room = {
  id: RoomId;
  label: string;
  /** Either a line-icon component (rendered inside the shared DoorFrame
   * arch, like every other room) or a standalone image that replaces the
   * whole door graphic — arch and all — for rooms with a bespoke asset. */
  icon?: ComponentType<{ className?: string }>;
  iconImage?: { src: string; alt: string };
  /** Only The Back Room breaks out to its own route — every other door opens
   * as a modal over the After Hours grid. */
  href?: string;
};

export const ROOMS: Room[] = [
  {
    id: "listening-room",
    label: "The Listening Room",
    iconImage: { src: "/drops/midnight-margarita/tmmc-listening-room-door.png", alt: "The Listening Room door" },
  },
  {
    id: "gallery",
    label: "The Gallery",
    iconImage: { src: "/drops/midnight-margarita/tmmc-gallery-door.png", alt: "The Gallery door" },
  },
  {
    id: "kitchen",
    label: "The Kitchen",
    iconImage: { src: "/drops/midnight-margarita/tmmc-kitchen-door.png", alt: "The Kitchen door" },
  },
  {
    id: "library",
    label: "The Library",
    iconImage: { src: "/drops/midnight-margarita/tmmc-library-door.png", alt: "The Library door" },
  },
  {
    id: "back-room",
    label: "The Back Room",
    iconImage: { src: "/drops/midnight-margarita/tmmc-back-room-door.png", alt: "The Back Room door" },
    href: "/tmmc/back-room",
  },
  {
    id: "note",
    label: "A Note from Lumina",
    iconImage: { src: "/drops/midnight-margarita/tmmc-note-door.png", alt: "A Note from Lumina door" },
  },
  // Paused until the coloring page asset is ready — restore in place to get
  // back to a 4-top/3-bottom grid (see GRID_COL_START in after-hours.tsx).
  // { id: "drawing-room", label: "The Drawing Room", icon: PencilIcon },
];

export function findRoom(id: string | null | undefined) {
  return ROOMS.find((room) => room.id === id);
}

/** The four doors shown as small side-rail thumbnails inside every modal and
 * on the Back Room page, for jumping between rooms without returning to the
 * grid first. Fixed on purpose, regardless of which room is currently open —
 * matches the reference design, which shows the same four anchors everywhere. */
export const SIDE_RAIL_LEFT: RoomId[] = ["listening-room", "library"];
export const SIDE_RAIL_RIGHT: RoomId[] = ["back-room", "note"];
