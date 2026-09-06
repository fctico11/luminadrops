import { prisma } from "@/lib/prisma";
import {
  isAnalyticsConfigured,
  getPageviewSummary,
  getTopPages,
  getTopReferrers,
  getTopCountries,
  getTopDevices,
  type TopRow,
} from "@/lib/vercel-analytics";
import TrafficChart, { type ChartPoint } from "./traffic-chart";

export const dynamic = "force-dynamic";

function TopList({ title, rows, emptyLabel }: { title: string; rows: TopRow[]; emptyLabel: string }) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wider text-white/50">{title}</p>
      <div className="space-y-2">
        {rows.length === 0 && <p className="text-sm text-white/40">{emptyLabel}</p>}
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-2 text-sm"
          >
            <span className="truncate text-[#f5f2ea]">{row.label}</span>
            <span className="shrink-0 pl-4 text-white/50">{row.pageviews} views</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", timeZone: "UTC" });
}

export default async function AdminAnalyticsPage() {
  if (!isAnalyticsConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-sm text-white/50">
          Vercel Analytics isn&apos;t configured yet. Add <code>VERCEL_ANALYTICS_TOKEN</code> and{" "}
          <code>VERCEL_PROJECT_ID</code> (and <code>VERCEL_TEAM_ID</code> if this project lives under a Vercel
          team) as environment variables, then redeploy.
        </p>
      </div>
    );
  }

  let week: { pageviews: number; visitors: number } | null = null;
  let month: { pageviews: number; visitors: number } | null = null;
  let topPages: TopRow[] = [];
  let topReferrers: TopRow[] = [];
  let topCountries: TopRow[] = [];
  let topDevices: TopRow[] = [];
  let error: string | null = null;

  try {
    [week, month, topPages, topReferrers, topCountries, topDevices] = await Promise.all([
      getPageviewSummary(7),
      getPageviewSummary(30),
      getTopPages(30),
      getTopReferrers(30),
      getTopCountries(30),
      getTopDevices(30),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load analytics.";
  }

  // Daily breakdown comes from our own DB, not live Vercel — that's the
  // whole point of the nightly sync (see /api/cron/sync-analytics): Vercel's
  // own reporting window caps out at 1 month on Hobby, so this is what lets
  // "which day had how many views" keep working past that window.
  // Fetched well beyond 30 days so the week/month chart views have real
  // history to bucket into as it accumulates — the raw table below still
  // only shows the most recent 30 rows.
  const historyRows = await prisma.analyticsDaily.findMany({
    orderBy: { date: "desc" },
    take: 180,
  });
  const history = [...historyRows].reverse();
  const chartData: ChartPoint[] = history.map((d) => ({
    date: d.date.toISOString().slice(0, 10),
    pageviews: d.pageviews,
    visitors: d.visitors,
  }));
  const daily = history.slice(-30);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-white/50">
        Live totals pulled from Vercel Web Analytics. Daily history below is synced nightly into our own
        database (see <code>/api/cron/sync-analytics</code>) so it survives past Vercel&apos;s 1-month reporting
        window.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">Last 7 days</p>
          <p className="mt-2 text-2xl font-semibold text-[#f5f2ea]">{week?.pageviews ?? 0} views</p>
          <p className="text-sm text-white/50">{week?.visitors ?? 0} visitors</p>
        </div>
        <div className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-wider text-white/40">Last 30 days</p>
          <p className="mt-2 text-2xl font-semibold text-[#f5f2ea]">{month?.pageviews ?? 0} views</p>
          <p className="text-sm text-white/50">{month?.visitors ?? 0} visitors</p>
        </div>
      </div>

      <div className="mt-8">
        <TrafficChart data={chartData} />

        {daily.length > 0 && (
          <div className="mt-4 max-h-64 overflow-y-auto border border-white/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                  <th className="px-4 py-2 font-normal">Date</th>
                  <th className="px-4 py-2 font-normal">Pageviews</th>
                  <th className="px-4 py-2 font-normal">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {[...daily].reverse().map((d) => (
                  <tr key={d.date.toISOString()} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-2 text-[#f5f2ea]">{formatDay(d.date)}</td>
                    <td className="px-4 py-2 text-white/60">{d.pageviews}</td>
                    <td className="px-4 py-2 text-white/60">{d.visitors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <TopList title="Top pages (30 days)" rows={topPages} emptyLabel="No data yet." />
        <TopList title="Top referrers (30 days)" rows={topReferrers} emptyLabel="No referrer data yet." />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <TopList title="Top countries (30 days)" rows={topCountries} emptyLabel="No data yet." />
        <TopList title="Devices (30 days)" rows={topDevices} emptyLabel="No data yet." />
      </div>
    </div>
  );
}
