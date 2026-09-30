import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

const MAX_REVIEW_LENGTH = 500;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ACCEPTED_PHOTO_TYPES = /^image\/(jpeg|png|heic|heif)$/;

const fieldsSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  name: z.string().trim().min(1).max(120),
  body: z.string().trim().min(1).max(MAX_REVIEW_LENGTH),
  // The form only lets a customer submit once this is checked, but that's
  // client-side only — enforce it here too rather than trusting the flag.
  consent: z.literal("true"),
});

/** Stores a review submitted from /reviews. Unmoderated — everything lands
 * PENDING and is only ever shown at /admin/review-submissions until an
 * admin approves it; nothing here reaches the public site on its own.
 *
 * multipart/form-data rather than JSON because the optional photo needs to
 * ride along as a file, not a data URL — this is a customer-facing upload,
 * not the git-committed content-editor image flow in EditableImage. */
export async function POST(request: NextRequest) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = fieldsSchema.safeParse({
    rating: formData.get("rating"),
    name: formData.get("name"),
    body: formData.get("body"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in every field and check the consent box." }, { status: 400 });
  }

  const photo = formData.get("photo");
  let photoUrl: string | null = null;

  if (photo instanceof File && photo.size > 0) {
    if (!ACCEPTED_PHOTO_TYPES.test(photo.type)) {
      return NextResponse.json({ error: "Please upload a JPG, PNG, or HEIC file." }, { status: 400 });
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "That photo is over 10MB — try a smaller one." }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // Missing config shouldn't block the review itself — the photo was
      // optional to begin with, so drop it and save the text.
      console.error("BLOB_READ_WRITE_TOKEN is not set — dropping review photo upload.");
    } else {
      try {
        const blob = await put(`reviews/${crypto.randomUUID()}-${photo.name}`, photo, {
          access: "public",
          addRandomSuffix: false,
        });
        photoUrl = blob.url;
      } catch (err) {
        console.error("Review photo upload failed:", err);
        return NextResponse.json({ error: "Couldn't upload that photo. Please try again." }, { status: 502 });
      }
    }
  }

  const { rating, name, body } = parsed.data;

  await prisma.review.create({
    data: { rating, name, body, photoUrl, consent: true },
  });

  return NextResponse.json({ ok: true });
}
