"use client";

import { useEffect, useRef, type FocusEvent, type MouseEvent as ReactMouseEvent } from "react";
import { useEditMode } from "./EditModeContext";
import type { ContentName } from "@/lib/content";

type Props = {
  file: ContentName;
  field: string;
  /** An HTML string (paragraphs, <strong>/<em>, <ul>/<ol>, headings) rather
   * than plain text — use EditableText instead for single-line fields. */
  value: string;
  className?: string;
  displayValue?: string;
};

const TOOLBAR_BUTTONS: { label: string; title: string; command: string; arg?: string }[] = [
  { label: "B", title: "Bold", command: "bold" },
  { label: "I", title: "Italic", command: "italic" },
  { label: "• List", title: "Bullet list", command: "insertUnorderedList" },
  { label: "1. List", title: "Numbered list", command: "insertOrderedList" },
  { label: "Large", title: "Large text", command: "formatBlock", arg: "h3" },
  { label: "Normal", title: "Normal text", command: "formatBlock", arg: "p" },
  { label: "Left", title: "Align left", command: "justifyLeft" },
  { label: "Center", title: "Align center", command: "justifyCenter" },
  { label: "Right", title: "Align right", command: "justifyRight" },
  { label: "↵ Space", title: "Add extra space between lines", command: "insertHTML", arg: "<br><br>" },
];

/** Rich-text sibling to EditableText for the rare field that needs real
 * formatting (paragraph breaks, bold/italic, lists, a larger line) rather
 * than a single run of plain text. Stores/reads an HTML string, so the
 * public render side must use dangerouslySetInnerHTML — safe here because
 * only the trusted site admin ever writes this content. */
export default function EditableRichText({ file, field, value, className, displayValue }: Props) {
  const { isAdmin, textEdits, setText } = useEditMode();
  const ref = useRef<HTMLDivElement>(null);

  const key = `${file}:${field}`;
  const current = isAdmin ? (textEdits[key] ?? value) : value;
  const dirty = isAdmin && key in textEdits;

  // contentEditable's DOM owns the markup once mounted — only push `current`
  // into it when it actually diverges (an external reset, e.g. Discard All),
  // never on every render, or the caret would jump mid-keystroke.
  useEffect(() => {
    if (isAdmin && ref.current && ref.current.innerHTML !== current) {
      ref.current.innerHTML = current;
    }
  }, [isAdmin, current]);

  if (!isAdmin) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: displayValue ?? value }} />;
  }

  const exec = (command: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand("defaultParagraphSeparator", false, "p");
    document.execCommand(command, false, arg);
  };

  return (
    <div className="group relative">
      <div className="mb-2 hidden flex-wrap gap-1 group-focus-within:flex">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            // Prevents the mousedown from blurring/collapsing the selection in
            // the contentEditable below before the command can act on it.
            onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
            onClick={() => exec(btn.command, btn.arg)}
            className="border border-[#6f695c]/60 bg-[#141115] px-2 py-1 text-[10px] tracking-[0.1em] text-[#e9e1cd] transition-colors duration-200 hover:border-[#cfc0a0]"
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div
        ref={ref}
        className={`rich-text ${className ?? ""} lumina-editable${dirty ? " lumina-editable-dirty" : ""}`}
        contentEditable
        suppressContentEditableWarning
        title="Click to edit"
        onClick={(e: ReactMouseEvent<HTMLDivElement>) => e.stopPropagation()}
        onBlur={(e: FocusEvent<HTMLDivElement>) => {
          const next = e.currentTarget.innerHTML;
          if (next !== current) setText(file, field, next);
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            e.currentTarget.innerHTML = current;
            e.currentTarget.blur();
          }
        }}
      />
    </div>
  );
}
