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

      {pendingFile && (
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
      )}
    </div>
  );
}
