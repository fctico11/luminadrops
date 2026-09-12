declare global {
  interface Window {
    ttq?: {
      track: (event: string, payload?: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

export type TikTokContent = {
  content_id: string;
  content_type: "product" | "product_group";
  content_name: string;
};

export type TikTokEventPayload = {
  contents: TikTokContent[];
  value: number;
  currency: string;
};

export type TikTokEventName = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

/** No-ops (rather than throwing) when the pixel hasn't loaded — missing
 * NEXT_PUBLIC_TIKTOK_PIXEL_ID in this environment, an ad blocker, or the
 * script simply hasn't finished loading yet. */
export function trackTikTokEvent(event: TikTokEventName, payload: TikTokEventPayload) {
  if (typeof window === "undefined" || !window.ttq) return;
  window.ttq.track(event, payload);
}
