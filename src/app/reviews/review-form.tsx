"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import EditableText from "@/components/edit/EditableText";
import { cormorant } from "../ui";
import type { ReviewsContent } from "@/lib/content";

const MAX_REVIEW_LENGTH = 500;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = /^image\/(jpeg|png|heic|heif)$/;
const ACCEPTED_EXTENSIONS = /\.(jpe?g|png|heic|heif)$/i;

/** Submission has nowhere to go yet — there's no backend for this page. It
 * only confirms the attempt locally so the flow can be reviewed end to end;
 * wiring it to actually save reviews is a separate, later step. */
export default function ReviewForm({ content }: { content: ReviewsContent }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [consent, setConsent] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = rating > 0 && name.trim().length > 0 && reviewText.trim().length > 0 && consent;

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.test(file.type) && !ACCEPTED_EXTENSIONS.test(file.name)) {
      setPhotoError("Please upload a JPG, PNG, or HEIC file.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("That photo is over 10MB — try a smaller one.");
      return;
    }
    setPhotoError(null);
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview(null);
    setPhotoError(null);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="teaser-twinkle text-base text-[#cfc6b1]" aria-hidden>
          ✦
        </span>
        <h1
          className={`${cormorant.className} mt-4 text-3xl font-medium uppercase tracking-[0.08em] text-[#f5f2ea] sm:text-4xl`}
        >
          <EditableText file="reviews" field="successTitle" value={content.successTitle} as="span" />
        </h1>
        <EditableText
          file="reviews"
          field="successBody"
          value={content.successBody}
          as="p"
          className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-[#c4bba8]"
        />
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl px-6 py-16 text-center sm:py-24">
      <EditableText
        file="reviews"
        field="dropLabel"
        value={content.dropLabel}
        as="p"
        className="text-[11px] tracking-[0.28em] text-[#b9b09d]"
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/drops/midnight-margarita/mmc-logo-icon.png"
        alt=""
        className="mx-auto mt-4 h-6 w-auto opacity-90"
      />

      <h1
        className={`${cormorant.className} mt-4 text-4xl font-medium uppercase leading-[1.15] tracking-[0.01em] text-[#f5f2ea] sm:text-5xl`}
      >
        <EditableText file="reviews" field="headingLine1" value={content.headingLine1} as="span" />
        <br />
        <EditableText file="reviews" field="headingLine2" value={content.headingLine2} as="span" />
      </h1>

      <EditableText
        file="reviews"
        field="subheading"
        value={content.subheading}
        as="p"
        className="mt-5 text-[11px] tracking-[0.2em] text-[#9c9384]"
      />

      <EditableText
        file="reviews"
        field="body"
        value={content.body}
        as="p"
        className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#c4bba8]"
      />

      <div className="mx-auto mt-10 flex max-w-xs items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-[#4c4740]" />
        <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
        <span className="h-px flex-1 bg-[#4c4740]" />
      </div>

      <form onSubmit={onSubmit} className="mt-10 grid gap-y-8 text-left sm:grid-cols-[150px_1fr] sm:gap-x-8">
        {/* Rating */}
        <EditableText
          file="reviews"
          field="ratingLabel"
          value={content.ratingLabel}
          as="p"
          className="text-[11px] tracking-[0.2em] text-[#9c9384] sm:pt-1.5"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                aria-pressed={rating === n}
                className={`text-xl transition-colors duration-200 ${
                  n <= (hoverRating || rating) ? "text-[#e8d9ae]" : "text-[#4c4740]"
                }`}
              >
                ✦
              </button>
            ))}
          </div>
          <EditableText
            file="reviews"
            field="ratingHelper"
            value={content.ratingHelper}
            as="span"
            className="text-[10px] uppercase tracking-[0.15em] text-[#6f695c]"
          />
        </div>

        {/* Display name */}
        <EditableText
          file="reviews"
          field="nameLabel"
          value={content.nameLabel}
          as="p"
          className="text-[11px] tracking-[0.2em] text-[#9c9384] sm:pt-3"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={content.namePlaceholder}
          className="w-full border border-[#4c4740] bg-transparent px-4 py-3 text-[15px] text-[#e9e1cd] outline-none transition-colors duration-300 placeholder:text-[#6f695c] focus:border-[#cfc0a0]"
        />

        {/* Review */}
        <EditableText
          file="reviews"
          field="reviewLabel"
          value={content.reviewLabel}
          as="p"
          className="text-[11px] tracking-[0.2em] text-[#9c9384] sm:pt-3"
        />
        <div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value.slice(0, MAX_REVIEW_LENGTH))}
            placeholder={content.reviewPlaceholder}
            rows={5}
            className="w-full resize-none border border-[#4c4740] bg-transparent px-4 py-3 text-[15px] text-[#e9e1cd] outline-none transition-colors duration-300 placeholder:text-[#6f695c] focus:border-[#cfc0a0]"
          />
          <p className="mt-1.5 text-right text-[10px] tabular-nums text-[#6f695c]">
            {reviewText.length}/{MAX_REVIEW_LENGTH}
          </p>
        </div>

        {/* Photo */}
        <EditableText
          file="reviews"
          field="photoLabel"
          value={content.photoLabel}
          as="p"
          className="text-[11px] tracking-[0.2em] text-[#9c9384] sm:pt-3"
        />
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          {photoPreview ? (
            <div className="flex items-center gap-4 border border-[#4c4740] p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoPreview} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1 truncate text-[13px] text-[#c4bba8]">{photo?.name}</div>
              <button
                type="button"
                onClick={removePhoto}
                className="shrink-0 text-[11px] tracking-[0.1em] text-[#9c9384] transition-colors duration-300 hover:text-[#e07a5f]"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center gap-3 border border-dashed px-6 py-10 text-center transition-colors duration-300 ${
                dragActive ? "border-[#cfc0a0] bg-white/[0.03]" : "border-[#4c4740] hover:border-[#6f695c]"
              }`}
            >
              <CameraIcon className="h-6 w-6 text-[#9c9384]" />
              <EditableText
                file="reviews"
                field="uploadCta"
                value={content.uploadCta}
                as="p"
                className="text-[11px] tracking-[0.15em] text-[#c4bba8]"
              />
              <EditableText
                file="reviews"
                field="uploadHint"
                value={content.uploadHint}
                as="p"
                className="text-[10px] text-[#6f695c]"
              />
            </div>
          )}
          {photoError && <p className="mt-2 text-[12px] text-[#e07a5f]">{photoError}</p>}
        </div>

        {/* Consent + submit break out of the label column entirely */}
        <label className="flex cursor-pointer items-start gap-3 text-left text-[13px] leading-snug text-[#b9b09d] sm:col-start-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#b9a06a]"
          />
          <EditableText file="reviews" field="consentLabel" value={content.consentLabel} as="span" />
        </label>

        <div className="sm:col-start-2">
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full border border-[#6f695c] px-8 py-3.5 text-[12px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-12"
          >
            <EditableText file="reviews" field="submitLabel" value={content.submitLabel} as="span" />
          </button>
        </div>
      </form>

      <div className="mx-auto mt-14 flex max-w-xs items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-[#4c4740]" />
        <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
        <span className="h-px flex-1 bg-[#4c4740]" />
      </div>
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path
        d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.5" r="3.5" />
    </svg>
  );
}
