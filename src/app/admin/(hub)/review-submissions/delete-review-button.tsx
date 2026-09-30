"use client";

import { useTransition } from "react";

/** Unlike Approve/Reject/Reset (all reversible), this permanently removes
 * the review and its photo — worth a confirm, unlike those. */
export default function DeleteReviewButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Delete this review and its photo permanently? This can't be undone.")) return;
        startTransition(() => action());
      }}
      className="border border-red-500/40 px-3 py-1.5 text-xs uppercase tracking-wider text-red-500 transition hover:border-red-500/70 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
