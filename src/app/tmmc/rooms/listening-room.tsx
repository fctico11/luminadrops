import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";
import { SpotifyIcon } from "../door-icons";
import type { TmmcContent } from "@/lib/content";

export default function ListeningRoom({ content }: { content: TmmcContent }) {
  return (
    <div>
      <div className="flex items-center gap-4 border border-[#4c4740] bg-white/[0.03] p-3 text-left">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden">
          <EditableImage
            file="tmmc"
            field="playlistCoverImage"
            src={content.playlistCoverImage}
            alt={content.playlistCoverAlt}
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <EditableText
            file="tmmc"
            field="playlistTitle"
            value={content.playlistTitle}
            as="p"
            className={`${cormorant.className} truncate text-lg font-medium text-[#e9e1cd]`}
          />
          <EditableText
            file="tmmc"
            field="playlistSubtitle"
            value={content.playlistSubtitle}
            as="p"
            className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#9c9384]"
          />
        </div>
      </div>

      <a
        href={content.spotifyUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex items-center justify-center gap-2 border border-[#6f695c] px-5 py-3 text-[11px] tracking-[0.2em] text-[#e9e1cd] transition-all duration-300 hover:border-[#cfc0a0] hover:bg-white/[0.04]"
      >
        <SpotifyIcon className="h-4 w-4 shrink-0" />
        OPEN IN SPOTIFY ↗
      </a>
    </div>
  );
}
