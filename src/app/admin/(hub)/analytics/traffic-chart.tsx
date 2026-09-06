"use client";

import { useMemo, useState } from "react";

export type ChartPoint = { date: string; pageviews: number; visitors: number };
type Granularity = "day" | "week" | "month";
type Bucket = { key: string; label: string; pageviews: number; visitors: number };

/** Rounds up to a "nice" axis max (1/2/5/10 x a power of ten) so the y-axis
 * shows readable numbers instead of whatever the raw max happens to be. */
function niceMax(value: number) {
  if (value <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const residual = value / magnitude;
  const niceResidual = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return niceResidual * magnitude;
}

function startOfWeek(d: Date) {
  const date = new Date(d);
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceMonday);
  return date;
}

function bucketData(data: ChartPoint[], granularity: Granularity): Bucket[] {
  if (granularity === "day") {
    return data.slice(-30).map((p) => ({
      key: p.date,
      label: new Date(`${p.date}T00:00:00Z`).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        timeZone: "UTC",
      }),
      pageviews: p.pageviews,
      visitors: p.visitors,
    }));
  }

  const buckets = new Map<string, Bucket>();
  for (const p of data) {
    const d = new Date(`${p.date}T00:00:00Z`);
    let key: string;
    let label: string;
    if (granularity === "week") {
      const weekStart = startOfWeek(d);
      key = weekStart.toISOString().slice(0, 10);
      label = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    } else {
      key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      label = d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
    }
    const existing = buckets.get(key);
    if (existing) {
      existing.pageviews += p.pageviews;
      existing.visitors += p.visitors;
    } else {
      buckets.set(key, { key, label, pageviews: p.pageviews, visitors: p.visitors });
    }
  }

  return Array.from(buckets.values())
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(-12);
}

export default function TrafficChart({ data }: { data: ChartPoint[] }) {
  const [granularity, setGranularity] = useState<Granularity>("day");
  const buckets = useMemo(() => bucketData(data, granularity), [data, granularity]);
  const max = niceMax(Math.max(1, ...buckets.map((b) => b.pageviews)));
  const showAllLabels = granularity !== "day";

  if (data.length === 0) {
    return (
      <p className="text-sm text-white/40">
        No synced days yet — the nightly job hasn&apos;t run, or hasn&apos;t been backfilled.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-white/50">Pageviews</p>
        <div className="flex border border-white/10 text-xs">
          {(["day", "week", "month"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGranularity(g)}
              className={`px-3 py-1 capitalize transition ${
                granularity === g ? "bg-[#c9a227] text-black" : "text-white/50 hover:text-white"
              }`}
            >
              {g}s
            </button>
          ))}
        </div>
      </div>

      <div className="border border-white/10 bg-white/[0.03] p-4">
        <div className="flex gap-3">
          <div className="flex h-28 w-8 shrink-0 flex-col justify-between text-right text-[10px] text-white/30">
            <span>{max}</span>
            <span>{Math.round(max / 2)}</span>
            <span>0</span>
          </div>

          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              <div className="border-t border-white/10" />
              <div className="border-t border-white/10" />
              <div className="border-t border-white/10" />
            </div>
            <div className="relative flex h-28 items-end gap-[3px]">
              {buckets.map((b) => (
                <div
                  key={b.key}
                  className="group flex h-full flex-1 items-end"
                  title={`${b.label}: ${b.pageviews} views, ${b.visitors} visitors`}
                >
                  {b.pageviews > 0 && (
                    <div
                      className="w-full rounded-t-[2px] bg-[#c9a227] transition-opacity group-hover:opacity-70"
                      style={{ height: `${Math.max(4, (b.pageviews / max) * 100)}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 flex gap-3">
          <div className="w-8 shrink-0" />
          {showAllLabels ? (
            <div className="flex flex-1 gap-[3px] text-[10px] text-white/30">
              {buckets.map((b) => (
                <span key={b.key} className="flex-1 truncate text-center">
                  {b.label}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 justify-between text-[10px] text-white/30">
              <span>{buckets[0]?.label}</span>
              <span>{buckets[buckets.length - 1]?.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
