import Link from "next/link";
import Motes from "../../motes";
import { cormorant, garamond, rise } from "../../ui";

export const metadata = {
  title: "About — Lumina Drops",
  description: "What Lumina Drops is, and how a drop works.",
};

const FACTS = [
  { term: "LIMITED", detail: "Every drop is a fixed run. No restocks, ever." },
  { term: "SEASONAL", detail: "A few drops a year, each built around one night." },
  { term: "KEPT", detail: "Objects meant to outlast the evening they were made for." },
];

export default function AboutPage() {
  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 text-center lg:py-24">
      <Motes />

      <div className="relative w-full max-w-2xl">
        <h1
          className={`${cormorant.className} teaser-rise text-xl font-medium tracking-[0.3em] lg:text-3xl`}
          style={rise(0.1)}
        >
          ABOUT
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
          className={`${garamond.className} teaser-rise mt-14 text-lg leading-relaxed italic text-[#d6cdb8] lg:mt-20 lg:text-2xl`}
          style={rise(0.5)}
        >
          Objects for nights worth keeping.
        </p>

        <p
          className={`${garamond.className} teaser-rise mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-[#c4bba8] lg:mt-10 lg:text-lg`}
          style={rise(0.65)}
        >
          Lumina Drops makes small, deliberate collections for the hours after midnight. Each drop is
          a single boxed ritual — candles, glassware, and the small ceremonies that turn an ordinary
          evening into one you remember.
        </p>

        <dl className="teaser-rise mt-16 grid gap-10 sm:grid-cols-3 lg:mt-24" style={rise(0.85)}>
          {FACTS.map((fact) => (
            <div key={fact.term}>
              <dt className="text-[10px] tracking-[0.28em] text-[#cfc6b1] lg:text-xs">
                {fact.term}
              </dt>
              <dd
                className={`${garamond.className} mt-4 text-sm leading-relaxed text-[#b9b09d] lg:text-base`}
              >
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>

        <Link
          href="/drops"
          className="teaser-rise mt-16 inline-block border border-[#6f695c] px-9 py-3.5 text-[11px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-20 lg:px-12 lg:py-4 lg:text-sm"
          style={rise(1)}
        >
          SEE THE CURRENT DROP
        </Link>
      </div>
    </main>
  );
}
