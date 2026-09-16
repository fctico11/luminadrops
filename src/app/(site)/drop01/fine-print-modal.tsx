"use client";

import { useEffect, useRef, useState } from "react";
import EditableText from "@/components/edit/EditableText";
import type { ContentName } from "@/lib/content";

type Props = {
  file: ContentName;
  labelField: string;
  labelValue: string;
  bodyField: string;
  bodyValue: string;
  triggerClassName?: string;
};

/* matches the modal-fade-out / modal-panel-out animation duration */
const CLOSE_MS = 420;

/** "The Fine Print" as a click-to-reveal modal instead of an always-visible
 * paragraph — the label stays inline (dotted underline + a small caret so
 * it reads as tappable without shouting), and the long return-policy text
 * only shows once someone actually asks for it. Reuses the same
 * modal-fade-in/out + modal-panel-in/out CSS already used by the waitlist
 * modal, for a consistent open/close feel across the site. */
export default function FinePrintModal({ file, labelField, labelValue, bodyField, bodyValue, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const close = () => {
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_MS);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(closeTimer.current);
    };
  }, [open]);

  return (
    <>
      {/* A plain div rather than a <button> — Space/Enter natively
          activating a <button> even while focus is on a descendant would
          reopen this every time an admin types a space while editing the
          label text (same reasoning as the waitlist trigger). */}
      <div
        role="button"
        tabIndex={0}
        className={`inline-flex cursor-pointer items-center gap-1.5 ${triggerClassName ?? ""}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <EditableText
          file={file}
          field={labelField}
          value={labelValue}
          as="span"
          className="underline decoration-[#6f695c] decoration-dotted underline-offset-4 transition-colors duration-300 hover:text-[#e9e1cd]"
        />
        <span aria-hidden className="text-[8px] text-[#6f695c] transition-colors duration-300">
          ▾
        </span>
      </div>

      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm ${
            closing ? "modal-fade-out" : "modal-fade-in"
          }`}
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={labelValue}
            className={`grain relative max-h-[80vh] w-full max-w-md overflow-y-auto border border-[#4c4740] bg-[#141115] px-8 py-10 text-center text-[#e9e1cd] sm:px-10 ${
              closing ? "modal-panel-out" : "modal-panel-in"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-3 text-xl leading-none text-[#b9b09d] transition-colors duration-300 hover:text-[#fff6e0]"
            >
              ×
            </button>

            <span className="teaser-twinkle inline-block text-sm text-[#cfc6b1]" aria-hidden>
              ✦
            </span>
            <p className="mt-3 text-xs tracking-[0.3em] text-[#9c9384]">{labelValue}</p>
            <EditableText
              file={file}
              field={bodyField}
              value={bodyValue}
              as="p"
              className="mt-4 text-sm leading-relaxed text-[#c4bba8]"
            />
          </div>
        </div>
      )}
    </>
  );
}
