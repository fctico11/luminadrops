import {
  isAnalyticsConfigured,
  getPageviewSummary,
  getDailyTrend,
  getTopPages,
  getTopReferrers,
  type DailyPoint,
  type TopRow,
} from "@/lib/vercel-analytics";

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
  let trend: DailyPoint[] = [];
  let topPages: TopRow[] = [];
  let topReferrers: TopRow[] = [];
  let error: string | null = null;

  try {
    [week, month, trend, topPages, topReferrers] = await Promise.all([
      getPageviewSummary(7),
      getPageviewSummary(30),
      getDailyTrend(14),
      getTopPages(30),
      getTopReferrers(30),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load analytics.";
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  const maxPageviews = Math.max(1, ...trend.map((d) => d.pageviews));

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-white/50">
        Traffic pulled live from Vercel Web Analytics. May lag the Vercel dashboard by a few minutes.
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
        <p className="mb-3 text-xs uppercase tracking-wider text-white/50">Daily pageviews (last 14 days)</p>
        {trend.length === 0 ? (
          <p className="text-sm text-white/40">No data yet.</p>
        ) : (
          <div className="flex h-32 items-end gap-1 border border-white/10 bg-white/[0.03] p-4">
            {trend.map((d) => (
              <div
                key={d.date}
                className="flex h-full flex-1 flex-col items-center justify-end"
                title={`${d.date}: ${d.pageviews} views, ${d.visitors} visitors`}
              >
                <div
                  className="w-full bg-[#c9a227]"
                  style={{ height: `${Math.max(2, (d.pageviews / maxPageviews) * 100)}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <TopList title="Top pages (30 days)" rows={topPages} emptyLabel="No data yet." />
        <TopList title="Top referrers (30 days)" rows={topReferrers} emptyLabel="No referrer data yet." />
      </div>
    </div>
  );
}
