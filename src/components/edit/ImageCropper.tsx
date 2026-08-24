"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";

type Props = {
  file: File;
  exportWidth: number;
  exportHeight: number;
  onCancel: () => void;
  onConfirm: (dataUrl: string) => void;
};

const FRAME_WIDTH = 320;

/** Fixed-aspect crop tool: pans the source image behind a frame that matches the
 * exact aspect ratio the site renders it at, so what the admin sees is what ships. */
export default function ImageCropper({ file, exportWidth, exportHeight, onCancel, onConfirm }: Props) {
  const aspect = exportWidth / exportHeight;
  const frameHeight = FRAME_WIDTH / aspect;
  const displayScale = FRAME_WIDTH / exportWidth;

  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Object-URL creation and revocation must stay coupled to the same effect run:
  // if creation and revocation live in separate effects, React's dev-mode
  // mount->cleanup->mount double-invoke revokes the URL a second effect run is
  // still trying to load, and the image never resolves.
  useEffect(() => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const scale = Math.max(exportWidth / nw, exportHeight / nh);
      const dw = nw * scale;
      const dh = nh * scale;
      setImgUrl(url);
      setNatural({ w: nw, h: nh });
      setOffset({ x: (exportWidth - dw) / 2, y: (exportHeight - dh) / 2 });
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, exportWidth, exportHeight]);

  if (!natural || !imgUrl) {
    return createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-6">
        <p className="text-sm text-white/70">Loading image…</p>
      </div>,
      document.body
    );
  }

  const baseScale = Math.max(exportWidth / natural.w, exportHeight / natural.h);
  const dw = natural.w * baseScale;
  const dh = natural.h * baseScale;

  function clamp(next: { x: number; y: number }) {
    const minX = exportWidth - dw;
    const minY = exportHeight - dh;
    return {
      x: Math.min(0, Math.max(minX, next.x)),
      y: Math.min(0, Math.max(minY, next.y)),
    };
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: offset.x, origY: offset.y };
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const dx = (e.clientX - dragRef.current.startX) / displayScale;
    const dy = (e.clientY - dragRef.current.startY) / displayScale;
    setOffset(clamp({ x: dragRef.current.origX + dx, y: dragRef.current.origY + dy }));
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function handleConfirm() {
    if (!imgUrl) return;
    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, offset.x, offset.y, dw, dh);
      onConfirm(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.src = imgUrl;
  }

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-6" onClick={onCancel}>
      <div
        className="w-full max-w-sm border border-white/10 bg-[#141115] p-6 text-center text-[#e9e1cd]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a227]">Position image</p>
        <p className="mt-2 text-xs text-white/50">
          Drag to reposition. This is exactly how it will appear on the site.
        </p>

        <div
          className="relative mx-auto mt-5 touch-none overflow-hidden border border-white/15"
          style={{ width: FRAME_WIDTH, height: frameHeight, cursor: "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: offset.x * displayScale,
              top: offset.y * displayScale,
              width: dw * displayScale,
              height: dh * displayScale,
              maxWidth: "none",
              userSelect: "none",
            }}
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-white/70 hover:border-white/40 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-[#c9a227] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#e0b830]"
          >
            Use this crop
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
