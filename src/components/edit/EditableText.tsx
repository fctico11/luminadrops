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
  /** For text that lives inside a list the editor can reorder (see
   * EditableList): the parent owns the value and receives edits here instead
   * of them being staged per-field in the edit context. */
  onCommit?: (next: string) => void;
  dirty?: boolean;
  /** Shown (admin only) while the text is empty. */
  placeholder?: string;
};

/** Reads an edited element back to plain text. `textContent` would silently
 * drop the <br>/<div> the browser inserts for Shift+Enter, so this walks the
 * nodes instead (and, unlike `innerText`, ignores CSS like text-transform —
 * saved copy must stay exactly as typed). */
function readText(root: HTMLElement): string {
  let out = "";
  const walk = (node: Node) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        out += child.nodeValue ?? "";
      } else if (child.nodeName === "BR") {
        out += "\n";
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const block = child.nodeName === "DIV" || child.nodeName === "P";
        if (block && out && !out.endsWith("\n")) out += "\n";
        walk(child);
      }
    });
  };
  walk(root);
  // Chrome parks a placeholder <br> at the end of a line being edited.
  return out.replace(/\n+$/, "");
}

/** Only elements that already render "\n" as a line break (white-space: pre-*,
 * e.g. whitespace-pre-line) can hold one, so only they take Shift+Enter. */
function keepsLineBreaks(el: HTMLElement) {
  return getComputedStyle(el).whiteSpace.startsWith("pre");
}

export default function EditableText({ file, field, value, as: Tag = "span", className, style, displayValue, onCommit, dirty: dirtyProp, placeholder }: Props) {
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
  const current = onCommit ? value : (textEdits[key] ?? value);
  const dirty = onCommit ? Boolean(dirtyProp) : key in textEdits;
  const Editable = Tag;

  return (
    <Editable
      className={`${className ?? ""} lumina-editable${dirty ? " lumina-editable-dirty" : ""}${placeholder ? " empty:before:italic empty:before:text-white/35 empty:before:content-[attr(data-placeholder)]" : ""}`}
      data-placeholder={placeholder}
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
        const el = e.currentTarget;
        const next = keepsLineBreaks(el) ? readText(el) : (el.textContent ?? "");
        // Shift+Enter leaves <br>/<div> nodes behind; collapse back to a single
        // text node so React's re-render of `{current}` can't duplicate them.
        if (el.childElementCount > 0) el.textContent = next;
        if (next !== current) (onCommit ?? ((v: string) => setText(file, field, v)))(next);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLElement>) => {
        // Stopped for the same reason as the click above — without it, typing
        // a space or Enter while editing bubbles up as a native keyboard
        // activation on an ancestor <button> (e.g. Space "clicking" it),
        // even though focus never left this text.
        e.stopPropagation();
        // Shift+Enter falls through to the browser's own line break (see
        // readText) on elements that can show one.
        if (e.key === "Enter" && !(e.shiftKey && keepsLineBreaks(e.currentTarget))) {
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
