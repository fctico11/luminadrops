"use client";

import { type CSSProperties, type FocusEvent, type KeyboardEvent } from "react";
import { useEditMode } from "./EditModeContext";
import type { ContentName } from "@/lib/content";

type Props = {
  file: ContentName;
  field: string;
  value: string;
  className?: string;
};

/** Same edit behavior as EditableText, but the signed-out view renders per-character
 * spans for the hover-ripple animation — markup EditableText's plain string prop
 * can't express, so this needs its own small client component. */
export default function AnimatedStatText({ file, field, value, className }: Props) {
  const { isAdmin, textEdits, setText } = useEditMode();

  if (!isAdmin) {
    return (
      <span className={className}>
        {value.split("").map((ch, j) => (
          <span key={j} className="stat-ch" style={{ "--ch-d": `${j * 28}ms` } as CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    );
  }

  const key = `${file}:${field}`;
  const current = textEdits[key] ?? value;
  const dirty = key in textEdits;

  return (
    <span
      className={`${className ?? ""} lumina-editable${dirty ? " lumina-editable-dirty" : ""}`}
      contentEditable
      suppressContentEditableWarning
      title="Click to edit"
      onBlur={(e: FocusEvent<HTMLSpanElement>) => {
        const next = e.currentTarget.textContent ?? "";
        if (next !== current) setText(file, field, next);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          e.currentTarget.textContent = current;
          e.currentTarget.blur();
        }
      }}
    >
      {current}
    </span>
  );
}
