import Image from "next/image";
import Link from "next/link";
import Motes from "../../motes";
import { cormorant, garamond, rise } from "../../ui";

export const metadata = {
  title: "Drops — Lumina Drops",
  description: "The current Lumina Drops release.",
};

export default function DropsPage() {
  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 text-center lg:py-24">
      <Motes />

      <div className="relative w-full max-w-3xl">
        <p
          className="teaser-rise text-[10px] tracking-[0.28em] text-[#cfc6b1] lg:text-sm"
          style={rise(0.1)}
        >
          CURRENT DROP
        </p>

        <div
          className="teaser-rise relative mt-10 overflow-hidden border border-[#4c4740] lg:mt-14"
          style={rise(0.3)}
        >
          <Image
            src="/drops/midnight-margarita/candle.svg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="scale-125 object-cover opacity-30"
          />
          {/* keeps the artwork behind the copy rather than competing with it */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#141115]/85 via-[#141115]/70 to-[#141115]/90"
            aria-hidden
          />

          <div className="relative flex flex-col items-center px-6 py-20 lg:py-28">
            <p className="text-[10px] tracking-[0.28em] text-[#b9b09d] lg:text-xs">DROP No. 01</p>

            <h1
              className={`${cormorant.className} mt-5 text-2xl leading-[1.3] font-medium tracking-[0.2em] sm:text-3xl lg:text-5xl`}
            >
              THE MIDNIGHT
              <br />
              MARGARITA CLUB
            </h1>

            <p className={`${garamond.className} mt-5 text-base italic text-[#d6cdb8] lg:text-xl`}>
              September 2026
            </p>

            <Link
              href="/"
              className="mt-10 border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-12 lg:px-12 lg:py-4 lg:text-sm"
            >
              DISCOVER
            </Link>
          </div>
        </div>

        <p
          className={`${garamond.className} teaser-rise mt-12 text-[15px] italic text-[#b9b09d] lg:mt-16 lg:text-lg`}
          style={rise(0.5)}
        >
          One drop at a time. When it closes, it closes for good.
        </p>
      </div>
    </main>
  );
}
