"use client";

import { useEditMode } from "./EditModeContext";

export default function SaveBar() {
  const { isAdmin, dirtyCount, status, errorMessage, save, discardAll } = useEditMode();

  if (!isAdmin) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0a0a0a]/95 px-6 py-3 text-sm text-[#f5f2ea] backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a227]">Admin editing</span>
        {dirtyCount > 0 ? (
          <span className="text-white/60">
            {dirtyCount} unsaved change{dirtyCount === 1 ? "" : "s"}
          </span>
        ) : (
          <span className="text-white/40">No changes</span>
        )}
        {status === "error" && errorMessage && <span className="text-red-400">{errorMessage}</span>}
        {status === "success" && <span className="text-emerald-400">Saved — pushed to GitHub.</span>}
      </div>

      <div className="flex items-center gap-2">
        {dirtyCount > 0 && (
          <button
            type="button"
            onClick={discardAll}
            className="border border-white/15 px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white"
          >
            Discard
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={dirtyCount === 0 || status === "saving"}
          className="bg-[#c9a227] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-black transition hover:bg-[#e0b830] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
