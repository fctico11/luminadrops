"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Lottie } from "lottie-react";
import shine from "./shine.json";
import EditableText from "@/components/edit/EditableText";
import { useEditMode } from "@/components/edit/EditModeContext";
import type { WaitlistContent } from "@/lib/content";

type Props = {
  content: WaitlistContent;
  cormorantClass: string;
  garamondClass: string;
  buttonClassName: string;
  buttonStyle?: CSSProperties;
};

/* matches the modal-fade-out / modal-panel-out animation duration */
const CLOSE_MS = 420;
/* the shine's sparkle collapses around 0.8s in; the success text arrives as it fades */
const REVEAL_MS = 800;

export default function WaitlistButton({ content, cormorantClass, garamondClass, buttonClassName, buttonStyle }: Props) {
  const { isAdmin } = useEditMode();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const revealTimer = useRef<number | undefined>(undefined);

  const close = () => {
    window.clearTimeout(revealTimer.current);
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_MS);
  };

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(revealTimer.current);
    };
  }, [open]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAdmin) return;
    // TODO: post to Resend / Formspree once the email integration lands
    setSubmitted(true);
    revealTimer.current = window.setTimeout(() => setRevealed(true), REVEAL_MS);
  };

  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        style={buttonStyle}
        onClick={() => {
          setSubmitted(false);
          setRevealed(false);
          setOpen(true);
        }}
      >
        <EditableText file="waitlist" field="triggerLabel" value={content.triggerLabel} as="span" />
      </button>

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
            aria-label="Join the waitlist"
            className={`grain relative w-full max-w-md border border-[#4c4740] bg-[#141115] px-8 py-10 text-center text-[#e9e1cd] sm:px-12 ${
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

            {submitted ? (
              <>
                {/* cream shine plays first; the success text follows as it fades */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible"
                  aria-hidden
                >
                  <Lottie src={shine} autoplay loop={false} className="h-80 w-80 max-w-none" />
                </div>
                <div className={revealed ? "success-reveal" : "opacity-0"}>
                  <span className="teaser-twinkle inline-block text-sm text-[#cfc6b1]" aria-hidden>
                    ✦
                  </span>
                  <EditableText
                    file="waitlist"
                    field="successTitle"
                    value={content.successTitle}
                    as="h3"
                    className={`${cormorantClass} mt-4 text-2xl font-medium tracking-[0.18em]`}
                  />
                  <EditableText
                    file="waitlist"
                    field="successBody"
                    value={content.successBody}
                    as="p"
                    className={`${garamondClass} mt-3 text-[15px] text-[#c4bba8]`}
                  />
                  <button
                    type="button"
                    onClick={close}
                    tabIndex={revealed ? 0 : -1}
                    className="mt-8 border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0]"
                  >
                    <EditableText file="waitlist" field="closeLabel" value={content.closeLabel} as="span" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="teaser-twinkle inline-block text-sm text-[#cfc6b1]" aria-hidden>
                  ✦
                </span>
                <EditableText
                  file="waitlist"
                  field="modalTitle"
                  value={content.modalTitle}
                  as="h3"
                  className={`${cormorantClass} mt-4 text-2xl font-medium tracking-[0.18em]`}
                />
                <EditableText
                  file="waitlist"
                  field="modalBody"
                  value={content.modalBody}
                  as="p"
                  className={`${garamondClass} mt-3 text-[15px] text-[#c4bba8]`}
                />

                <form onSubmit={onSubmit} className="mt-8">
                  <input
                    ref={inputRef}
                    type="email"
                    name="email"
                    required
                    placeholder={content.emailPlaceholder}
                    className={`${garamondClass} w-full border border-[#4c4740] bg-transparent px-4 py-3 text-center text-base text-[#e9e1cd] outline-none transition-colors duration-300 placeholder:text-[#6f695c] focus:border-[#cfc0a0]`}
                  />

                  <label
                    className={`${garamondClass} mx-auto mt-5 flex max-w-[300px] cursor-pointer items-start gap-3 text-left text-[13px] leading-snug text-[#b9b09d]`}
                  >
                    <input
                      type="checkbox"
                      name="consent"
                      required
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#b9a06a]"
                    />
                    <EditableText file="waitlist" field="consentLabel" value={content.consentLabel} as="span" />
                  </label>

                  <button
                    type="submit"
                    className="mt-8 w-full border border-[#6f695c] px-8 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#d9ae4b] hover:bg-[#a8842c] hover:text-[#171310]"
                  >
                    <EditableText file="waitlist" field="submitLabel" value={content.submitLabel} as="span" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
