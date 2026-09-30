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

  // Logged unconditionally (not just on failure) so a submission that saves
  // with no photo — the exact symptom this is chasing — leaves a trace of
  // what actually arrived, instead of leaving no evidence either way.
  console.log("review photo field:", {
    isFile: photo instanceof File,
    type: photo instanceof File ? photo.type : typeof photo,
    size: photo instanceof File ? photo.size : null,
    name: photo instanceof File ? photo.name : null,
  });

  if (photo instanceof File && photo.size > 0) {
    if (!ACCEPTED_PHOTO_TYPES.test(photo.type)) {
      return NextResponse.json({ error: "Please upload a JPG, PNG, or HEIC file." }, { status: 400 });
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return NextResponse.json({ error: "That photo is over 10MB — try a smaller one." }, { status: 400 });
    }

    // Not gated on BLOB_READ_WRITE_TOKEN specifically — this project's Blob
    // store is connected via OIDC (BLOB_STORE_ID + the auto-injected
    // VERCEL_OIDC_TOKEN), which `put()` falls back to on its own when no
    // explicit token is passed. Checking for that one legacy env var here
    // would skip the upload even when OIDC auth is perfectly available.
    try {
      const blob = await put(`reviews/${crypto.randomUUID()}-${photo.name}`, photo, {
        access: "public",
        addRandomSuffix: false,
      });
      photoUrl = blob.url;
    } catch (err) {
      // The photo was always optional — a failed upload (no credentials in
      // local dev, a network blip, whatever else) shouldn't block the
      // review itself from saving.
      console.error("Review photo upload failed — saving the review without it:", err);
    }
  }

  const { rating, name, body } = parsed.data;

  await prisma.review.create({
    data: { rating, name, body, photoUrl, consent: true },
  });

  return NextResponse.json({ ok: true });
}
