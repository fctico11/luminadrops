import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const bodySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(2).default(1),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { productId, quantity } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== "LIVE") {
    return NextResponse.json({ error: "This drop is not available." }, { status: 404 });
  }
  if (product.inventory < quantity) {
    return NextResponse.json({ error: "Not enough stock left." }, { status: 409 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    ui_mode: "elements",
    mode: "payment",
    line_items: [
      {
        quantity,
        price_data: {
          currency: product.currency,
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
        },
      },
    ],
    shipping_address_collection: {
      allowed_countries: ["US", "CA"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: product.shippingCents, currency: product.currency },
          display_name: "Standard shipping",
        },
      },
    ],
    metadata: { productId: product.id, quantity: String(quantity) },
    return_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}
