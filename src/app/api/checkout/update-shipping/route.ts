import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { destinationAddressSchema, quoteShippingForProduct } from "@/lib/shipping";

const bodySchema = z.object({
  sessionId: z.string().min(1),
  address: destinationAddressSchema,
});

/** Called mid-session as the customer fills in the ShippingAddressElement on
 * the payment page. productId/quantity are read from the session's own
 * metadata (set at creation) rather than trusted from the request body, so
 * the client can only ever influence price by changing the destination
 * address, never by naming an arbitrary product or amount. */
export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const { sessionId, address } = parsed.data;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const productId = session.metadata?.productId;
  const quantity = Number(session.metadata?.quantity ?? "1");
  if (!productId) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  const rate = await quoteShippingForProduct(productId, quantity, address);
  if (!rate) {
    return NextResponse.json({ error: "This drop is not available." }, { status: 404 });
  }

  await stripe.checkout.sessions.update(sessionId, {
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: rate.amountCents, currency: session.currency ?? "usd" },
          display_name: `${rate.provider} ${rate.serviceLevel}`,
        },
      },
    ],
  });

  return NextResponse.json({ ok: true });
}
