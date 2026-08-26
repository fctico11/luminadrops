import { getContent } from "@/lib/content";
import { isAdminSession } from "@/lib/session";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import Motes from "../../motes";
import { cormorant, rise } from "../../ui";
import QuantityStepper from "./quantity-stepper";
import Reveal from "./reveal";

export const metadata = {
  title: "The Midnight Margarita Club — Lumina Drops",
  description: "Drop No. 01. An Everlong Midnight, tucked into one box.",
};

export default async function Drop01Page() {
  const isAdmin = await isAdminSession();

  const content = getContent("drop01");

  return (
    <main className="grain relative flex flex-1 flex-col">
      <Motes />

      {/* Hero */}
      <section className="teaser-rise relative w-full overflow-hidden border-b border-[#2a2620]" style={rise(0.1)}>
        <EditableImage
          file="drop01"
          field="heroImage"
          src={content.heroImage}
          alt={content.heroImageAlt}
          controlPlacement="above"
          exportWidth={1600}
          exportHeight={1000}
          className="object-cover opacity-35"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#141115] via-[#141115]/85 to-[#141115]/45"
          aria-hidden
        />

        <div className="relative px-6 py-20 text-left sm:px-10 lg:py-28 lg:px-16">
          <EditableText
            file="drop01"
            field="dropLabel"
            value={content.dropLabel}
            as="p"
            className="text-[11px] tracking-[0.28em] text-[#b9b09d] lg:text-xs"
          />
          <h1 className="relative mt-5 aspect-[901/528] w-72 sm:w-[28rem] lg:w-[34rem]">
            <EditableImage
              file="drop01"
              field="titleImage"
              src={content.titleImage}
              alt={content.titleImageAlt}
              exportWidth={1200}
              exportHeight={700}
              className="object-contain object-left"
            />
          </h1>
          <div className="mt-6 flex items-center gap-4" aria-hidden>
            <span className="h-px w-10 bg-[#4c4740]" />
            <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
          </div>
          <EditableText
            file="drop01"
            field="tagline"
            value={content.tagline}
            as="p"
            className={`${cormorant.className} mt-6 max-w-sm text-lg italic text-[#d6cdb8] lg:text-xl`}
          />
        </div>
      </section>

      {/* What's Waiting Inside */}
      <Reveal as="section" className="relative mx-auto max-w-2xl px-6 py-20 text-center lg:py-28">
        <EditableText
          file="drop01"
          field="insideSectionTitle"
          value={content.insideSectionTitle}
          as="h2"
          className={`${cormorant.className} text-lg font-medium tracking-[0.3em] lg:text-2xl`}
        />
        <div className="mt-8 space-y-5">
          <EditableText
            file="drop01"
            field="insideParagraph1"
            value={content.insideParagraph1}
            as="p"
            className="text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg"
          />
          <EditableText
            file="drop01"
            field="insideParagraph2"
            value={content.insideParagraph2}
            as="p"
            className="text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg"
          />
          <EditableText
            file="drop01"
            field="insideParagraph3"
            value={content.insideParagraph3}
            as="p"
            className="text-[15px] leading-relaxed text-[#c4bba8] lg:text-lg"
          />
        </div>
        <EditableText
          file="drop01"
          field="insideClosingLine"
          value={content.insideClosingLine}
          as="p"
          className={`${cormorant.className} mt-8 text-base italic text-[#d6cdb8] lg:text-lg`}
        />

        <div className="mx-auto mt-10 flex max-w-xs items-center gap-5" aria-hidden>
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>
      </Reveal>

      {/* Includes */}
      <Reveal as="section" className="relative mx-auto w-full max-w-3xl px-6 pb-16 text-center lg:pb-20">
        <EditableText
          file="drop01"
          field="includesTitle"
          value={content.includesTitle}
          as="h2"
          className={`${cormorant.className} text-lg font-medium tracking-[0.3em] lg:text-2xl`}
        />

        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {content.items.map((item, i) => (
            <Reveal key={i} delayMs={(i % 2) * 100} className="flex items-start gap-4 text-left">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-[#3a352e] sm:h-28 sm:w-28">
                <EditableImage
                  file="drop01"
                  field={`items.${i}.image`}
                  src={item.image}
                  alt={item.alt}
                  className="object-cover"
                />
              </div>
              <div>
                <EditableText
                  file="drop01"
                  field={`items.${i}.title`}
                  value={item.title}
                  as="h3"
                  className="text-sm font-medium tracking-[0.2em] text-[#e9e1cd] lg:text-base"
                />
                <EditableText
                  file="drop01"
                  field={`items.${i}.description`}
                  value={item.description}
                  as="p"
                  className="mt-2 text-[15px] leading-relaxed text-[#c4bba8] lg:text-base"
                />
                {(isAdmin || item.note) && (
                  <EditableText
                    file="drop01"
                    field={`items.${i}.note`}
                    value={item.note}
                    as="p"
                    className={`${cormorant.className} mt-2 text-[15px] italic text-[#9c9384]`}
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <p className={`${cormorant.className} mt-12 text-base italic text-[#9c9384]`}>
          <span className="teaser-twinkle mr-2 inline-block text-[11px] text-[#cfc6b1]" aria-hidden>
            ✦
          </span>
          <EditableText file="drop01" field="includesClosingLine" value={content.includesClosingLine} as="span" />
        </p>
      </Reveal>

      {/* Trust badges */}
      <Reveal as="section" className="relative mx-auto w-full max-w-3xl px-6 pb-16 lg:pb-20">
        <div className="grid grid-cols-3 divide-x divide-[#3a352e] border border-[#3a352e]">
          {content.badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-2 py-5 text-center sm:gap-3 sm:px-6 sm:py-8">
              <div className="relative h-6 w-6 sm:h-7 sm:w-7">
                <EditableImage
                  file="drop01"
                  field={`badges.${i}.icon`}
                  src={badge.icon}
                  alt={badge.iconAlt}
                  exportWidth={200}
                  exportHeight={200}
                  className="object-contain"
                />
              </div>
              <div>
                <EditableText
                  file="drop01"
                  field={`badges.${i}.line1`}
                  value={badge.line1}
                  as="p"
                  className="text-[11px] font-medium tracking-[0.15em] text-[#e9e1cd] sm:text-xs sm:tracking-[0.2em]"
                />
                <EditableText
                  file="drop01"
                  field={`badges.${i}.line2`}
                  value={badge.line2}
                  as="p"
                  className="mt-1 text-[10px] tracking-[0.1em] text-[#9c9384] sm:text-[11px] sm:tracking-[0.2em]"
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Purchase */}
      <Reveal as="section" className="relative mx-auto w-full max-w-4xl px-6 pb-20 lg:pb-28">
        <div className="grid overflow-hidden border border-[#4c4740] sm:grid-cols-2">
          <div className="relative aspect-[4/5] sm:aspect-auto">
            <EditableImage
              file="drop01"
              field="purchaseImage"
              src={content.purchaseImage}
              alt={content.purchaseImageAlt}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
            <h2 className={`${cormorant.className} text-xl font-medium tracking-[0.2em] lg:text-2xl`}>
              <EditableText file="drop01" field="titleLine1" value={content.titleLine1} as="span" />{" "}
              <EditableText file="drop01" field="titleLine2" value={content.titleLine2} as="span" />
            </h2>
            <p className="mt-3 text-sm tracking-[0.2em] text-[#9c9384]">
              <EditableText file="drop01" field="dropLabel" value={content.dropLabel} as="span" />
              <span className="mx-2">•</span>
              <EditableText file="drop01" field="dateLabel" value={content.dateLabel} as="span" />
            </p>

            <div className="mt-6 flex w-full max-w-[200px] items-center gap-4" aria-hidden>
              <span className="h-px flex-1 bg-[#4c4740]" />
              <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
              <span className="h-px flex-1 bg-[#4c4740]" />
            </div>

            <EditableText
              file="drop01"
              field="quantityLabel"
              value={content.quantityLabel}
              as="p"
              className="mt-8 text-xs tracking-[0.3em] text-[#9c9384]"
            />
            <div className="mt-3">
              <QuantityStepper />
            </div>

            <button
              type="button"
              className="mt-8 w-full max-w-[280px] border border-[#6f695c] bg-[#e9e1cd] px-8 py-3.5 text-sm font-medium tracking-[0.28em] text-[#141115] transition-all duration-500 hover:bg-[#fff6e0]"
            >
              <EditableText file="drop01" field="ctaLabel" value={content.ctaLabel} as="span" />
              <span className="mx-2">•</span>
              <EditableText file="drop01" field="priceLabel" value={content.priceLabel} as="span" />
            </button>

            <EditableText
              file="drop01"
              field="footNote1"
              value={content.footNote1}
              as="p"
              className="mt-5 text-sm text-[#9c9384]"
            />

            <EditableText
              file="drop01"
              field="finePrintLabel"
              value={content.finePrintLabel}
              as="p"
              className="mt-8 text-xs tracking-[0.3em] text-[#9c9384]"
            />
            <EditableText
              file="drop01"
              field="footNote2"
              value={content.footNote2}
              as="p"
              className="mt-2 text-sm leading-relaxed text-[#9c9384]"
            />
          </div>
        </div>
      </Reveal>
    </main>
  );
}
