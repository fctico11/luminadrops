import Link from "next/link";
import { cormorant } from "../ui";

const NAV = [
  { href: "/drops", label: "DROPS" },
  { href: "/archive", label: "ARCHIVE" },
  { href: "/about", label: "ABOUT" },
];

export default function SiteHeader() {
  // stacks on mobile: side by side the wordmark and nav collide
  return (
    <header className="flex flex-col items-center gap-4 border-b border-white/10 px-6 py-5 sm:flex-row sm:justify-between sm:gap-0 sm:px-10">
      <Link
        href="/home"
        className={`${cormorant.className} text-sm font-medium tracking-[0.35em] whitespace-nowrap transition-colors duration-500 hover:text-[#fff6e0] lg:text-lg`}
      >
        LUMINA DROPS
      </Link>

      <nav className="flex items-center gap-5 text-[10px] tracking-[0.2em] text-[#b9b09d] sm:gap-6 sm:tracking-[0.3em] lg:gap-10 lg:text-xs">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="transition-colors duration-500 hover:text-[#fff6e0]"
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/cart"
          aria-label="Bag, 0 items"
          className="flex items-center gap-2 transition-colors duration-500 hover:text-[#fff6e0]"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 lg:h-[18px] lg:w-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden
          >
            <path d="M3.5 6.5h13l-1 10.5h-11z" strokeLinejoin="round" />
            <path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" strokeLinecap="round" />
          </svg>
          <span>(0)</span>
        </Link>
      </nav>
    </header>
  );
}
