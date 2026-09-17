import EditableText from "@/components/edit/EditableText";
import EditableImage from "@/components/edit/EditableImage";
import { cormorant } from "../../ui";
import type { TmmcContent } from "@/lib/content";

export default function Kitchen({ content }: { content: TmmcContent }) {
  return (
    <div>
      <div className="relative mx-auto aspect-[4/3] w-48 overflow-hidden border border-[#4c4740] sm:w-56">
        <EditableImage
          file="tmmc"
          field="kitchenImage"
          src={content.kitchenImage}
          alt={content.kitchenImageAlt}
          className="object-cover"
        />
      </div>

      <div className="mx-auto mt-6 flex max-w-xs items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-[#4c4740]" />
        <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
        <span className="h-px flex-1 bg-[#4c4740]" />
      </div>

      <EditableText
        file="tmmc"
        field="recipeTitle"
        value={content.recipeTitle}
        as="h3"
        className={`${cormorant.className} mt-6 text-lg font-medium uppercase tracking-[0.25em] text-[#e9e1cd]`}
      />
      <EditableText
        file="tmmc"
        field="recipeBody"
        value={content.recipeBody}
        as="p"
        className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#c4bba8]"
      />

      <div className="mt-8 grid gap-8 text-left sm:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9c9384]">Ingredients</p>
          <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-[#c4bba8]">
            {content.ingredients.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#9c9384]">Directions</p>
          <ol className="mt-3 list-decimal space-y-2 pl-4 text-[13px] leading-relaxed text-[#c4bba8]">
            {content.directions.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
