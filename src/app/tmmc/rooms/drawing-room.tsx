"use client";

import { useState } from "react";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import type { TmmcContent } from "@/lib/content";

export default function DrawingRoom({ content }: { content: TmmcContent }) {
  const [index, setIndex] = useState(0);
  const pages = content.coloringPages;
  const n = pages.length;
  const prevIndex = (index - 1 + n) % n;
  const nextIndex = (index + 1) % n;

  const go = (delta: number) => setIndex((i) => (i + delta + n) % n);

  return (
    <div>
      <EditableText
        file="tmmc"
        field="drawingRoomBody"
        value={content.drawingRoomBody}
        as="p"
        className="mx-auto max-w-sm text-sm leading-relaxed text-[#c4bba8]"
      />

      <div className="relative mx-auto mt-10 h-56 w-full max-w-xs sm:h-64">
        {n > 1 && (
          <div className="absolute left-1/2 top-1/2 aspect-[3/4] w-28 -translate-x-[105%] -translate-y-1/2 -rotate-6 opacity-55 sm:w-32">
            <div className="relative h-full w-full overflow-hidden border border-[#4c4740] bg-[#e9e1cd] shadow-lg">
              <EditableImage
                file="tmmc"
                field={`coloringPages.${prevIndex}.image`}
                src={pages[prevIndex].image}
                alt={pages[prevIndex].alt}
                className="object-cover"
              />
            </div>
          </div>
        )}

        {n > 1 && (
          <div className="absolute left-1/2 top-1/2 aspect-[3/4] w-28 -translate-y-1/2 translate-x-[5%] rotate-6 opacity-55 sm:w-32">
            <div className="relative h-full w-full overflow-hidden border border-[#4c4740] bg-[#e9e1cd] shadow-lg">
              <EditableImage
                file="tmmc"
                field={`coloringPages.${nextIndex}.image`}
                src={pages[nextIndex].image}
                alt={pages[nextIndex].alt}
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="absolute left-1/2 top-1/2 z-10 aspect-[3/4] w-36 -translate-x-1/2 -translate-y-1/2 sm:w-40">
          <div className="relative h-full w-full overflow-hidden border border-[#4c4740] bg-[#e9e1cd] shadow-xl">
            <EditableImage
              file="tmmc"
              field={`coloringPages.${index}.image`}
              src={pages[index].image}
              alt={pages[index].alt}
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous coloring page"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6f695c]/70 text-[#e9e1cd] transition-colors duration-300 hover:border-[#cfc0a0]"
        >
          ‹
        </button>
        <div className="flex gap-2" aria-hidden>
          {pages.map((p, i) => (
            <span
              key={p.image}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                i === index ? "bg-[#cfc0a0]" : "bg-[#4c4740]"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next coloring page"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6f695c]/70 text-[#e9e1cd] transition-colors duration-300 hover:border-[#cfc0a0]"
        >
          ›
        </button>
      </div>

      <a
        href={pages[index].image}
        download
        className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-3 border border-[#6f695c] px-6 py-3.5 text-[11px] tracking-[0.25em] text-[#e9e1cd] transition-all duration-300 hover:border-[#cfc0a0] hover:bg-white/[0.04]"
      >
        DOWNLOAD COLORING PAGE ↓
      </a>
    </div>
  );
}
