-- CreateTable
CREATE TABLE "AnalyticsDaily" (
    "date" DATE NOT NULL,
    "pageviews" INTEGER NOT NULL,
    "visitors" INTEGER NOT NULL,
    "topPages" JSONB,
    "topReferrers" JSONB,
    "topCountries" JSONB,
    "topDevices" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsDaily_pkey" PRIMARY KEY ("date")
);
