"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/** Thumbnail that opens a full-size lightbox on click, with a Download
 * button. Downloading fetches the blob and clicks a synthetic local-object
 * link rather than a plain <a download> — the photo lives on
 * *.public.blob.vercel-storage.com, a different origin, and browsers ignore
 * the `download` attribute on cross-origin links (it would just navigate
 * there instead of saving). */
export default function ReviewPhoto({ url, name }: { url: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const filename = url.split("/").pop() || `${name.replace(/\s+/g, "-").toLowerCase()}-photo.jpg`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Expand ${name}'s photo`}
        className="relative h-20 w-20 shrink-0 overflow-hidden border border-white/10 transition hover:border-[#c9a227]/60"
      >
        <Image src={url} alt="" fill sizes="80px" className="object-cover" />
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-black/85 p-6"
            onClick={() => setOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[75vh] max-w-[90vw] cursor-default border border-white/10 object-contain"
            />
            <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="border border-[#c9a227]/40 bg-black/40 px-4 py-2 text-xs uppercase tracking-wider text-[#c9a227] transition hover:border-[#c9a227]/70 hover:bg-[#c9a227]/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {downloading ? "Downloading..." : "Download"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="border border-white/20 bg-black/40 px-4 py-2 text-xs uppercase tracking-wider text-white/80 transition hover:border-white/50 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
