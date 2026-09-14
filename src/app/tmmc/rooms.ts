import type { ComponentType } from "react";
import { VinylIcon, FrameIcon, PencilIcon, CurtainIcon, ChestIcon, MugIcon, SealIcon } from "./door-icons";

export type RoomId = "listening-room" | "gallery" | "drawing-room" | "back-room" | "library" | "kitchen" | "note";

export type Room = {
  id: RoomId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  /** Only The Back Room breaks out to its own route — every other door opens
   * as a modal over the After Hours grid. */
  href?: string;
};

export const ROOMS: Room[] = [
  { id: "listening-room", label: "The Listening Room", icon: VinylIcon },
  { id: "gallery", label: "The Gallery", icon: FrameIcon },
  { id: "drawing-room", label: "The Drawing Room", icon: PencilIcon },
  { id: "back-room", label: "The Back Room", icon: CurtainIcon, href: "/tmmc/back-room" },
  { id: "library", label: "The Library", icon: ChestIcon },
  { id: "kitchen", label: "The Kitchen", icon: MugIcon },
  { id: "note", label: "A Note from Lumina", icon: SealIcon },
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
