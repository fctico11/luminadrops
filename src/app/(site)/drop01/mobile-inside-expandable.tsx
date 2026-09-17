"use client";

import { useState } from "react";
import type { Drop01Content } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";
import Reveal from "./reveal";

type Props = {
  content: Drop01Content;
  isAdmin: boolean;
};

/** The merged "What's Waiting Inside" — shows just the Club Manual
 * photo/description by default, with a toggle that expands the rest of the
 * items grid in place instead of sending users to a separate section.
 * Used at every width, scaled up via sm:/lg: variants. */
export default function MobileInsideExpandable({ content, isAdmin }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <EditableText
        file="drop01"
        field="insideMobileTitle"
        value={content.insideMobileTitle}
        as="h2"
        className={`${cormorant.className} text-lg font-medium tracking-[0.3em] sm:text-2xl`}
      />

      <div className="relative mx-auto mt-8 aspect-square w-[calc(50%-0.5rem)] max-w-[220px] overflow-hidden border border-[#3a352e] sm:mt-10 sm:max-w-[260px]">
        <EditableImage
          file="drop01"
          field="manualImage"
          src={content.manualImage}
          alt={content.manualImageAlt}
          className="object-cover"
        />
      </div>
      <EditableText
        file="drop01"
        field="manualTitle"
        value={content.manualTitle}
        as="h3"
        className="mt-5 text-sm font-medium tracking-[0.2em] text-[#e9e1cd] sm:mt-6 sm:text-base"
      />
      <EditableText
        file="drop01"
        field="manualDescription"
        value={content.manualDescription}
        as="p"
        className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#c4bba8] sm:max-w-lg sm:text-base"
      />

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className={`${expanded ? "" : "soft-button-glow"} mt-6 inline-flex items-center justify-center border border-[#6f695c]/80 px-5 py-2.5 text-[11px] font-medium tracking-[0.15em] text-[#e9e1cd] transition-all duration-300 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] sm:mt-8 sm:px-6 sm:py-3 sm:text-xs`}
      >
        {expanded ? "SHOW LESS" : <EditableText file="drop01" field="expandInsideLabel" value={content.expandInsideLabel} as="span" />}
      </button>

      {expanded && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 text-left sm:mt-10 sm:gap-x-8 sm:gap-y-10">
            {content.items.map((item, i) => (
              <Reveal
                key={i}
                direction={i % 2 === 0 ? "left" : "right"}
                delayMs={(i % 2) * 100}
                className="text-left"
              >
                <div className="relative aspect-square w-full overflow-hidden border border-[#3a352e]">
                  <EditableImage
                    file="drop01"
                    field={`items.${i}.image`}
                    src={item.image}
                    alt={item.alt}
                    className="object-cover"
                  />
                </div>
                <EditableText
                  file="drop01"
                  field={`items.${i}.title`}
                  value={item.title}
                  as="h3"
                  className="mt-3 text-[11px] font-medium tracking-[0.15em] text-[#e9e1cd] sm:text-sm"
                />
                <EditableText
                  file="drop01"
                  field={`items.${i}.description`}
                  value={item.description}
                  as="p"
                  className="mt-1.5 text-[13px] leading-relaxed text-[#c4bba8] sm:text-base"
                />
                {(isAdmin || item.note) && (
                  <EditableText
                    file="drop01"
                    field={`items.${i}.note`}
                    value={item.note}
                    as="p"
                    className={`${cormorant.className} mt-1.5 text-[13px] italic text-[#9c9384] sm:text-base`}
                  />
                )}
              </Reveal>
            ))}
          </div>
          <EditableText
            file="drop01"
            field="includesClosingLine"
            value={content.includesClosingLine}
            as="p"
            className={`${cormorant.className} mt-10 text-sm italic text-[#9c9384] sm:text-base`}
          />
        </>
      )}
    </div>
  );
}
