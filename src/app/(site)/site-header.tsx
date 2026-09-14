import { getContent } from "@/lib/content";
import EditableText from "@/components/edit/EditableText";
import EditableLink from "@/components/edit/EditableLink";
import BagLink from "./bag-link";
import HeaderShell from "./header-shell";
import { cormorant } from "../ui";

const NAV = [
  { href: "/drops", key: "drops" as const },
  { href: "/archive", key: "archive" as const },
  { href: "/about", key: "about" as const },
];

export default function SiteHeader() {
  const content = getContent("site-header");

  // stacks on mobile: side by side the wordmark and nav collide
  return (
    <HeaderShell>
      <EditableLink
        href="/home"
        className={`${cormorant.className} text-sm font-medium tracking-[0.35em] whitespace-nowrap transition-colors duration-500 hover:text-[#fff6e0] lg:text-lg`}
      >
        <EditableText file="site-header" field="wordmark" value={content.wordmark} as="span" />
      </EditableLink>

      <nav className="flex items-center gap-5 text-[11px] tracking-[0.2em] text-[#b9b09d] sm:gap-6 sm:tracking-[0.3em] lg:gap-10 lg:text-xs">
        {NAV.map((item) => (
          <EditableLink
            key={item.href}
            href={item.href}
            className="transition-colors duration-500 hover:text-[#fff6e0]"
          >
            <EditableText
              file="site-header"
              field={`navLabels.${item.key}`}
              value={content.navLabels[item.key]}
              as="span"
            />
          </EditableLink>
        ))}

        <BagLink />
      </nav>
    </HeaderShell>
  );
}
