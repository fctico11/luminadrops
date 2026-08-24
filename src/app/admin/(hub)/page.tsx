import Link from "next/link";

const PAGES = [
  {
    href: "/admin/edit",
    label: "Teaser",
    description: "The main landing page (/) shown before a drop goes live.",
  },
  { href: "/admin/edit/home", label: "Home", description: "The wordmark landing page at /home." },
  { href: "/admin/edit/about", label: "About", description: "/about" },
  { href: "/admin/edit/archive", label: "Archive", description: "/archive" },
  { href: "/admin/edit/drops", label: "Drops", description: "/drops" },
  { href: "/admin/edit/cart", label: "Bag", description: "/cart" },
  { href: "/admin/edit/success", label: "Order Confirmation", description: "/success" },
];

export default function AdminHubPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm text-white/50">
        Pick a page to edit. Click any text on it, replace images, then use the Save bar at the
        bottom to save changes. May take a few minutes to update live.
      </p>

      <div className="mt-8 space-y-3">
        {PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="block border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-[#c9a227]/50 hover:bg-white/[0.05]"
          >
            <p className="text-sm font-semibold text-[#f5f2ea]">{page.label}</p>
            <p className="mt-1 text-xs text-white/40">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
