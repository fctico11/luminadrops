import type { Metadata } from "next";

// Not linked from the site yet — kept out of search results and the
// sitemap on purpose, same treatment as the /tmmc "After Hours" page.
export const metadata: Metadata = {
  title: "Share Your Review — Lumina Drops",
  robots: { index: false, follow: false },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col bg-[#141115] text-[#e9e1cd]">{children}</div>;
}
