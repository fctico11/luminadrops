"use client";

import { createContext, startTransition, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ContentName } from "@/lib/content";

export type PendingImage = { dataUrl: string };

export type SaveStatus = "idle" | "saving" | "success" | "error";

type TextEditKey = `${ContentName}:${string}`;

type EditModeState = {
  isAdmin: boolean;
  textEdits: Record<string, string>;
  imageEdits: Record<string, PendingImage>;
  /** Whole-array replacements (e.g. a policy section's rows), keyed
   * `${file}:${path}`. Used where rows can be added, removed or reordered, so
   * a pending edit can't point at an index that has since shifted. */
  listEdits: Record<string, string[]>;
  setText: (file: ContentName, field: string, value: string) => void;
  setList: (file: ContentName, field: string, value: string[]) => void;
  setImage: (path: string, image: PendingImage) => void;
  discardAll: () => void;
  dirtyCount: number;
  status: SaveStatus;
  errorMessage: string | null;
  save: () => Promise<void>;
};

const EditModeCtx = createContext<EditModeState | null>(null);

// Used wherever a component isn't wrapped in a real EditModeProvider (i.e. every
// public route) — lets page components render unmodified on both the public site
// and the /admin/edit/* preview without checking "am I in a provider" themselves.
const NOOP_STATE: EditModeState = {
  isAdmin: false,
  textEdits: {},
  imageEdits: {},
  listEdits: {},
  setText: () => {},
  setList: () => {},
  setImage: () => {},
  discardAll: () => {},
  dirtyCount: 0,
  status: "idle",
  errorMessage: null,
  save: async () => {},
};

export function useEditMode() {
  const ctx = useContext(EditModeCtx);
  return ctx ?? NOOP_STATE;
}

export function EditModeProvider({ isAdmin, children }: { isAdmin: boolean; children: ReactNode }) {
  const router = useRouter();
  const [textEdits, setTextEdits] = useState<Record<string, string>>({});
  const [imageEdits, setImageEdits] = useState<Record<string, PendingImage>>({});
  const [listEdits, setListEdits] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setText = useCallback((file: ContentName, field: string, value: string) => {
    const key: TextEditKey = `${file}:${field}`;
    setTextEdits((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }, []);

  const setList = useCallback((file: ContentName, field: string, value: string[]) => {
    const key: TextEditKey = `${file}:${field}`;
    setListEdits((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }, []);

  const setImage = useCallback((path: string, image: PendingImage) => {
    setImageEdits((prev) => ({ ...prev, [path]: image }));
    setStatus("idle");
  }, []);

  const discardAll = useCallback(() => {
    setTextEdits({});
    setImageEdits({});
    setListEdits({});
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const save = useCallback(async () => {
    setStatus("saving");
    setErrorMessage(null);
    try {
      const textEditPayload = Object.entries(textEdits).map(([key, value]) => {
        const idx = key.indexOf(":");
        return { file: key.slice(0, idx) as ContentName, field: key.slice(idx + 1), value };
      });
      const listEditPayload = Object.entries(listEdits).map(([key, value]) => {
        const idx = key.indexOf(":");
        return { file: key.slice(0, idx) as ContentName, field: key.slice(idx + 1), value };
      });
      const imageEditPayload = Object.entries(imageEdits).map(([path, image]) => ({
        path,
        dataUrl: image.dataUrl,
      }));

      const res = await fetch("/api/admin/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textEdits: textEditPayload, listEdits: listEditPayload, imageEdits: imageEditPayload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error ?? "Save failed.");
      }

      // Keep the just-saved values on screen (via local pending state) until the
      // refreshed server payload actually lands, so clearing pending state can't
      // flash the pre-edit content back in for a moment.
      startTransition(() => {
        router.refresh();
        setTextEdits({});
        setImageEdits({});
        setListEdits({});
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Save failed.");
    }
  }, [textEdits, imageEdits, listEdits, router]);

  const dirtyCount = Object.keys(textEdits).length + Object.keys(imageEdits).length + Object.keys(listEdits).length;

  const value = useMemo<EditModeState>(
    () => ({
      isAdmin,
      textEdits,
      imageEdits,
      listEdits,
      setText,
      setList,
      setImage,
      discardAll,
      dirtyCount,
      status,
      errorMessage,
      save,
    }),
    [isAdmin, textEdits, imageEdits, listEdits, setText, setList, setImage, discardAll, dirtyCount, status, errorMessage, save]
  );

  return <EditModeCtx.Provider value={value}>{children}</EditModeCtx.Provider>;
}
