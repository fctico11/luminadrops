"use client";

import type { ReactNode } from "react";

type Props = {
  targetId: string;
  className: string;
  children: ReactNode;
};

/** Opens a DropdownModal instantly, with no scroll, by programmatically
 * clicking its trigger element (the accordion row rendered elsewhere on the
 * page) — same overlay, just invoked from a second entry point. */
export default function OpenModalButton({ targetId, className, children }: Props) {
  return (
    <button type="button" onClick={() => document.getElementById(targetId)?.click()} className={className}>
      {children}
    </button>
  );
}
