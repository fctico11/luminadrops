"use client";

import { useState } from "react";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import type { TmmcContent } from "@/lib/content";

export default function Gallery({ content }: { content: TmmcContent }) {
  const [index, setIndex] = useState(0);
  const wallpapers = content.wallpapers;
  const current = wallpapers[index];

  const go = (delta: number) => setIndex((i) => (i + delta + wallpapers.length) % wallpapers.length);

  return (
    <div>
      <EditableText
        file="tmmc"
        field="galleryBody"
        value={content.galleryBody}
        as="p"
        className="mx-auto max-w-sm text-sm leading-relaxed text-[#c4bba8]"
      />

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous wallpaper"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6f695c]/70 text-[#e9e1cd] transition-colors duration-300 hover:border-[#cfc0a0]"
        >
          ‹
        </button>

        <div className="relative aspect-[9/18.5] w-36 overflow-hidden rounded-2xl border border-[#4c4740] sm:w-40">
          <EditableImage
            file="tmmc"
            field={`wallpapers.${index}.image`}
            src={current.image}
            alt={current.alt}
            exportWidth={1080}
            exportHeight={2220}
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-2 pb-8 pt-3 text-center">
            <EditableText
              file="tmmc"
              field="wallpaperTimeLabel"
              value={content.wallpaperTimeLabel}
              as="p"
              className="text-2xl font-light tracking-wide text-[#f5f2ea]"
            />
            <EditableText
              file="tmmc"
              field="wallpaperDateLabel"
              value={content.wallpaperDateLabel}
              as="p"
              className="mt-0.5 text-[9px] tracking-[0.1em] text-[#f5f2ea]/80"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next wallpaper"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6f695c]/70 text-[#e9e1cd] transition-colors duration-300 hover:border-[#cfc0a0]"
        >
          ›
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2" aria-hidden>
        {wallpapers.map((w, i) => (
          <span
            key={w.image}
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              i === index ? "bg-[#cfc0a0]" : "bg-[#4c4740]"
            }`}
          />
        ))}
      </div>

      <div className="mx-auto mt-8 flex max-w-xs items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-[#4c4740]" />
        <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
        <span className="h-px flex-1 bg-[#4c4740]" />
      </div>

      <a
        href={current.image}
        download
        className="mt-6 flex items-center justify-center gap-3 border border-[#6f695c] px-6 py-3.5 text-[11px] tracking-[0.25em] text-[#e9e1cd] transition-all duration-300 hover:border-[#cfc0a0] hover:bg-white/[0.04]"
      >
        DOWNLOAD WALLPAPER ↓
      </a>
    </div>
  );
}
