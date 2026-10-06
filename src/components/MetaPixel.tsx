"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useTrackingAllowed } from "@/lib/use-tracking-allowed";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Meta (Facebook) Pixel base code. Renders nothing unless
 * NEXT_PUBLIC_META_PIXEL_ID is set, so local dev and preview deploys stay
 * out of the ad account's data. Skipped on /admin and in any browser that has
 * signed in as admin, so the team's own visits don't register as traffic. The pixel watches history
 * pushState itself, so client-side navigations still fire PageView. */
export default function MetaPixel() {
  const pathname = usePathname();
  const allowed = useTrackingAllowed();
  if (!PIXEL_ID || pathname.startsWith("/admin")) return null;

  return (
    <>
      {allowed && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}
      {/* Only shows when JavaScript is off, where an admin session can't be. */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
