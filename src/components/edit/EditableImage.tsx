"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useEditMode } from "./EditModeContext";
import ImageCropper from "./ImageCropper";
import type { ContentName } from "@/lib/content";

type Props = {
  file: ContentName;
  field: string;
  src: string;
  alt: string;
  className?: string;
  exportWidth?: number;
  exportHeight?: number;
  /** "overlay" (default) shows the replace control as a centered hover overlay on the
   * image itself — fine when nothing else sits on top of it. "above" renders the control
   * as its own box before the image instead, for images with editable text layered on top,
   * so that text stays clickable instead of being covered by the hover overlay. */
  controlPlacement?: "overlay" | "above";
};

/** Replaces a static site image. Always exports at a fixed aspect via ImageCropper,
 * so a mismatched upload can't ever squish or misalign — the admin crops to fit
 * before it's staged as a pending change. */
export default function EditableImage({
  file,
  field,
  src,
  alt,
  className,
  exportWidth = 960,
  exportHeight = 1200,
  controlPlacement = "overlay",
}: Props) {
  const { isAdmin, textEdits, imageEdits, setText, setImage } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  if (!isAdmin) {
    return <Image src={src} alt={alt} fill className={className} />;
  }

  const currentPath = textEdits[`${file}:${field}`] ?? src;
  const pendingImage = imageEdits[currentPath];
  const displaySrc = pendingImage?.dataUrl ?? currentPath;
  const dirty = Boolean(pendingImage);

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) setPendingFile(f);
      }}
    />
  );

  const cropper = pendingFile && (
    <ImageCropper
      file={pendingFile}
      exportWidth={exportWidth}
      exportHeight={exportHeight}
      onCancel={() => setPendingFile(null)}
      onConfirm={(dataUrl) => {
        const newPath = currentPath.replace(/\.[^./]+$/, ".jpg");
        setImage(newPath, { dataUrl });
        if (newPath !== currentPath) setText(file, field, newPath);
        setPendingFile(null);
      }}
    />
  );

  if (controlPlacement === "above") {
    return (
      <>
        <div className="relative z-20 mb-3 flex justify-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="border border-dashed border-[#6f695c] bg-[#141115] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#e9e1cd] hover:border-[#e9e1cd] hover:bg-white/10"
          >
            Replace image
          </button>
          {fileInput}
        </div>

        <div className={`lumina-editable-image absolute inset-0${dirty ? " lumina-editable-image-dirty" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displaySrc} alt={alt} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />
        </div>

        {cropper}
      </>
    );
  }

  return (
    <div className={`lumina-editable-image absolute inset-0${dirty ? " lumina-editable-image-dirty" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={displaySrc} alt={alt} className={`absolute inset-0 h-full w-full ${className ?? ""}`} />

      <div className="lumina-editable-image-overlay">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border border-[#e9e1cd] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#e9e1cd] hover:bg-white/10"
        >
          Replace image
        </button>
      </div>

      {fileInput}
      {cropper}
    </div>
  );
}
