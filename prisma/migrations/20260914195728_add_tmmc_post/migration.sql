-- CreateEnum
CREATE TYPE "TmmcPostCategory" AS ENUM ('NOTE', 'RECOMMENDATION', 'LITTLE_JOY');

-- CreateTable
CREATE TABLE "TmmcPost" (
    "id" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "TmmcPostCategory" NOT NULL DEFAULT 'NOTE',
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TmmcPost_pkey" PRIMARY KEY ("id")
);
