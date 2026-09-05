"use client";

import { type CSSProperties, type ElementType, type FocusEvent, type KeyboardEvent, type MouseEvent } from "react";
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
      // Stops a click meant to place a cursor for editing from also bubbling
      // up to an ancestor's onClick (e.g. a button that opens a modal, or
      // toggles state) — the two need to stay clearly separate: clicking the
      // text edits it; clicking elsewhere on the ancestor still fires its
      // own behavior normally.
      onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}
      onBlur={(e: FocusEvent<HTMLElement>) => {
        const next = e.currentTarget.textContent ?? "";
        if (next !== current) setText(file, field, next);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        // Stopped for the same reason as the click above — without it, typing
        // a space or Enter while editing bubbles up as a native keyboard
        // activation on an ancestor <button> (e.g. Space "clicking" it),
        // even though focus never left this text.
        e.stopPropagation();
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
