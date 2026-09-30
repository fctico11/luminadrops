"use server";

import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setReviewStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  await prisma.review.update({ where: { id }, data: { status } });
  revalidatePath("/admin/review-submissions");
}

/** Removes a review and its photo, if it has one. Deleting the DB row alone
 * would leave the photo orphaned in Blob storage forever — this is the only
 * way to actually free that space, short of finding the file by hand in the
 * Vercel dashboard's Manage Blobs view. Blob deletion is best-effort: a
 * failure there shouldn't block removing the review itself. */
export async function deleteReview(id: string, photoUrl: string | null) {
  if (photoUrl) {
    try {
      await del(photoUrl);
    } catch (err) {
      console.error("Failed to delete review photo from Blob storage:", err);
    }
  }
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin/review-submissions");
}
