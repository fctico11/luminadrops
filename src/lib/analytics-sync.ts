import "server-only";
import { prisma } from "@/lib/prisma";
import { getDaySnapshot } from "@/lib/vercel-analytics";

/** Pulls one calendar day's traffic from Vercel and upserts it into
 * AnalyticsDaily, so it survives past Vercel's own reporting window
 * (1 month on Hobby). `date`'s time-of-day is ignored — only the calendar
 * day matters. */
export async function syncAnalyticsDay(date: Date) {
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const snapshot = await getDaySnapshot(day);

  await prisma.analyticsDaily.upsert({
    where: { date: day },
    create: {
      date: day,
      pageviews: snapshot.pageviews,
      visitors: snapshot.visitors,
      topPages: snapshot.topPages,
      topReferrers: snapshot.topReferrers,
      topCountries: snapshot.topCountries,
      topDevices: snapshot.topDevices,
    },
    update: {
      pageviews: snapshot.pageviews,
      visitors: snapshot.visitors,
      topPages: snapshot.topPages,
      topReferrers: snapshot.topReferrers,
      topCountries: snapshot.topCountries,
      topDevices: snapshot.topDevices,
    },
  });

  return day;
}
