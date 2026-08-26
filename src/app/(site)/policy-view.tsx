import type { PolicyContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import Motes from "../motes";
import { cormorant, rise } from "../ui";

type Props = {
  contentName: "privacy" | "shipping-returns";
  content: PolicyContent;
};

/** Shared layout for the legal/policy pages — same left-aligned reading column for
 * both /privacy and /shipping-returns, since the content shape is identical. */
export default function PolicyView({ contentName, content }: Props) {
  return (
    <main className="grain relative flex flex-1 flex-col items-center px-6 py-16 lg:py-24">
      <Motes />

      <div className="relative w-full max-w-2xl">
        <EditableText
          file={contentName}
          field="title"
          value={content.title}
          as="h1"
          className={`${cormorant.className} teaser-rise text-xl font-medium tracking-[0.3em] lg:text-3xl`}
          style={rise(0.1)}
        />
        <EditableText
          file={contentName}
          field="lastUpdated"
          value={content.lastUpdated}
          as="p"
          className={`${cormorant.className} teaser-rise mt-4 text-sm italic text-[#9c9384]`}
          style={rise(0.2)}
        />

        <EditableText
          file={contentName}
          field="intro"
          value={content.intro}
          as="p"
          className="teaser-rise mt-8 text-[15px] leading-relaxed text-[#c4bba8] lg:text-base"
          style={rise(0.3)}
        />

        <div className="mt-10 space-y-10">
          {content.sections.map((section, i) => (
            <div key={i}>
              <EditableText
                file={contentName}
                field={`sections.${i}.heading`}
                value={section.heading}
                as="h2"
                className={`${cormorant.className} text-base font-medium tracking-[0.2em] text-[#e9e1cd] lg:text-lg`}
              />
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph, j) => (
                  <EditableText
                    key={j}
                    file={contentName}
                    field={`sections.${i}.body.${j}`}
                    value={paragraph}
                    as="p"
                    className="text-[15px] leading-relaxed text-[#c4bba8] lg:text-base"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
