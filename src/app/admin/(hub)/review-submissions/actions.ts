"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setReviewStatus(id: string, status: "APPROVED" | "REJECTED" | "PENDING") {
  await prisma.review.update({ where: { id }, data: { status } });
  revalidatePath("/admin/review-submissions");
}
