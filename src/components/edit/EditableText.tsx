"use client";

import { type CSSProperties, type ElementType, type FocusEvent, type KeyboardEvent } from "react";
import { useEditMode } from "./EditModeContext";
import type { ContentName } from "@/lib/content";

type Props = {
  file: ContentName;
  field: string;
  value: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Pre-computed string for the signed-out/display view only (e.g. a template
   * with a placeholder substituted). Admin edit mode always shows/edits the raw
   * `value` so a save can't bake a one-off substitution into the template. */
  displayValue?: string;
};

export default function EditableText({ file, field, value, as: Tag = "span", className, style, displayValue }: Props) {
  const { isAdmin, textEdits, setText } = useEditMode();

  if (!isAdmin) {
    const Plain = Tag;
    return (
      <Plain className={className} style={style}>
        {displayValue ?? value}
      </Plain>
    );
  }

  const key = `${file}:${field}`;
  const current = textEdits[key] ?? value;
  const dirty = key in textEdits;
  const Editable = Tag;

  return (
    <Editable
      className={`${className ?? ""} lumina-editable${dirty ? " lumina-editable-dirty" : ""}`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      title="Click to edit"
      onBlur={(e: FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.textContent ?? "";
        if (next !== current) setText(file, field, next);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
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
    </Editable>
  );
}
