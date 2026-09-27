import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const bodySchema = z.object({
  sessionId: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
});

/** Called as soon as the customer has typed a valid email into
 * ContactDetailsElement, well before they submit payment — lets admin follow
 * up if they abandon checkout. productId/quantity/add-on are read from the
 * session's own metadata (set at creation), never trusted from the request
 * body, matching /api/checkout/update-shipping. Upserts by session id, so
 * retyping the email just updates the same row instead of creating a new
 * one, and the webhook can later mark this exact row completed. */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { sessionId, email } = parsed.data;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.retrieve(sessionId).catch(() => null);
  const productId = session?.metadata?.productId;
  if (!session || !productId) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  const quantity = Number(session.metadata?.quantity ?? "1");
  const addOnName = session.metadata?.addOnName ?? null;
  const addOnPriceCents = session.metadata?.addOnPriceCents ? Number(session.metadata.addOnPriceCents) : null;
  const amountTotalCents = product.priceCents * quantity + (addOnPriceCents ?? 0);

  await prisma.abandonedCheckout.upsert({
    where: { stripeSessionId: sessionId },
    create: {
      stripeSessionId: sessionId,
      email,
      productId,
      productName: product.name,
      quantity,
      addOnName,
      addOnPriceCents,
      amountTotalCents,
      currency: product.currency,
    },
    update: { email },
  });

  return NextResponse.json({ ok: true });
}
