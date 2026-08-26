import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";
import Motes from "../../motes";
import { cormorant, rise } from "../../ui";

export const metadata = {
  title: "Lumina Drops",
  description: "Objects for nights worth keeping.",
};

export default function HomePage() {
  const content = getContent("home");

  return (
    <main className="grain relative flex flex-1 flex-col items-center justify-center px-6 py-20 text-center lg:py-28">
      <Motes />

      {/* candlelight halo behind the wordmark */}
      <div
        className="teaser-glow pointer-events-none absolute top-1/4 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/4 rounded-full lg:h-[34rem] lg:w-[34rem]"
        style={{ background: "radial-gradient(circle, rgba(240,200,120,0.18), transparent 68%)" }}
        aria-hidden
      />

      <div className="relative">
        <span
          className="teaser-rise teaser-twinkle inline-block text-sm text-[#cfc6b1] lg:text-base"
          style={rise(0.1)}
          aria-hidden
        >
          ✦
        </span>

        <h1
          className={`${cormorant.className} teaser-rise teaser-text-glow mt-6 text-5xl leading-[1.1] font-medium tracking-[0.18em] sm:text-6xl lg:mt-8 lg:text-8xl`}
          style={rise(0.25)}
        >
          <EditableText file="home" field="wordmarkLine1" value={content.wordmarkLine1} as="span" />
          <br />
          <EditableText file="home" field="wordmarkLine2" value={content.wordmarkLine2} as="span" />
        </h1>

        <span
          className="teaser-rise mt-8 inline-block text-[11px] text-[#cfc6b1] lg:mt-10 lg:text-xs"
          style={rise(0.45)}
          aria-hidden
        >
          ✦
        </span>

        <EditableText
          file="home"
          field="tagline"
          value={content.tagline}
          as="p"
          className={`${cormorant.className} teaser-rise mt-6 text-lg italic text-[#d6cdb8] lg:mt-8 lg:text-2xl`}
          style={rise(0.6)}
        />

        <div
          className="teaser-rise mx-auto mt-12 h-px w-24 bg-[#4c4740] lg:mt-16 lg:w-32"
          style={rise(0.75)}
          aria-hidden
        />

        <EditableText
          file="home"
          field="dropLabel"
          value={content.dropLabel}
          as="p"
          className="teaser-rise mt-12 text-[11px] tracking-[0.28em] text-[#b9b09d] lg:mt-16 lg:text-sm"
          style={rise(0.9)}
        />

        <h2
          className={`${cormorant.className} teaser-rise mt-6 text-xl leading-[1.3] font-medium tracking-[0.22em] sm:text-2xl lg:mt-8 lg:text-4xl`}
          style={rise(1.05)}
        >
          <EditableText file="home" field="subheadingLine1" value={content.subheadingLine1} as="span" />
          <br />
          <EditableText file="home" field="subheadingLine2" value={content.subheadingLine2} as="span" />
        </h2>

        <EditableLink
          href="/"
          className="teaser-rise mt-10 inline-block border border-[#6f695c] px-9 py-3.5 text-[12px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-14 lg:px-14 lg:py-4 lg:text-sm"
          style={rise(1.2)}
        >
          <EditableText file="home" field="ctaLabel" value={content.ctaLabel} as="span" />
        </EditableLink>

        {/* star divider */}
        <div
          className="teaser-rise mx-auto mt-16 flex max-w-xs items-center gap-5 lg:mt-24 lg:max-w-md"
          style={rise(1.4)}
          aria-hidden
        >
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[11px] text-[#cfc6b1] lg:text-sm">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        <EditableText
          file="home"
          field="footerNote"
          value={content.footerNote}
          as="p"
          className={`${cormorant.className} teaser-rise mt-10 text-[15px] italic text-[#b9b09d] lg:mt-12 lg:text-xl`}
          style={rise(1.55)}
        />
      </div>
    </main>
  );
}
