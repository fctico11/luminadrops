"use server";

import { prisma } from "@/lib/prisma";
import { randomHandle } from "@/lib/tmmc-handles";
import { revalidatePath } from "next/cache";
import { BACK_ROOM_LOCKED } from "./lock";

const MAX_LENGTH = 300;
export type PostCategory = "NOTE" | "RECOMMENDATION" | "LITTLE_JOY";

export async function createPost(body: string, category: PostCategory) {
  if (BACK_ROOM_LOCKED) return;
  const trimmed = body.trim().slice(0, MAX_LENGTH);
  if (!trimmed) return;

  await prisma.tmmcPost.create({
    data: { body: trimmed, category, handle: randomHandle() },
  });

  revalidatePath("/tmmc/back-room");
}

export async function likePost(id: string) {
  if (BACK_ROOM_LOCKED) return;
  await prisma.tmmcPost.update({
    where: { id },
    data: { likes: { increment: 1 } },
  });
  revalidatePath("/tmmc/back-room");
}
