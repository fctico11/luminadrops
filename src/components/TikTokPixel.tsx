"use client";

import Script from "next/script";
import { useTrackingAllowed } from "@/lib/use-tracking-allowed";

const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;

/** TikTok Pixel base code. Renders nothing unless NEXT_PUBLIC_TIKTOK_PIXEL_ID
 * is set, and skips /admin and any browser that has signed in as admin so
 * the team's own visits don't land in the ad account's numbers. */
export default function TikTokPixel() {
  const allowed = useTrackingAllowed();
  if (!PIXEL_ID || !allowed) return null;

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

  ttq.load('${PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');`}
    </Script>
  );
}
