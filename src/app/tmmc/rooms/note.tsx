"use client";

import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import EditableText from "@/components/edit/EditableText";
import { useEditMode } from "@/components/edit/EditModeContext";
import { cormorant } from "../../ui";
import starLoader from "./star-loader.json";
import type { TmmcContent } from "@/lib/content";

/* matches the transition-opacity/transition-all durations below */
const REVEAL_DELAY_MS = 1400;

export default function Note({ content }: { content: TmmcContent }) {
  const { isAdmin } = useEditMode();
  // Admins skip the wait so editing this note isn't gated behind a delay
  // every time the modal opens.
  const [revealed, setRevealed] = useState(isAdmin);

  useEffect(() => {
    if (isAdmin) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setRevealed(true), reduceMotion ? 0 : REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isAdmin]);

  return (
    <div className="relative mx-auto max-w-sm text-left">
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-4 text-center transition-opacity duration-700 ${
          revealed ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={revealed}
      >
        <Lottie src={starLoader} autoplay loop className="h-24 w-24" />
        <p className="-mt-2 text-[11px] italic tracking-[0.15em] text-[#9c9384]">Unsealing your note...</p>
      </div>

      <div
        className={`transition-all duration-700 ${revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
      >
        {content.noteBody.map((_, i) => (
          <EditableText
            key={i}
            file="tmmc"
            field={`noteBody.${i}`}
            value={content.noteBody[i]}
            as="p"
            className="mt-4 text-[15px] leading-relaxed text-[#c4bba8] first:mt-0"
          />
        ))}
        <EditableText
          file="tmmc"
          field="noteSignature"
          value={content.noteSignature}
          as="p"
          className={`${cormorant.className} mt-6 text-base italic text-[#d6cdb8]`}
        />
      </div>
    </div>
  );
}
