import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";
import AnimatedStatText from "@/components/edit/AnimatedStatText";
import Motes from "../../motes";
import { cormorant, rise } from "../../ui";

export const metadata = {
  title: "About — Lumina Drops",
  description: "What Lumina Drops is, and how a drop works.",
};

export default function AboutPage() {
  const content = getContent("about");
  const whatIfIndex = content.lead.search(/what if/i);
  const leadWaveFrom =
    whatIfIndex > 0 && /["“]/.test(content.lead[whatIfIndex - 1]) ? whatIfIndex - 1 : Math.max(whatIfIndex, 0);

  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 text-center lg:py-24">
      <Motes />

      <div className="relative w-full max-w-2xl">
        <EditableText
          file="about"
          field="title"
          value={content.title}
          as="h1"
          className={`${cormorant.className} teaser-rise text-xl font-medium tracking-[0.3em] lg:text-3xl`}
          style={rise(0.1)}
        />

        <div
          className="teaser-rise mx-auto mt-10 flex max-w-xs items-center gap-5 lg:mt-14 lg:max-w-md"
          style={rise(0.3)}
          aria-hidden
        >
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[11px] text-[#cfc6b1] lg:text-sm">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        <p
          className={`${cormorant.className} teaser-rise teaser-text-glow mt-14 text-lg leading-relaxed italic text-[#d6cdb8] lg:mt-20 lg:text-2xl`}
          style={rise(0.5)}
        >
          <AnimatedStatText
            file="about"
            field="lead"
            value={content.lead}
            charClassName="wave-in-ch"
            waveFromIndex={leadWaveFrom}
          />
        </p>

        <EditableText
          file="about"
          field="body"
          value={content.body}
          as="p"
          className={`${cormorant.className} teaser-rise mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-[#c4bba8] lg:mt-10 lg:text-lg`}
          style={rise(0.65)}
        />

        <dl className="teaser-rise mt-16 grid gap-10 sm:grid-cols-3 lg:mt-24" style={rise(0.85)}>
          {content.facts.map((fact, i) => (
            <div key={i}>
              <dt>
                <AnimatedStatText
                  file="about"
                  field={`facts.${i}.term`}
                  value={fact.term}
                  className="teaser-stat cursor-default text-[11px] tracking-[0.28em] text-[#cfc6b1] lg:text-xs"
                />
              </dt>
              <EditableText
                file="about"
                field={`facts.${i}.detail`}
                value={fact.detail}
                as="dd"
                className={`${cormorant.className} mt-4 text-sm leading-relaxed text-[#b9b09d] lg:text-base`}
              />
            </div>
          ))}
        </dl>

        <EditableLink
          href="/drops"
          className="teaser-rise mt-16 inline-block border border-[#6f695c] px-9 py-3.5 text-[12px] tracking-[0.28em] text-[#e9e1cd] transition-all duration-500 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0] lg:mt-20 lg:px-12 lg:py-4 lg:text-sm"
          style={rise(1)}
        >
          <EditableText file="about" field="ctaLabel" value={content.ctaLabel} as="span" />
        </EditableLink>
      </div>
    </main>
  );
}
