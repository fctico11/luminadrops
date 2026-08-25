import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";
import EditableImage from "@/components/edit/EditableImage";
import Motes from "../../motes";
import { cormorant, garamond, rise } from "../../ui";

export const metadata = {
  title: "Drops — Lumina Drops",
  description: "The current Lumina Drops release.",
};

export default function DropsPage() {
  const content = getContent("drops");

  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 text-center lg:py-24">
      <Motes />

      <div className="relative w-full max-w-3xl">
        <EditableText
          file="drops"
          field="eyebrow"
          value={content.eyebrow}
          as="p"
          className="teaser-rise text-[10px] tracking-[0.28em] text-[#cfc6b1] lg:text-sm"
          style={rise(0.1)}
        />

        <div
          className="teaser-rise relative mt-10 overflow-hidden border border-[#4c4740] lg:mt-14"
          style={rise(0.3)}
        >
          <EditableImage
            file="drops"
            field="backgroundImage"
            src={content.backgroundImage}
            alt=""
            exportWidth={1200}
            exportHeight={900}
            className="scale-125 object-cover opacity-30"
          />
          {/* keeps the artwork behind the copy rather than competing with it */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#141115]/85 via-[#141115]/70 to-[#141115]/90"
            aria-hidden
          />

          <div className="relative flex flex-col items-center px-6 py-20 lg:py-28">
            <EditableText
              file="drops"
              field="dropLabel"
              value={content.dropLabel}
              as="p"
              className="text-[10px] tracking-[0.28em] text-[#b9b09d] lg:text-xs"
            />

            <h1
              className={`${cormorant.className} mt-5 text-2xl leading-[1.3] font-medium tracking-[0.2em] sm:text-3xl lg:text-5xl`}
            >
              <EditableText file="drops" field="titleLine1" value={content.titleLine1} as="span" />
              <br />
              <EditableText file="drops" field="titleLine2" value={content.titleLine2} as="span" />
            </h1>

            <EditableText
              file="drops"
              field="dateLabel"
              value={content.dateLabel}
              as="p"
              className={`${garamond.className} mt-5 text-base italic text-[#d6cdb8] lg:text-xl`}
            />

            <EditableLink
              href="/"
              className="mt-10 border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-12 lg:px-12 lg:py-4 lg:text-sm"
            >
              <EditableText file="drops" field="ctaLabel" value={content.ctaLabel} as="span" />
            </EditableLink>
          </div>
        </div>

        <EditableText
          file="drops"
          field="footerNote"
          value={content.footerNote}
          as="p"
          className={`${garamond.className} teaser-rise mt-12 text-[15px] italic text-[#b9b09d] lg:mt-16 lg:text-lg`}
          style={rise(0.5)}
        />
      </div>
    </main>
  );
}
