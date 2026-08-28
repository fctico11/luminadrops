"use client";

import { useEffect, useRef, useState } from "react";

// One-time manual upload to Vercel Blob — see project notes for how to
// replace this if a new cut of the header video is ever needed.
const HERO_VIDEO_URL = "https://4crfi1phembmhxzs.public.blob.vercel-storage.com/hero-compressed.mp4";

type FullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullscreen?: () => void;
};

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const enterFullscreen = () => {
    const video = videoRef.current as FullscreenVideo | null;
    if (!video) return;
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
  };

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setEnded(false);
  };

  // The browser's back/forward cache can restore this page exactly as it was
  // left — including a frozen, already-ended video — without React ever
  // remounting the component. Force a fresh play whenever that happens.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) replay();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        ref={videoRef}
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        playsInline
        onEnded={() => setEnded(true)}
        className="h-full w-full object-contain"
      />

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {ended && (
          <button
            type="button"
            onClick={replay}
            aria-label="Replay video"
            className="flex h-9 w-9 items-center justify-center border border-[#6f695c]/70 bg-black/40 text-[#e9e1cd] backdrop-blur-sm transition-colors duration-300 hover:border-[#cfc0a0] hover:bg-black/60"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h5M20 20v-5h-5M4.5 15a8 8 0 0 0 14.5 2.5M19.5 9A8 8 0 0 0 5 6.5"
              />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="flex h-9 w-9 items-center justify-center border border-[#6f695c]/70 bg-black/40 text-[#e9e1cd] backdrop-blur-sm transition-colors duration-300 hover:border-[#cfc0a0] hover:bg-black/60"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path strokeLinecap="round" d="M16 9l5 6M21 9l-5 6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path strokeLinecap="round" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={enterFullscreen}
          aria-label="Enlarge video"
          className="flex h-9 w-9 items-center justify-center border border-[#6f695c]/70 bg-black/40 text-[#e9e1cd] backdrop-blur-sm transition-colors duration-300 hover:border-[#cfc0a0] hover:bg-black/60"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 9V4h5M4 4l6 6M15 4h5v5M20 4l-6 6M4 15v5h5M4 20l6-6M15 20h5v-5M20 20l-6-6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
