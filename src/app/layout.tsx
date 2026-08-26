import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { cormorant } from "./ui";
import "./globals.css";

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const description = "Limited releases, each beginning with an idea we couldn't leave imaginary.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luminadrops.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lumina Drops",
  description,
  openGraph: {
    title: "Lumina Drops",
    description,
    siteName: "Lumina Drops",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumina Drops",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plexMono.variable} h-full antialiased`}>
      <body className={`${cormorant.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
