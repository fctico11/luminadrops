"use client";

import { Analytics } from "@vercel/analytics/next";
import { hasAdminFlag } from "@/lib/admin-flag";

/** Vercel Web Analytics, minus admin visits (so /admin/analytics reflects
 * real visitors). Events are dropped in the browser before they're sent. */
export default function SiteAnalytics() {
  return <Analytics beforeSend={(event) => (hasAdminFlag() || event.url.includes("/admin") ? null : event)} />;
}
