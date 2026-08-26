import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // checkout.session.completed fires as soon as the customer finishes checkout,
  // even for delayed-notification payment methods that haven't actually been
  // paid yet — async_payment_succeeded covers those once they clear. Gating on
  // payment_status avoids fulfilling an order for a payment that later fails.
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId;
    const quantity = Number(session.metadata?.quantity ?? "1");

    if (productId && session.payment_status !== "unpaid") {
      await prisma.$transaction(async (tx) => {
        const existingOrder = await tx.order.findUnique({ where: { stripeSessionId: session.id } });
        if (existingOrder) return;

        await tx.order.create({
          data: {
            productId,
            stripeSessionId: session.id,
            customerEmail: session.customer_details?.email ?? null,
            amountTotalCents: session.amount_total ?? 0,
            status: "PAID",
            shippingAddress: session.collected_information?.shipping_details
              ? JSON.parse(JSON.stringify(session.collected_information.shipping_details))
              : undefined,
          },
        });

        const product = await tx.product.update({
          where: { id: productId },
          data: { inventory: { decrement: quantity } },
        });

        if (product.inventory <= 0) {
          await tx.product.update({ where: { id: productId }, data: { status: "SOLD_OUT", inventory: 0 } });
        }
      });
    }
  }

  return NextResponse.json({ received: true });
}
