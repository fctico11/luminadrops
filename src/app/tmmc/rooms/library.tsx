"use client";

import { useState } from "react";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";
import type { TmmcContent } from "@/lib/content";

export default function Library({ content }: { content: TmmcContent }) {
  const [index, setIndex] = useState(0);
  const books = content.books;
  const book = books[index];

  const go = (delta: number) => setIndex((i) => (i + delta + books.length) % books.length);

  return (
    <div>
      <EditableText
        file="tmmc"
        field="libraryBody"
        value={content.libraryBody}
        as="p"
        className="mx-auto max-w-sm text-sm leading-relaxed text-[#c4bba8]"
      />

      <div className="mt-8 flex flex-col items-center gap-6 text-left sm:flex-row sm:items-start">
        <div className="relative aspect-[2/3] w-28 shrink-0 overflow-hidden border border-[#4c4740] sm:w-32">
          <EditableImage
            file="tmmc"
            field={`books.${index}.coverImage`}
            src={book.coverImage}
            alt={book.coverAlt}
            className="object-cover"
          />
        </div>

        <div className="min-w-0">
          <EditableText
            file="tmmc"
            field={`books.${index}.monthLabel`}
            value={book.monthLabel}
            as="p"
            className="text-[10px] uppercase tracking-[0.3em] text-[#9c9384]"
          />
          <EditableText
            file="tmmc"
            field={`books.${index}.title`}
            value={book.title}
            as="p"
            className={`${cormorant.className} mt-2 text-xl font-medium italic text-[#e9e1cd]`}
          />
          <EditableText
            file="tmmc"
            field={`books.${index}.author`}
            value={book.author}
            as="p"
            className="mt-0.5 text-[13px] text-[#9c9384]"
          />

          <div className="mt-3 flex items-center gap-3" aria-hidden>
            <span className="h-px w-8 bg-[#4c4740]" />
            <span className="teaser-twinkle text-[10px] text-[#cfc6b1]">✦</span>
          </div>

          <EditableText
            file="tmmc"
            field={`books.${index}.description`}
            value={book.description}
            as="p"
            className="mt-3 text-[13px] leading-relaxed text-[#c4bba8]"
          />

          <a
            href={`https://www.goodreads.com/search?q=${encodeURIComponent(book.title)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 border border-[#6f695c] px-5 py-2.5 text-[10px] tracking-[0.2em] text-[#e9e1cd] transition-all duration-300 hover:border-[#cfc0a0] hover:bg-white/[0.04]"
          >
            ADD TO YOUR LIST →
          </a>
        </div>
      </div>

      {books.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] tracking-[0.15em] text-[#9c9384]">
          <button type="button" onClick={() => go(-1)} className="transition-colors duration-300 hover:text-[#fff6e0]">
            ← PREVIOUS
          </button>
          <span className="tabular-nums">
            {index + 1} / {books.length}
          </span>
          <button type="button" onClick={() => go(1)} className="transition-colors duration-300 hover:text-[#fff6e0]">
            NEXT →
          </button>
        </div>
      )}

      <div className="mx-auto mt-8 flex max-w-xs items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-[#4c4740]" />
        <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
        <span className="h-px flex-1 bg-[#4c4740]" />
      </div>

      <EditableText
        file="tmmc"
        field={`books.${index}.quote`}
        value={book.quote}
        as="p"
        className={`${cormorant.className} mt-6 text-sm italic text-[#d6cdb8]`}
      />
      <EditableText
        file="tmmc"
        field={`books.${index}.quoteAuthor`}
        value={book.quoteAuthor}
        as="p"
        className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#9c9384]"
        displayValue={`— ${book.quoteAuthor}`}
      />
    </div>
  );
}
