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
  setText: (file: ContentName, field: string, value: string) => void;
  setImage: (path: string, image: PendingImage) => void;
  discardAll: () => void;
  dirtyCount: number;
  status: SaveStatus;
  errorMessage: string | null;
  save: () => Promise<void>;
};

const EditModeCtx = createContext<EditModeState | null>(null);

export function useEditMode() {
  const ctx = useContext(EditModeCtx);
  if (!ctx) {
    throw new Error("useEditMode must be used within an EditModeProvider (mount <EditRoot> above this component)");
  }
  return ctx;
}

export function EditModeProvider({ isAdmin, children }: { isAdmin: boolean; children: ReactNode }) {
  const router = useRouter();
  const [textEdits, setTextEdits] = useState<Record<string, string>>({});
  const [imageEdits, setImageEdits] = useState<Record<string, PendingImage>>({});
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setText = useCallback((file: ContentName, field: string, value: string) => {
    const key: TextEditKey = `${file}:${field}`;
    setTextEdits((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
  }, []);

  const setImage = useCallback((path: string, image: PendingImage) => {
    setImageEdits((prev) => ({ ...prev, [path]: image }));
    setStatus("idle");
  }, []);

  const discardAll = useCallback(() => {
    setTextEdits({});
    setImageEdits({});
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
      const imageEditPayload = Object.entries(imageEdits).map(([path, image]) => ({
        path,
        dataUrl: image.dataUrl,
      }));

      const res = await fetch("/api/admin/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textEdits: textEditPayload, imageEdits: imageEditPayload }),
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
      });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Save failed.");
    }
  }, [textEdits, imageEdits, router]);

  const dirtyCount = Object.keys(textEdits).length + Object.keys(imageEdits).length;

  const value = useMemo<EditModeState>(
    () => ({
      isAdmin,
      textEdits,
      imageEdits,
      setText,
      setImage,
      discardAll,
      dirtyCount,
      status,
      errorMessage,
      save,
    }),
    [isAdmin, textEdits, imageEdits, setText, setImage, discardAll, dirtyCount, status, errorMessage, save]
  );

  return <EditModeCtx.Provider value={value}>{children}</EditModeCtx.Provider>;
}
