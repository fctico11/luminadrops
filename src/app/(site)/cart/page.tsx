import Link from "next/link";
import Motes from "../../motes";
import { cormorant, garamond, rise } from "../../ui";

export const metadata = {
  title: "Bag — Lumina Drops",
  description: "Your Lumina Drops bag.",
};

export default function CartPage() {
  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center lg:py-28">
      <Motes />

      <div className="relative w-full max-w-xl">
        <h1
          className={`${cormorant.className} teaser-rise text-xl font-medium tracking-[0.3em] lg:text-3xl`}
          style={rise(0.1)}
        >
          YOUR BAG
        </h1>

        <div
          className="teaser-rise mx-auto mt-10 flex max-w-xs items-center gap-5 lg:mt-14 lg:max-w-md"
          style={rise(0.3)}
          aria-hidden
        >
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[10px] text-[#cfc6b1] lg:text-sm">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        <p
          className={`${garamond.className} teaser-rise mt-14 text-lg italic text-[#d6cdb8] lg:mt-20 lg:text-2xl`}
          style={rise(0.5)}
        >
          Your bag is empty.
        </p>

        <p
          className={`${garamond.className} teaser-rise mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg`}
          style={rise(0.65)}
        >
          Nothing is live for purchase yet. Drop No. 01 opens in September 2026 — join the waitlist
          and you will know first.
        </p>

        <Link
          href="/"
          className="teaser-rise mt-12 inline-block border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-16 lg:px-12 lg:py-4 lg:text-sm"
          style={rise(0.85)}
        >
          JOIN THE WAITLIST
        </Link>
      </div>
    </main>
  );
}
