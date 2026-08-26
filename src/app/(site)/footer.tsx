import { Fragment } from "react";
import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";

export default function Footer() {
  const content = getContent("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-6 text-[11px] text-[#8a8378] sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p>
          © {year}{" "}
          <EditableText file="footer" field="copyrightName" value={content.copyrightName} as="span" />. All
          rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          {content.links.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && <span aria-hidden>·</span>}
              <EditableLink href={link.href} className="transition-colors duration-300 hover:text-[#e9e1cd]">
                <EditableText file="footer" field={`links.${i}.label`} value={link.label} as="span" />
              </EditableLink>
            </Fragment>
          ))}
        </nav>
      </div>
    </footer>
  );
}
