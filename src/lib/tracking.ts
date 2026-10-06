import { trackTikTokEvent, type TikTokEventName, type TikTokEventPayload } from "@/lib/tiktok-pixel";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type TrackParams = Record<string, string | number | boolean | null | undefined>;

function clean(params: TrackParams) {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    out[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  return out;
}

function debug(kind: string, name: string, payload: unknown) {
  if (process.env.NODE_ENV !== "production") console.debug(`[track:${kind}]`, name, payload);
}

/** Sends a named custom event to both ad pixels (TikTok and Meta). Safe to
 * call anywhere on the client: it does nothing for the pixels that haven't
 * loaded (no ID in this environment, an admin's browser, an ad blocker). In
 * development every event is also logged to the console so it can be checked
 * without a real pixel. Names are PascalCase with no spaces so they read
 * cleanly in each platform's event list. */
export function trackEvent(name: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;
  const payload = { page: window.location.pathname, ...clean(params) };
  debug("event", name, payload);
  window.ttq?.track(name, payload);
  window.fbq?.("trackCustom", name, payload);
}

const seen = new Set<string>();

/** Like trackEvent, but at most once per page per key for the life of the tab
 * — for things that fire repeatedly while someone scrolls or swipes. */
export function trackOnce(key: string, name: string, params: TrackParams = {}) {
  if (typeof window === "undefined") return;
  const id = `${window.location.pathname}|${key}`;
  if (seen.has(id)) return;
  seen.add(id);
  trackEvent(name, params);
}

/** The four standard shopping-funnel events. TikTok's version already
 * existed; this sends the same moment to Meta under its matching standard
 * event so both ad accounts see the full funnel. */
export function trackFunnelEvent(event: TikTokEventName, payload: TikTokEventPayload) {
  if (typeof window === "undefined") return;
  debug("funnel", event, payload);
  trackTikTokEvent(event, payload);
  window.fbq?.("track", event, {
    content_ids: payload.contents.map((c) => c.content_id),
    content_type: "product",
    content_name: payload.contents.map((c) => c.content_name).join(", "),
    value: payload.value,
    currency: payload.currency,
  });
}
