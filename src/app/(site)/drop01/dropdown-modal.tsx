"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import EditableText from "@/components/edit/EditableText";
import type { ContentName } from "@/lib/content";

type Props = {
  file: ContentName;
  labelField: string;
  labelValue: string;
  children: ReactNode;
  /** Anchors the trigger row so other elements (e.g. a "read about the
   * details" scroll link) can jump straight to it. */
  id?: string;
  /** Hides the trigger row visually while keeping it in the DOM at `id` —
   * used where a separate visible button elsewhere on the page opens this
   * modal by clicking that id directly (see OpenModalButton). */
  hideTrigger?: boolean;
};

/* matches the modal-fade-out / modal-panel-out animation duration */
const CLOSE_MS = 420;

/** A full-width row that reads as an accordion (label + chevron, bottom
 * border) but opens a modal instead of expanding inline — used for the
 * mobile "What's Waiting Inside" / "The Fine Print" triggers. Reuses the
 * same modal-fade-in/out + modal-panel-in/out CSS as the waitlist and
 * desktop fine-print modals for a consistent open/close feel. */
export default function DropdownModal({ file, labelField, labelValue, children, id, hideTrigger }: Props) {
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
        id={id}
        role="button"
        tabIndex={hideTrigger ? -1 : 0}
        aria-hidden={hideTrigger || undefined}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={
          hideTrigger
            ? "hidden"
            : "flex w-full cursor-pointer items-center justify-between border-b border-[#3a352e] py-4 text-left transition-colors duration-300"
        }
      >
        {!hideTrigger && (
          <>
            <EditableText
              file={file}
              field={labelField}
              value={labelValue}
              as="span"
              className="text-xs tracking-[0.3em] text-[#e9e1cd]"
            />
            <span aria-hidden className="text-[10px] text-[#9c9384]">
              ⌄
            </span>
          </>
        )}
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
            className={`grain relative max-h-[90vh] w-full max-w-md border border-[#4c4740] bg-[#141115] text-center text-[#e9e1cd] sm:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl ${
              closing ? "modal-panel-out" : "modal-panel-in"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-3 z-10 text-xl leading-none text-[#b9b09d] transition-colors duration-300 hover:text-[#fff6e0]"
            >
              ×
            </button>

            {/* Grain lives on the outer, non-scrolling box so its noise
                overlay stays fixed to the visible frame — only this inner
                box scrolls, so the grain can't fall out of sync with long
                content (it used to be on the scrolling box itself, which
                left a visible seam once you scrolled past its own height). */}
            <div className="max-h-[90vh] overflow-y-auto px-8 py-10 sm:px-10">
              <span className="teaser-twinkle inline-block text-sm text-[#cfc6b1]" aria-hidden>
                ✦
              </span>
              <p className="mt-3 text-xs tracking-[0.3em] text-[#9c9384]">{labelValue}</p>

              <div className="mt-4">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
