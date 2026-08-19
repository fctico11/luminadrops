import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Motes from "./motes";
import { cormorant, garamond, rise } from "./ui";
import WaitlistButton from "./waitlist";

const TILES = [
  { src: "/drops/midnight-margarita/moonstone.svg", alt: "Moonstone resting on dark stone" },
  { src: "/drops/midnight-margarita/candle.svg", alt: "Cream pillar candle" },
  { src: "/drops/midnight-margarita/glass.svg", alt: "Ribbed glass tumbler in low light" },
  { src: "/drops/midnight-margarita/envelope.svg", alt: "Envelope sealed with black wax" },
];

const STATS = ["100 BOXES", "ONE DROP", "NO RESTOCKS"];

export default function Teaser() {
  return (
    <main className="flex flex-1 justify-center bg-[#141115]">
      <div className="grain relative w-full overflow-hidden bg-[#141115] text-[#e9e1cd]">
        <Motes />

        {/* Header */}
        <header className="teaser-rise flex items-center justify-between px-6 py-5 sm:px-10" style={rise(0.05)}>
          <Link
            href="/home"
            className={`${cormorant.className} text-sm font-medium tracking-[0.35em] transition-colors duration-500 hover:text-[#fff6e0] lg:text-lg`}
          >
            LUMINA DROPS
          </Link>
          <span className="text-[10px] tracking-[0.3em] text-[#b9b09d] lg:text-xs">DROP 01</span>
        </header>

        {/* Blank space where the teaser video will go */}
        <div className="teaser-rise aspect-video max-h-[62vh] w-full bg-black" style={rise(0.15)} aria-hidden />

        <div className="relative px-8 pt-14 text-center lg:pt-24">
          {/* candlelight halo behind the headline */}
          <div
            className="teaser-glow pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full lg:h-[28rem] lg:w-[28rem]"
            style={{ background: "radial-gradient(circle, rgba(240,200,120,0.16), transparent 68%)" }}
            aria-hidden
          />

          <h1
            className={`${cormorant.className} teaser-rise teaser-text-glow relative text-[27px] font-medium tracking-[0.18em] sm:text-3xl lg:text-6xl`}
            style={rise(0.3)}
          >
            SOMETHING IS COMING.
          </h1>
          <p
            className={`${garamond.className} teaser-rise relative mt-3 text-lg italic text-[#d6cdb8] lg:mt-5 lg:text-2xl`}
            style={rise(0.45)}
          >
            September 2026
          </p>

          <WaitlistButton
            cormorantClass={cormorant.className}
            garamondClass={garamond.className}
            buttonClassName="teaser-rise mt-9 border border-[#6f695c] px-8 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-12 lg:px-12 lg:py-4 lg:text-sm"
            buttonStyle={rise(0.6)}
          />

          {/* Star divider */}
          <div className="teaser-rise mx-auto mt-12 flex max-w-xs items-center gap-5 lg:mt-20 lg:max-w-md" style={rise(0.75)} aria-hidden>
            <span className="h-px flex-1 bg-[#4c4740]" />
            <span className="teaser-twinkle text-[10px] text-[#cfc6b1] lg:text-sm">✦</span>
            <span className="h-px flex-1 bg-[#4c4740]" />
          </div>

          <h2
            className={`${cormorant.className} teaser-rise mt-11 text-lg font-medium tracking-[0.3em] lg:mt-16 lg:text-3xl`}
            style={rise(0.9)}
          >
            AN EVERLONG MIDNIGHT
          </h2>

          <p className={`${garamond.className} teaser-rise mt-6 text-[15px] text-[#c4bba8] lg:mt-9 lg:text-xl`} style={rise(1)}>
            Some evenings deserve to last a little longer.
          </p>
          <p
            className={`${garamond.className} teaser-rise mx-auto mt-4 max-w-[320px] text-[15px] leading-relaxed text-[#c4bba8] lg:mt-5 lg:max-w-xl lg:text-xl`}
            style={rise(1.1)}
          >
            The Midnight Margarita Club is a limited ritual box made for exactly those nights.
          </p>

          {/* Stats */}
          <div
            className="teaser-rise mt-11 flex items-center justify-center text-[10px] tracking-[0.2em] text-[#cfc6b1] sm:tracking-[0.28em] lg:mt-16 lg:text-sm"
            style={rise(1.25)}
          >
            {STATS.map((label, i) => (
              <Fragment key={label}>
                {i > 0 && <span className="h-4 w-px bg-[#4c4740] lg:h-5" aria-hidden />}
                <span className="teaser-stat cursor-default whitespace-nowrap px-2 sm:px-5">
                  {label.split("").map((ch, j) => (
                    <span
                      key={j}
                      className="stat-ch"
                      style={{ "--ch-d": `${j * 28}ms` } as CSSProperties}
                    >
                      {ch === " " ? " " : ch}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Image strip */}
        <div className="mt-10 grid grid-cols-4 gap-[6px] lg:mt-16">
          {TILES.map((tile, i) => (
            <div key={tile.src} className="teaser-rise relative aspect-[4/5] overflow-hidden" style={rise(1.4 + i * 0.12)}>
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                className="object-cover transition-[transform,filter] duration-1000 hover:scale-105 hover:brightness-110"
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="pb-12 pt-10 text-center lg:pb-20 lg:pt-16">
          <p className="teaser-rise text-[10px] tracking-[0.28em] text-[#b9b09d] lg:text-sm" style={rise(1.9)}>
            DROP No. 01
          </p>
          <button
            type="button"
            className="teaser-rise mt-6 border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-9 lg:px-12 lg:py-4 lg:text-sm"
            style={rise(2)}
          >
            COMING SOON
          </button>
        </footer>
      </div>
    </main>
  );
}
