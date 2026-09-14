import EditableText from "@/components/edit/EditableText";
import { cormorant } from "../../ui";
import type { TmmcContent } from "@/lib/content";

export default function Note({ content }: { content: TmmcContent }) {
  return (
    <div className="mx-auto max-w-sm text-left">
      {content.noteBody.map((_, i) => (
        <EditableText
          key={i}
          file="tmmc"
          field={`noteBody.${i}`}
          value={content.noteBody[i]}
          as="p"
          className="mt-4 text-[15px] leading-relaxed text-[#c4bba8] first:mt-0"
        />
      ))}
      <EditableText
        file="tmmc"
        field="noteSignature"
        value={content.noteSignature}
        as="p"
        className={`${cormorant.className} mt-6 text-base italic text-[#d6cdb8]`}
      />
    </div>
  );
}
