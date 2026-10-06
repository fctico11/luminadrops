"use client";

import { useEffect, useRef } from "react";
import { useEditMode } from "./EditModeContext";
import EditableText from "./EditableText";
import type { ContentName } from "@/lib/content";

type Props = {
  file: ContentName;
  /** Dot-path to the string array, e.g. "sections.2.body". */
  field: string;
  items: string[];
  /** Classes for each row's text (the same element visitors see). */
  className?: string;
  /** Wrapper classes for the whole list. */
  listClassName?: string;
  addLabel?: string;
};

/** A list of text rows that visitors just read, but that admins can edit,
 * add to, delete from and reorder. Changes are staged as one whole-array
 * edit (see `listEdits` in EditModeContext) and saved with everything else. */
export default function EditableList({ file, field, items, className, listClassName, addLabel = "Add a row" }: Props) {
  const { isAdmin, listEdits, setList } = useEditMode();
  const listRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<number | null>(null);

  const key = `${file}:${field}`;
  const rows = listEdits[key] ?? items;
  const dirty = key in listEdits;

  // A freshly added row opens ready to type into.
  useEffect(() => {
    if (pendingFocus.current === null) return;
    const el = listRef.current?.querySelectorAll<HTMLElement>("[contenteditable]")[pendingFocus.current];
    pendingFocus.current = null;
    el?.focus();
  }, [rows.length]);

  if (!isAdmin) {
    return (
      <div className={listClassName}>
        {items.map((text, j) => (
          <p key={j} className={className}>
            {text}
          </p>
        ))}
      </div>
    );
  }

  const commit = (next: string[]) => setList(file, field, next);
  const update = (j: number, text: string) => commit(rows.map((r, idx) => (idx === j ? text : r)));
  const remove = (j: number) => commit(rows.filter((_, idx) => idx !== j));
  const move = (j: number, dir: -1 | 1) => {
    const to = j + dir;
    if (to < 0 || to >= rows.length) return;
    const next = [...rows];
    [next[j], next[to]] = [next[to], next[j]];
    commit(next);
  };
  const add = () => {
    commit([...rows, ""]);
    pendingFocus.current = rows.length;
  };

  return (
    <div ref={listRef} className={listClassName}>
      {rows.map((text, j) => (
        <div key={j} className="group/row flex items-start gap-2">
          <EditableText
            file={file}
            field={`${field}.${j}`}
            value={text}
            as="p"
            className={`min-w-0 flex-1 ${className ?? ""}`}
            onCommit={(next) => update(j, next)}
            dirty={dirty}
            placeholder="New row. Click to type."
          />
          <div className="flex shrink-0 gap-1 pt-0.5 opacity-40 transition-opacity focus-within:opacity-100 group-hover/row:opacity-100">
            <RowButton label="Move up" disabled={j === 0} onClick={() => move(j, -1)}>
              ↑
            </RowButton>
            <RowButton label="Move down" disabled={j === rows.length - 1} onClick={() => move(j, 1)}>
              ↓
            </RowButton>
            <RowButton label="Delete row" onClick={() => remove(j)} danger>
              ✕
            </RowButton>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full border border-dashed border-[#c9a227]/50 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[#c9a227] transition hover:border-[#c9a227] hover:bg-[#c9a227]/10"
      >
        + {addLabel}
      </button>
    </div>
  );
}

function RowButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-6 w-6 items-center justify-center border border-white/15 text-xs text-white/70 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? "hover:border-red-400 hover:text-red-300" : "hover:border-[#c9a227]"
      }`}
    >
      {children}
    </button>
  );
}
