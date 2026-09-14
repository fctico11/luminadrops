"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/** Pages whose header starts transparent, floating over a full-bleed hero
 * video, and fills solid once scrolled past it. Every other page keeps the
 * normal always-solid header — and even here, only at desktop widths;
 * mobile always gets the normal solid header regardless of page, since
 * there's no room for a floating-over-video treatment at that size. */
const FLOAT_OVER_HERO_PATHS = ["/drop01"];

// Tailwind's `lg:` breakpoint — kept in sync with the `lg:` prefix used below.
const DESKTOP_QUERY = "(min-width: 1024px)";

export default function HeaderShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const floatOverHero = FLOAT_OVER_HERO_PATHS.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (!floatOverHero) return;
    const mql = window.matchMedia(DESKTOP_QUERY);
    const onMqlChange = () => setIsDesktop(mql.matches);
    onMqlChange();
    mql.addEventListener("change", onMqlChange);

    // The hero video is a full viewport tall at desktop (lg:h-screen), so
    // "scrolled past it" is approximately one screen height — cheaper and
    // just as reliable as measuring the video element itself.
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      mql.removeEventListener("change", onMqlChange);
      window.removeEventListener("scroll", onScroll);
    };
  }, [floatOverHero]);

  const floatingNow = floatOverHero && isDesktop;

  // .float-header-* (globals.css, !important) rather than inline styles or
  // Tailwind's border-white/10 — Tailwind's preflight sets a border-color on
  // every element by default, which beats a plain inline style override.
  const colorClass = !floatOverHero ? "border-white/10" : floatingNow && !scrolled ? "float-header-transparent" : "float-header-filled";

  return (
    <header
      className={`flex flex-col items-center gap-4 border-b px-6 py-5 sm:flex-row sm:justify-between sm:gap-0 sm:px-10 ${colorClass} ${
        floatOverHero ? "lg:fixed lg:inset-x-0 lg:top-0 lg:z-30 lg:transition-colors lg:duration-500" : ""
      }`}
    >
      {children}
    </header>
  );
}
