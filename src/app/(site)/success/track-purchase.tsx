"use client";

import { useEffect } from "react";
import { trackTikTokEvent, type TikTokContent } from "@/lib/tiktok-pixel";

type Props = {
  sessionId: string;
  event: { contents: TikTokContent[]; value: number; currency: string };
};

/** Refreshing /success (or hitting back/forward into it) must not fire a
 * second Purchase for the same order — sessionStorage survives a refresh but
 * not a new tab/visit, which is exactly the dedupe window that matters here. */
export default function TrackPurchase({ sessionId, event }: Props) {
  useEffect(() => {
    const dedupeKey = `ttq_purchase_${sessionId}`;
    if (sessionStorage.getItem(dedupeKey)) return;
    sessionStorage.setItem(dedupeKey, "1");
    trackTikTokEvent("Purchase", event);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return null;
}
