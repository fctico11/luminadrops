import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getResend } from "@/lib/resend";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (!segmentId) {
    return NextResponse.json({ error: "Waitlist is not configured." }, { status: 500 });
  }

  const resend = getResend();
  const { error } = await resend.contacts.create({
    email: parsed.data.email,
    unsubscribed: false,
    segments: [{ id: segmentId }],
  });

  // Resend may error if the contact already exists — treat that as success so a
  // repeat signup doesn't look like a failure to the visitor.
  const alreadySubscribed = error && /already exists|already a contact/i.test(error.message);
  if (error && !alreadySubscribed) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
