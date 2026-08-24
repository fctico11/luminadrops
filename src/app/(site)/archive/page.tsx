import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";
import Motes from "../../motes";
import { cormorant, garamond, rise } from "../../ui";

export const metadata = {
  title: "Archive — Lumina Drops",
  description: "Past Lumina Drops releases.",
};

export default function ArchivePage() {
  const content = getContent("archive");

  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 text-center lg:py-24">
      <Motes />

      <div className="relative w-full max-w-3xl">
        <EditableText
          file="archive"
          field="title"
          value={content.title}
          as="h1"
          className={`${cormorant.className} teaser-rise text-xl font-medium tracking-[0.3em] lg:text-3xl`}
          style={rise(0.1)}
        />

        <div
          className="teaser-rise mx-auto mt-10 flex max-w-xs items-center gap-5 lg:mt-14 lg:max-w-md"
          style={rise(0.3)}
          aria-hidden
        >
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[10px] text-[#cfc6b1] lg:text-sm">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        {/* nothing has closed yet — the archive fills as drops sell out */}
        <div
          className="teaser-rise mt-14 border border-dashed border-[#4c4740] px-8 py-20 lg:mt-20 lg:py-28"
          style={rise(0.5)}
        >
          <EditableText
            file="archive"
            field="emptyLabel"
            value={content.emptyLabel}
            as="p"
            className="text-[10px] tracking-[0.28em] text-[#b9b09d] lg:text-xs"
          />

          <EditableText
            file="archive"
            field="emptyBody"
            value={content.emptyBody}
            as="p"
            className={`${garamond.className} mx-auto mt-6 max-w-md text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg`}
          />

          <EditableLink
            href="/drops"
            className="mt-10 inline-block border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:px-12 lg:py-4 lg:text-sm"
          >
            <EditableText file="archive" field="ctaLabel" value={content.ctaLabel} as="span" />
          </EditableLink>
        </div>
      </div>
    </main>
  );
}
