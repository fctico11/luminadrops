import type { Drop01Content } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableRichText from "@/components/edit/EditableRichText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";
import Reveal from "./reveal";
import PurchaseControls from "./purchase-controls";
import DropdownModal from "./dropdown-modal";
import MobileInsideExpandable from "./mobile-inside-expandable";

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
 * the existing sm:-and-up layout: product photo + buy box first, then a
 * merged "What's Waiting Inside" beat (Club Manual photo/description,
 * expanding in place to the rest of the items grid), and two
 * accordion-styled rows that each open a modal ("The Details" holding the
 * long narrative text, and "The Fine Print") instead of the desktop's
 * swipeable card carousel + separate Includes grid. Hidden at sm: and up
 * via the wrapping `sm:hidden` on each section in page.tsx. */
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
        <a
          href="#drop01-details"
          className="soft-button-glow mt-4 inline-flex items-center justify-center border border-[#6f695c]/80 px-5 py-2.5 text-[11px] font-medium tracking-[0.15em] text-[#e9e1cd] transition-all duration-300 hover:border-[#cfc0a0] hover:bg-white/[0.04] hover:text-[#fff6e0]"
        >
          <EditableText file="drop01" field="readDetailsLabel" value={content.readDetailsLabel} as="span" />
        </a>

        <div className="mx-auto mt-6 flex w-full max-w-[160px] items-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-[#4c4740]" />
          <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
          <span className="h-px flex-1 bg-[#4c4740]" />
        </div>

        <div className="mt-6 -ml-[18px] flex w-[calc(100%+18px)] items-start gap-4">
          {/* Bleeds most of the way to the screen edge (cancels most of the
              section's px-6 on this side only, leaving a tiny 6px gap) so
              the image can run bigger without taking width away from the
              text column. */}
          <div className="relative aspect-[4/5] w-1/2 shrink-0 overflow-hidden border border-[#4c4740]">
            <EditableImage
              file="drop01"
              field="purchaseImage"
              src={content.purchaseImage}
              alt={content.purchaseImageAlt}
              className="object-cover"
            />
          </div>

          <div className="flex w-1/2 flex-col items-center text-center">
            {(isAdmin || content.dropLabel) && (
              <EditableText
                file="drop01"
                field="dropLabel"
                value={content.dropLabel}
                as="p"
                className="text-[10px] tracking-[0.25em] text-[#9c9384]"
              />
            )}
            <h2 className={`${cormorant.className} mt-1 text-lg font-medium tracking-[0.1em]`}>
              <EditableText file="drop01" field="titleLine1" value={content.titleLine1} as="span" />{" "}
              <EditableText file="drop01" field="titleLine2" value={content.titleLine2} as="span" />
            </h2>
            <EditableText
              file="drop01"
              field="dateLabel"
              value={content.dateLabel}
              as="p"
              className="mt-1 text-xs tracking-[0.1em] text-[#9c9384]"
            />

            <div className="mx-auto mt-4 flex w-full max-w-[130px] items-center gap-2" aria-hidden>
              <span className="h-px flex-1 bg-[#4c4740]" />
              <span className="teaser-twinkle text-xs text-[#cfc6b1]">✦</span>
              <span className="h-px flex-1 bg-[#4c4740]" />
            </div>

            <EditableText
              file="drop01"
              field="quantityLabel"
              value={content.quantityLabel}
              as="p"
              className="mt-4 text-[10px] tracking-[0.2em] text-[#9c9384]"
            />
            <div className="mt-2 w-full">
              {/* The CTA button and the footnote below it break out past
                  this column (via ctaWrapperClassName here, and the
                  matching wrapper below) to center under the full
                  two-column row instead of just this half — the quantity
                  stepper above stays put, centered under its own label. */}
              <PurchaseControls
                productId={productId}
                productName={productName}
                priceCents={priceCents}
                currency={currency}
                ctaLabel={content.ctaLabel}
                maxQuantity={maxQuantity}
                soldOut={soldOut}
                ctaWrapperClassName="flex w-[calc(200%+1rem)] -ml-[calc(100%+1rem)] justify-center"
                ctaEmphasis
              />
            </div>

            <div className="mt-2 flex w-[calc(200%+1rem)] -ml-[calc(100%+1rem)] justify-center">
              <EditableText
                file="drop01"
                field="footNote1"
                value={content.footNote1}
                as="p"
                className="text-xs text-[#9c9384]"
              />
            </div>
          </div>
        </div>

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

      {/* What's Waiting Inside — Club Manual photo/description by default,
          expands in place to the rest of the items grid. */}
      <Reveal as="section" className="relative mx-auto w-full max-w-md px-6 pb-10 text-center">
        <MobileInsideExpandable content={content} isAdmin={isAdmin} />
      </Reveal>

      {/* Details + fine print, each opening a modal */}
      <Reveal as="section" className="relative mx-auto w-full max-w-md px-6 pb-16">
        <DropdownModal id="drop01-details" file="drop01" labelField="detailsLabel" labelValue={content.detailsLabel}>
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
