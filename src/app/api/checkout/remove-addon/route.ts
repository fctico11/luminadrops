import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";

const bodySchema = z.object({
  sessionId: z.string().min(1),
});

/** Drops the add-on line item from an in-progress Checkout Session, in place —
 * so a customer who added it on the bag page can still change their mind on
 * the checkout page itself without losing the contact/address/payment info
 * they've already typed into the Stripe fields. The main product is always
 * the first line item at session creation, so keeping just that one drops
 * whatever was added after it (currently only ever the add-on). */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const { sessionId } = parsed.data;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items"] });
  const mainLineItem = session.line_items?.data[0];
  if (!mainLineItem) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  await stripe.checkout.sessions.update(sessionId, {
    line_items: [{ id: mainLineItem.id }],
    metadata: { addOnId: "", addOnName: "", addOnPriceCents: "" },
  });

  return NextResponse.json({ ok: true });
}
