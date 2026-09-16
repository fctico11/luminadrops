import { getContent } from "@/lib/content";
import { isAdminSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DROP01_SLUG } from "@/lib/products";
import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import Motes from "../../motes";
import { cormorant, rise } from "../../ui";
import PurchaseControls from "./purchase-controls";
import InsideCarousel from "./inside-carousel";
import FinePrintModal from "./fine-print-modal";
import MobileFlow from "./mobile-flow";
import Reveal from "./reveal";
import TrackViewContent from "./track-view-content";
import HeroVideo from "../../hero-video";

// One-time manual upload to Vercel Blob — see project notes for how to
// replace this if a new cut of the product page video is ever needed.
const DROP01_HERO_VIDEO_URL = "https://4crfi1phembmhxzs.public.blob.vercel-storage.com/productpage-clearer.mp4";

export const metadata = {
  title: "The Midnight Margarita Club — Lumina Drops",
  description: "Drop No. 01. An Everlong Midnight, tucked into one box.",
};

export default async function Drop01Page() {
  const [isAdmin, product] = await Promise.all([
    isAdminSession(),
    prisma.product.findUnique({ where: { slug: DROP01_SLUG } }),
  ]);

  const content = getContent("drop01");
  const soldOut = !product || product.status !== "LIVE" || product.inventory <= 0;
  const maxQuantity = Math.min(2, product?.inventory ?? 0);

  return (
    <main className="grain relative flex flex-1 flex-col">
      <Motes />
      {product && (
        <TrackViewContent
          productId={product.id}
          productName={product.name}
          priceCents={product.priceCents}
          currency={product.currency}
        />
      )}

      {/* Hero */}
      <section className="relative w-full border-b border-[#2a2620]">
        <div className="teaser-rise aspect-video w-full bg-black lg:aspect-auto lg:h-screen" style={rise(0.1)}>
          <HeroVideo
            src={DROP01_HERO_VIDEO_URL}
            endedContent={
              <div>
                <EditableText
                  file="drop01"
                  field="dropLabel"
                  value={content.dropLabel}
                  as="p"
                  className="text-[11px] tracking-[0.28em] text-[#b9b09d] lg:text-xs"
                />
                {/* The wordmark image centers "THE / Midnight" and
                    "MARGARITA CLUB" as one fixed graphic, but "THE" sits far
                    enough left that centering the image's own bounding box
                    visibly throws "MARGARITA CLUB" — the line most people
                    actually read as the title — off-center. Shifted left by
                    the measured 90px/901px gap between the two so the
                    bottom line lands on the page's true center instead. */}
                <h1 className="relative mx-auto mt-3 aspect-[901/528] w-40 -translate-x-[10%] sm:w-72 lg:mt-5 lg:w-[30rem]">
                  <EditableImage
                    file="drop01"
                    field="titleImage"
                    src={content.titleImage}
                    alt={content.titleImageAlt}
                    exportWidth={1200}
                    exportHeight={700}
                    className="object-contain"
                  />
                </h1>
                <EditableText
                  file="drop01"
                  field="tagline"
                  value={content.tagline}
                  as="p"
                  className={`${cormorant.className} mx-auto mt-3 max-w-[15rem] text-sm italic text-[#d6cdb8] sm:max-w-sm sm:text-base lg:mt-6 lg:max-w-sm lg:text-xl`}
                />
              </div>
            }
          />
        </div>
      </section>

      <MobileFlow
        content={content}
        isAdmin={isAdmin}
        soldOut={soldOut}
        maxQuantity={maxQuantity}
        productId={product?.id ?? ""}
        productName={product?.name ?? ""}
        priceCents={product?.priceCents ?? 0}
        currency={product?.currency ?? "usd"}
      />

      {/* Purchase */}
      <Reveal
        as="section"
        className="relative mx-auto hidden w-full max-w-4xl px-6 pt-10 pb-6 sm:block sm:pt-14 sm:pb-8 lg:pt-16 lg:pb-10"
      >
        <div className="flex flex-col overflow-hidden border border-[#4c4740] sm:flex-row">
          <div className="relative aspect-[4/5] w-full sm:aspect-auto sm:w-1/2 sm:shrink-0">
            <EditableImage
              file="drop01"
              field="purchaseImage"
              src={content.purchaseImage}
              alt={content.purchaseImageAlt}
              className="object-cover"
            />
          </div>
          <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:w-1/2 sm:px-8 sm:py-12">
            <h2 className={`${cormorant.className} text-base font-medium tracking-[0.15em] sm:text-xl lg:text-2xl`}>
              <EditableText file="drop01" field="titleLine1" value={content.titleLine1} as="span" />{" "}
              <EditableText file="drop01" field="titleLine2" value={content.titleLine2} as="span" />
            </h2>
            <p className="mt-2 text-[11px] tracking-[0.15em] text-[#9c9384] sm:mt-3 sm:text-sm sm:tracking-[0.2em]">
              <EditableText file="drop01" field="dropLabel" value={content.dropLabel} as="span" />{" "}
              <EditableText file="drop01" field="dateLabel" value={content.dateLabel} as="span" />
            </p>

            <div className="mt-4 flex w-full max-w-[140px] items-center gap-3 sm:mt-6 sm:max-w-[200px] sm:gap-4" aria-hidden>
              <span className="h-px flex-1 bg-[#4c4740]" />
              <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
              <span className="h-px flex-1 bg-[#4c4740]" />
            </div>

            <EditableText
              file="drop01"
              field="quantityLabel"
              value={content.quantityLabel}
              as="p"
              className="mt-5 text-[10px] tracking-[0.25em] text-[#9c9384] sm:mt-8 sm:text-xs sm:tracking-[0.3em]"
            />
            <div className="mt-2 w-full sm:mt-3">
              <PurchaseControls
                productId={product?.id ?? ""}
                productName={product?.name ?? ""}
                priceCents={product?.priceCents ?? 0}
                currency={product?.currency ?? "usd"}
                ctaLabel={content.ctaLabel}
                maxQuantity={maxQuantity}
                soldOut={soldOut}
              />
            </div>

            <EditableText
              file="drop01"
              field="footNote1"
              value={content.footNote1}
              as="p"
              className="mt-3 text-xs text-[#9c9384] sm:mt-5 sm:text-sm"
            />

            <FinePrintModal
              file="drop01"
              labelField="finePrintLabel"
              labelValue={content.finePrintLabel}
              bodyField="footNote2"
              bodyValue={content.footNote2}
              triggerClassName="mt-5 text-[10px] tracking-[0.25em] text-[#9c9384] sm:mt-8 sm:text-xs sm:tracking-[0.3em]"
            />
          </div>
        </div>
      </Reveal>

      {/* What's Waiting Inside */}
      <Reveal
        as="section"
        className="relative mx-auto hidden max-w-2xl px-6 pt-10 pb-8 text-center sm:block lg:pt-14 lg:pb-10"
      >
        <EditableText
          file="drop01"
          field="insideSectionTitle"
          value={content.insideSectionTitle}
          as="h2"
          className={`${cormorant.className} text-lg font-medium tracking-[0.3em] lg:text-2xl`}
        />
        <div className="mt-8">
          <InsideCarousel cards={content.insideBodyCards} />
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
      <Reveal
        as="section"
        className="relative mx-auto hidden w-full max-w-3xl px-6 pb-16 text-center sm:block lg:pb-20"
      >
        <EditableText
          file="drop01"
          field="includesTitle"
          value={content.includesTitle}
          as="h2"
          className={`${cormorant.className} text-lg font-medium tracking-[0.3em] lg:text-2xl`}
        />

        <Reveal className="mt-10 flex flex-col items-center text-center">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-[#3a352e] sm:h-32 sm:w-32">
            <EditableImage
              file="drop01"
              field="manualImage"
              src={content.manualImage}
              alt={content.manualImageAlt}
              className="object-cover"
            />
          </div>
          <EditableText
            file="drop01"
            field="manualTitle"
            value={content.manualTitle}
            as="h3"
            className="mt-4 text-sm font-medium tracking-[0.2em] text-[#e9e1cd] lg:text-base"
          />
          <EditableText
            file="drop01"
            field="manualDescription"
            value={content.manualDescription}
            as="p"
            className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-[#c4bba8] lg:text-base"
          />
        </Reveal>

        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {content.items.map((item, i) => (
            <Reveal
              key={i}
              delayMs={(i % 2) * 100}
              direction={i % 2 === 0 ? "left" : "right"}
              className="flex items-start gap-4 text-left"
            >
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
          <span className="teaser-twinkle mr-4 inline-block text-[11px] text-[#cfc6b1]" aria-hidden>
            ✦
          </span>
          <EditableText file="drop01" field="includesClosingLine" value={content.includesClosingLine} as="span" />
          <span className="teaser-twinkle ml-4 inline-block text-[11px] text-[#cfc6b1]" aria-hidden>
            ✦
          </span>
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
    </main>
  );
}
