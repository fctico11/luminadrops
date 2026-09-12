import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { cormorant } from "./ui";
import { CartProvider } from "@/components/cart/CartContext";
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
      <body className={`${cormorant.className} min-h-full flex flex-col`}>
        {process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID && (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {`!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('${process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');`}
          </Script>
        )}
        <CartProvider>{children}</CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
