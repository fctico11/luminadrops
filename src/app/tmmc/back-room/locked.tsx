"use client";

import { useRouter } from "next/navigation";
import EditableText from "@/components/edit/EditableText";
import RoomModal from "../room-modal";
import { findRoom } from "../rooms";
import type { TmmcContent } from "@/lib/content";

const room = findRoom("back-room")!;

export default function BackRoomLocked({ content }: { content: TmmcContent }) {
  const router = useRouter();

  return (
    <RoomModal
      room={room}
      onClose={() => router.push("/tmmc")}
      onNavigate={undefined}
      tagline={{ field: "backRoomLockedTagline", value: content.backRoomLockedTagline }}
    >
      <EditableText
        file="tmmc"
        field="backRoomLockedBody"
        value={content.backRoomLockedBody}
        as="p"
        className="mx-auto max-w-sm text-sm leading-relaxed text-[#c4bba8]"
      />
    </RoomModal>
  );
}
