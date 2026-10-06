"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, trackOnce, type TrackParams } from "@/lib/tracking";

/** Sections worth knowing whether people actually reached (by element id). */
const SECTIONS: Record<string, string> = {
  "drop01-intro": "Intro",
  "drop01-steps": "WhatYouActuallyDo",
  "drop01-buybox": "BuyBox",
  "drop01-inside": "PeekInside",
};

const SCROLL_STEPS = [25, 50, 75, 90, 100];
const TIME_STEPS = [15, 30, 60, 120, 300];

const RESERVED = new Set(["track", "trackLabel", "trackSection"]);

function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function locationOf(el: HTMLElement) {
  return (
    el.closest<HTMLElement>("[data-track-section]")?.dataset.trackSection ??
    (el.closest("header") ? "Header" : el.closest("footer") ? "Footer" : el.closest("[role=dialog]") ? "Modal" : "Page")
  );
}

function onClick(e: MouseEvent) {
  const target = e.target as Element | null;
  if (!target?.closest || target.closest("[contenteditable='true']")) return;
  const el = target.closest<HTMLElement>("[data-track], a[href], button");
  if (!el || (el as HTMLButtonElement).disabled) return;

  const label = (el.dataset.trackLabel ?? el.getAttribute("aria-label") ?? el.textContent ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  const params: TrackParams = { label, location: locationOf(el) };
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key.startsWith("track") && !RESERVED.has(key) && value) params[lowerFirst(key.slice(5))] = value;
  }

  // A hand-named event wins; everything else falls into one of three
  // catch-alls so no click goes unseen.
  const named = el.dataset.track;
  if (named) return trackEvent(named, params);

  if (el instanceof HTMLAnchorElement) {
    const url = new URL(el.href, window.location.href);
    if (url.protocol === "mailto:" || url.protocol === "tel:") {
      return trackEvent("ContactLinkClicked", { ...params, destination: url.protocol });
    }
    const external = url.origin !== window.location.origin;
    return trackEvent(external ? "OutboundLinkClicked" : "LinkClicked", {
      ...params,
      destination: external ? url.host + url.pathname : url.pathname,
    });
  }
  trackEvent("ButtonClicked", params);
}

/** Mounted once in the root layout; renders nothing. Reports clicks, how far
 * down each page people scroll, how long they stay, and which key sections of
 * the product page actually came into view. */
export default function TrackingEvents() {
  const pathname = usePathname();

  useEffect(() => {
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - window.innerHeight;
        if (scrollable < 200) return;
        const pct = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
        for (const step of SCROLL_STEPS) {
          if (pct >= step - 1) trackOnce(`scroll-${step}`, "ScrolledPage", { percent: step });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let seconds = 0;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seconds += 1;
      if (TIME_STEPS.includes(seconds)) trackOnce(`time-${seconds}`, "TimeOnPage", { seconds });
    }, 1000);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const name = SECTIONS[entry.target.id];
          if (entry.isIntersecting && name) trackOnce(`section-${name}`, "SectionViewed", { section: name });
        }
      },
      { threshold: 0.35 }
    );
    // Sections mount a beat after the route does, so look again shortly.
    const find = window.setTimeout(() => {
      for (const id of Object.keys(SECTIONS)) {
        const node = document.getElementById(id);
        if (node) observer.observe(node);
      }
    }, 600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      window.clearInterval(timer);
      window.clearTimeout(find);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
