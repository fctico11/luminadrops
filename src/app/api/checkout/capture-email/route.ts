import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getResend } from "@/lib/resend";
import { formatPrice } from "@/lib/products";

const bodySchema = z.object({
  sessionId: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
});

const ADMIN_NOTIFY_EMAIL = "hello@luminadrops.com";
const NOTIFY_DELAY_MINUTES = 20;

/** Schedules (not sends) the "new abandoned cart" admin alert, best-effort —
 * a problem here should never fail the capture itself. Scheduled rather
 * than immediate: at this point checkout only just *started*, and most
 * people who type their email go on to pay within a couple minutes. The
 * Stripe webhook cancels this if that happens before it fires, so an alert
 * only ever lands for a session that's actually still incomplete
 * `NOTIFY_DELAY_MINUTES` later. Returns the Resend email id to store on the
 * row, or null if scheduling failed. */
async function scheduleAbandonedCartNotification(params: {
  email: string;
  createdAt: Date;
  productName: string;
  quantity: number;
  addOnName: string | null;
  amountTotalCents: number;
  currency: string;
}): Promise<string | null> {
  try {
    const resend = getResend();
    const scheduledAt = new Date(Date.now() + NOTIFY_DELAY_MINUTES * 60 * 1000).toISOString();
    const amount = formatPrice(params.amountTotalCents, params.currency);

    const lines = [
      `Email: ${params.email}`,
      `Captured: ${params.createdAt.toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })}`,
      `Product: ${params.productName}`,
      `Quantity: ${params.quantity}`,
      ...(params.addOnName ? [`Add-on: ${params.addOnName}`] : []),
      `Amount: ${amount}`,
      "",
      `This person started checkout and entered their email, but hadn't completed payment as of ${NOTIFY_DELAY_MINUTES} minutes later.`,
      "",
      "View all abandoned checkouts: https://luminadrops.com/admin/abandoned-checkouts",
    ];

    const sent = await resend.emails.send({
      from: "Lumina Drops <notifications@luminadrops.com>",
      to: ADMIN_NOTIFY_EMAIL,
      subject: `New abandoned cart — ${amount}`,
      text: lines.join("\n"),
      scheduledAt,
    });

    if (sent.error) {
      console.error("Failed to schedule abandoned-cart notification:", sent.error);
      return null;
    }
    return sent.data?.id ?? null;
  } catch (err) {
    console.error("Failed to schedule abandoned-cart notification:", err);
    return null;
  }
}

/** Called as soon as the customer has typed a valid email into
 * ContactDetailsElement, well before they submit payment — lets admin follow
 * up if they abandon checkout. productId/quantity/add-on are read from the
 * session's own metadata (set at creation), never trusted from the request
 * body, matching /api/checkout/update-shipping. */
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

  // Retyping the email on an existing session just updates it — the
  // notification is only ever scheduled once, on the row's first capture.
  const existing = await prisma.abandonedCheckout.findUnique({ where: { stripeSessionId: sessionId } });
  if (existing) {
    await prisma.abandonedCheckout.update({ where: { stripeSessionId: sessionId }, data: { email } });
    return NextResponse.json({ ok: true });
  }

  const row = await prisma.abandonedCheckout.create({
    data: {
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
  });

  const notifyEmailId = await scheduleAbandonedCartNotification({
    email,
    createdAt: row.createdAt,
    productName: product.name,
    quantity,
    addOnName,
    amountTotalCents,
    currency: product.currency,
  });

  if (notifyEmailId) {
    await prisma.abandonedCheckout.update({ where: { id: row.id }, data: { notifyEmailId } });
  }

  return NextResponse.json({ ok: true });
}
