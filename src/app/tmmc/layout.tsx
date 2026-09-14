import type { Metadata } from "next";

// Reachable only by scanning the QR code inside the box — kept out of
// search results and the sitemap on purpose, even though the URL itself
// isn't access-controlled.
export const metadata: Metadata = {
  title: "After Hours — Lumina Drops",
  robots: { index: false, follow: false },
};

export default function TmmcLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-1 flex-col bg-[#141115] text-[#e9e1cd]">{children}</div>;
}
