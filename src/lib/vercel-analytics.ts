import "server-only";

const VERCEL_API_BASE = "https://api.vercel.com";

function getConfig() {
  const token = process.env.VERCEL_ANALYTICS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!token || !projectId) return null;
  return { token, projectId, teamId };
}

export function isAnalyticsConfigured() {
  return getConfig() !== null;
}

export type DateRange = { since: string; until: string };

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

/** Rolling window ending today — used by the live dashboard cards. */
export function rangeSince(days: number): DateRange {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);
  return { since: dateStr(since), until: dateStr(until) };
}

/** A single calendar day — used by the nightly sync job. */
export function rangeForDay(date: Date): DateRange {
  const iso = dateStr(date);
  return { since: iso, until: iso };
}

async function vercelGet<T>(path: string, params: Record<string, string>): Promise<T> {
  const config = getConfig();
  if (!config) throw new Error("Vercel Analytics is not configured.");

  const url = new URL(`${VERCEL_API_BASE}${path}`);
  url.searchParams.set("projectId", config.projectId);
  if (config.teamId) url.searchParams.set("teamId", config.teamId);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  // Cached briefly so repeated admin page loads don't hammer the API —
  // this is traffic reporting, not something that needs to be second-fresh.
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${config.token}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Vercel Analytics request failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export type PageviewSummary = { pageviews: number; visitors: number };

export async function getPageviewSummaryFor(range: DateRange): Promise<PageviewSummary> {
  const data = await vercelGet<{ data: PageviewSummary }>("/v1/query/web-analytics/visits/count", range);
  return data.data;
}

export function getPageviewSummary(days: number) {
  return getPageviewSummaryFor(rangeSince(days));
}

export type DailyPoint = { date: string; pageviews: number; visitors: number };

export async function getDailyTrend(days: number): Promise<DailyPoint[]> {
  const data = await vercelGet<{ data: Array<{ timestamp: string; pageviews: number; visitors: number }> }>(
    "/v1/query/web-analytics/visits/aggregate",
    { ...rangeSince(days), by: "day" }
  );
  return data.data.map((row) => ({
    date: row.timestamp.slice(0, 10),
    pageviews: row.pageviews,
    visitors: row.visitors,
  }));
}

export type TopRow = { label: string; pageviews: number; visitors: number };

async function getTopByDimensionFor(
  dimension: string,
  range: DateRange,
  limit: number,
  fallbackLabel: string
): Promise<TopRow[]> {
  const data = await vercelGet<{ data: Array<Record<string, string | number>> }>(
    "/v1/query/web-analytics/visits/aggregate",
    { ...range, by: dimension, limit: String(limit) }
  );
  return data.data.map((row) => ({
    // Vercel returns an empty string (not an omitted field) for pageviews
    // with no referrer, so `??` alone wouldn't catch it — `||` treats "" as
    // missing too.
    label: String(row[dimension] || fallbackLabel),
    pageviews: Number(row.pageviews ?? 0),
    visitors: Number(row.visitors ?? 0),
  }));
}

export function getTopPages(days: number, limit = 5) {
  return getTopByDimensionFor("route", rangeSince(days), limit, "(unknown)");
}

export function getTopReferrers(days: number, limit = 5) {
  return getTopByDimensionFor("referrerHostname", rangeSince(days), limit, "Direct");
}

export function getTopCountries(days: number, limit = 5) {
  return getTopByDimensionFor("country", rangeSince(days), limit, "(unknown)");
}

export function getTopDevices(days: number, limit = 5) {
  return getTopByDimensionFor("deviceType", rangeSince(days), limit, "(unknown)");
}

/** Everything needed for one day's row in the AnalyticsDaily table — used
 * by the nightly cron sync, not the live dashboard. */
export async function getDaySnapshot(date: Date) {
  const range = rangeForDay(date);
  const [summary, topPages, topReferrers, topCountries, topDevices] = await Promise.all([
    getPageviewSummaryFor(range),
    getTopByDimensionFor("route", range, 10, "(unknown)"),
    getTopByDimensionFor("referrerHostname", range, 10, "Direct"),
    getTopByDimensionFor("country", range, 10, "(unknown)"),
    getTopByDimensionFor("deviceType", range, 10, "(unknown)"),
  ]);
  return { ...summary, topPages, topReferrers, topCountries, topDevices };
}
