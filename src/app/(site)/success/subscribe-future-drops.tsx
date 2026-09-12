"use client";

import { useRef, useState, type FormEvent } from "react";
import EditableText from "@/components/edit/EditableText";
import { useEditMode } from "@/components/edit/EditModeContext";
import type { SuccessContent } from "@/lib/content";
import { cormorant } from "../../ui";

type Props = { content: SuccessContent };

/** Inline (not a modal — the customer is already on a dedicated confirmation
 * page) email capture for future drops, separate from the pre-purchase
 * waitlist: this one is for people who already bought this drop and want to
 * hear about the next one. */
export default function SubscribeFutureDrops({ content }: Props) {
  const { isAdmin } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAdmin) return;

    const email = inputRef.current?.value ?? "";
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="teaser-rise mt-16 border-t border-[#4c4740] pt-10">
      <EditableText
        file="success"
        field="futureDropsTitle"
        value={content.futureDropsTitle}
        as="h2"
        className={`${cormorant.className} text-lg font-medium tracking-[0.15em] text-[#e9e1cd]`}
      />
      <EditableText
        file="success"
        field="futureDropsBody"
        value={content.futureDropsBody}
        as="p"
        className={`${cormorant.className} mx-auto mt-3 max-w-sm text-[15px] text-[#c4bba8]`}
      />

      {submitted ? (
        <p className={`${cormorant.className} mt-6 text-[15px] italic text-[#d6cdb8]`}>
          <EditableText file="success" field="futureDropsSuccessMessage" value={content.futureDropsSuccessMessage} as="span" />
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            type="email"
            name="email"
            required
            placeholder={content.futureDropsPlaceholder}
            className={`${cormorant.className} w-full border border-[#4c4740] bg-transparent px-4 py-3 text-center text-base text-[#e9e1cd] outline-none transition-colors duration-300 placeholder:text-[#6f695c] focus:border-[#cfc0a0] sm:text-left`}
          />
          <button
            type="submit"
            disabled={submitting}
            className="border border-[#6f695c] px-6 py-3 text-[12px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "..." : <EditableText file="success" field="futureDropsSubmitLabel" value={content.futureDropsSubmitLabel} as="span" />}
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-[13px] text-[#e07a5f]">{error}</p>}
    </div>
  );
}
