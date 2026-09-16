import type { Drop01Content } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableRichText from "@/components/edit/EditableRichText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";
import Reveal from "./reveal";
import PurchaseControls from "./purchase-controls";
import DropdownModal from "./dropdown-modal";

type Props = {
  content: Drop01Content;
  isAdmin: boolean;
  soldOut: boolean;
  maxQuantity: number;
  productId: string;
  productName: string;
  priceCents: number;
  currency: string;
};

/** The mobile-specific flow for drop01, sitting alongside (not replacing)
 * the existing sm:-and-up layout: product photo + buy box first, then the
 * Club Manual promoted to its own full-width beat, a 2-column grid of
 * what's inside, and two accordion-styled rows that each open a modal
 * (matching the client's reference screenshots) instead of the desktop's
 * swipeable card carousel + inline fine print. Hidden at sm: and up via
 * the wrapping `sm:hidden` on each section in page.tsx. */
export default function MobileFlow({
  content,
  isAdmin,
  soldOut,
  maxQuantity,
  productId,
  productName,
  priceCents,
  currency,
}: Props) {
  return (
    <div className="sm:hidden">
      {/* Product + buy box */}
      <Reveal as="section" className="relative mx-auto w-full max-w-md px-6 pt-10 pb-10 text-center">
        <EditableText
          file="drop01"
          field="snippetTitle"
          value={content.snippetTitle}
          as="h2"
          className="text-sm font-medium tracking-[0.2em] text-[#e9e1cd]"
        />
        <EditableText
          file="drop01"
          field="snippetBody"
          value={content.snippetBody}
          as="p"
          className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#c4bba8]"
        />

        <div className="mx-auto mt-6 flex w-full max-w-[160px] items-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        <div className="relative mx-auto mt-6 aspect-[4/5] w-2/3 overflow-hidden border border-[#4c4740]">
          <EditableImage
            file="drop01"
            field="purchaseImage"
            src={content.purchaseImage}
            alt={content.purchaseImageAlt}
            className="object-cover"
          />
        </div>

        {(isAdmin || content.dropLabel) && (
          <EditableText
            file="drop01"
            field="dropLabel"
            value={content.dropLabel}
            as="p"
            className="mt-5 text-[10px] tracking-[0.3em] text-[#9c9384]"
          />
        )}
        <h2 className={`${cormorant.className} mt-2 text-xl font-medium tracking-[0.15em]`}>
          <EditableText file="drop01" field="titleLine1" value={content.titleLine1} as="span" />{" "}
          <EditableText file="drop01" field="titleLine2" value={content.titleLine2} as="span" />
        </h2>
        <EditableText
          file="drop01"
          field="dateLabel"
          value={content.dateLabel}
          as="p"
          className="mt-1 text-[11px] tracking-[0.15em] text-[#9c9384]"
        />

        <div className="mx-auto mt-6 flex w-full max-w-[160px] items-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        <EditableText
          file="drop01"
          field="quantityLabel"
          value={content.quantityLabel}
          as="p"
          className="mt-5 text-[10px] tracking-[0.25em] text-[#9c9384]"
        />
        <div className="mt-2 w-full">
          <PurchaseControls
            productId={productId}
            productName={productName}
            priceCents={priceCents}
            currency={currency}
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
          className="mt-3 text-xs text-[#9c9384]"
        />

        {/* Trial placement: same trust-badges block that lives at the
            bottom of the page, duplicated here to compare which position
            reads better. Both instances edit the same content.badges
            fields, so admin edits stay in sync regardless of which one is
            used to make the change. Remove whichever placement loses. */}
        <div className="mt-8 grid grid-cols-3 divide-x divide-[#3a352e] border border-[#3a352e]">
          {content.badges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-2 py-5 text-center">
              <div className="relative h-6 w-6">
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
                  className="text-[11px] font-medium tracking-[0.15em] text-[#e9e1cd]"
                />
                <EditableText
                  file="drop01"
                  field={`badges.${i}.line2`}
                  value={badge.line2}
                  as="p"
                  className="mt-1 text-[10px] tracking-[0.1em] text-[#9c9384]"
                />
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Club Manual, promoted to its own full-width beat */}
      <Reveal as="section" className="relative mx-auto w-full max-w-md px-6 pb-4 text-center">
        {/* Matches one column's exact width from the 2-col grid below
            (grid-cols-2 gap-x-4 → each column is 50% minus half the
            1rem gap), and its aspect-square, so both read as the same
            size. */}
        <div className="relative mx-auto aspect-square w-[calc(50%-0.5rem)] overflow-hidden border border-[#3a352e]">
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
          className="mt-5 text-sm font-medium tracking-[0.2em] text-[#e9e1cd]"
        />
        <EditableText
          file="drop01"
          field="manualDescription"
          value={content.manualDescription}
          as="p"
          className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-[#c4bba8]"
        />
      </Reveal>

      {/* Includes, 2-column grid */}
      <Reveal id="drop01-mobile-inside" as="section" className="relative mx-auto w-full max-w-md px-6 pb-10 text-center">
        <EditableText
          file="drop01"
          field="includesTitle"
          value={content.includesTitle}
          as="h2"
          className={`${cormorant.className} text-lg font-medium tracking-[0.3em]`}
        />
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8">
          {content.items.map((item, i) => (
            <Reveal
              key={i}
              direction={i % 2 === 0 ? "left" : "right"}
              delayMs={(i % 2) * 100}
              className="text-left"
            >
              <div className="relative aspect-square w-full overflow-hidden border border-[#3a352e]">
                <EditableImage
                  file="drop01"
                  field={`items.${i}.image`}
                  src={item.image}
                  alt={item.alt}
                  className="object-cover"
                />
              </div>
              <EditableText
                file="drop01"
                field={`items.${i}.title`}
                value={item.title}
                as="h3"
                className="mt-3 text-[11px] font-medium tracking-[0.15em] text-[#e9e1cd]"
              />
              <EditableText
                file="drop01"
                field={`items.${i}.description`}
                value={item.description}
                as="p"
                className="mt-1.5 text-[13px] leading-relaxed text-[#c4bba8]"
              />
              {(isAdmin || item.note) && (
                <EditableText
                  file="drop01"
                  field={`items.${i}.note`}
                  value={item.note}
                  as="p"
                  className={`${cormorant.className} mt-1.5 text-[13px] italic text-[#9c9384]`}
                />
              )}
            </Reveal>
          ))}
        </div>
        <EditableText
          file="drop01"
          field="includesClosingLine"
          value={content.includesClosingLine}
          as="p"
          className={`${cormorant.className} mt-10 text-sm italic text-[#9c9384]`}
        />
      </Reveal>

      {/* Details + fine print, each opening a modal */}
      <Reveal as="section" className="relative mx-auto w-full max-w-md px-6 pb-16">
        <DropdownModal file="drop01" labelField="insideSectionTitle" labelValue={content.insideSectionTitle}>
          <div className="text-center">
            {content.insideBodyCards.map((card, i) => (
              <div key={i}>
                {isAdmin ? (
                  <EditableRichText
                    file="drop01"
                    field={`insideBodyCards.${i}`}
                    value={card}
                    className="text-sm leading-relaxed text-[#c4bba8]"
                  />
                ) : (
                  <div
                    className="rich-text text-sm leading-relaxed text-[#c4bba8]"
                    dangerouslySetInnerHTML={{ __html: card }}
                  />
                )}
                {i < content.insideBodyCards.length - 1 && (
                  <div className="my-6 flex justify-center" aria-hidden>
                    <img
                      src="/drops/midnight-margarita/mmc-logo-icon.png"
                      alt=""
                      className="h-5 w-auto opacity-85"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mx-auto mt-8 flex max-w-xs items-center gap-4" aria-hidden>
            <span className="h-px flex-1 bg-[#4c4740]" />
            <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
            <span className="h-px flex-1 bg-[#4c4740]" />
          </div>
          <EditableText
            file="drop01"
            field="insideClosingLine"
            value={content.insideClosingLine}
            as="p"
            className={`${cormorant.className} mt-6 text-sm italic text-[#d6cdb8]`}
          />
        </DropdownModal>

        <DropdownModal file="drop01" labelField="finePrintLabel" labelValue={content.finePrintLabel}>
          <EditableText
            file="drop01"
            field="footNote2"
            value={content.footNote2}
            as="p"
            className="text-sm leading-relaxed text-[#c4bba8]"
          />
        </DropdownModal>
      </Reveal>
    </div>
  );
}
