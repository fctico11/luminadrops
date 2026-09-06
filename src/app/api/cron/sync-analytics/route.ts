import { NextRequest, NextResponse } from "next/server";
import { syncAnalyticsDay } from "@/lib/analytics-sync";

/** Runs early each day (see vercel.json) and snapshots *yesterday's* full
 * traffic — not today's, since today isn't over yet. Vercel signs its own
 * cron invocations with this same Authorization header when CRON_SECRET is
 * set, so this doubles as auth against anyone else hitting the route. */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  const day = await syncAnalyticsDay(yesterday);
  return NextResponse.json({ ok: true, synced: day.toISOString().slice(0, 10) });
}
