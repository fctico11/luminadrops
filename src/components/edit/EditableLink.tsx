"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { useEditMode } from "./EditModeContext";

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps | "href"> & {
    children: ReactNode;
  };

/** Drop-in replacement for next/link's Link used anywhere it wraps editable text.
 * While admin-editing, navigation is suppressed so a click meant to focus the
 * editable text underneath doesn't route away and drop unsaved changes. */
export default function EditableLink({ onClick, ...props }: Props) {
  const { isAdmin } = useEditMode();

  return (
    <Link
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        if (isAdmin) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
    />
  );
}
