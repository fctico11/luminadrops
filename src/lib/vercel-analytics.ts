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

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

function rangeSince(days: number) {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);
  return { since: dateStr(since), until: dateStr(until) };
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

export async function getPageviewSummary(days: number): Promise<PageviewSummary> {
  const { since, until } = rangeSince(days);
  const data = await vercelGet<{ data: PageviewSummary }>("/v1/query/web-analytics/visits/count", {
    since,
    until,
  });
  return data.data;
}

export type DailyPoint = { date: string; pageviews: number; visitors: number };

export async function getDailyTrend(days: number): Promise<DailyPoint[]> {
  const { since, until } = rangeSince(days);
  const data = await vercelGet<{ data: Array<{ timestamp: string; pageviews: number; visitors: number }> }>(
    "/v1/query/web-analytics/visits/aggregate",
    { since, until, by: "day" }
  );
  return data.data.map((row) => ({
    date: row.timestamp.slice(0, 10),
    pageviews: row.pageviews,
    visitors: row.visitors,
  }));
}

export type TopRow = { label: string; pageviews: number; visitors: number };

async function getTopByDimension(dimension: string, days: number, limit: number): Promise<TopRow[]> {
  const { since, until } = rangeSince(days);
  const data = await vercelGet<{ data: Array<Record<string, string | number>> }>(
    "/v1/query/web-analytics/visits/aggregate",
    { since, until, by: dimension, limit: String(limit) }
  );
  return data.data.map((row) => ({
    label: String(row[dimension] ?? "(unknown)"),
    pageviews: Number(row.pageviews ?? 0),
    visitors: Number(row.visitors ?? 0),
  }));
}

export function getTopPages(days: number, limit = 5) {
  return getTopByDimension("route", days, limit);
}

export function getTopReferrers(days: number, limit = 5) {
  return getTopByDimension("referrerHostname", days, limit);
}
