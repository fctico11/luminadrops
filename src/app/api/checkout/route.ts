import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const bodySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(2).default(1),
  addOnId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const { productId, quantity, addOnId } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.status !== "LIVE") {
    return NextResponse.json({ error: "This drop is not available." }, { status: 404 });
  }
  if (product.inventory < quantity) {
    return NextResponse.json({ error: "Not enough stock left." }, { status: 409 });
  }

  // Re-validated server-side rather than trusting the client's claim that the
  // add-on is still available — it may have sold out or been unpublished
  // since the customer added it to their bag. Silently dropped rather than
  // blocking checkout, consistent with how a Shippo outage never blocks a sale.
  const addOn = addOnId
    ? await prisma.addOn.findFirst({ where: { id: addOnId, productId, status: "LIVE", inventory: { gt: 0 } } })
    : null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;
  const stripe = getStripe();

  const lineItems: Array<{
    quantity: number;
    price_data: {
      currency: string;
      unit_amount: number;
      product_data: { name: string; description?: string };
    };
  }> = [
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
  ];

  if (addOn) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: addOn.currency,
        unit_amount: addOn.priceCents,
        product_data: { name: addOn.name, description: addOn.description || undefined },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "elements",
    mode: "payment",
    automatic_tax: { enabled: true },
    line_items: lineItems,
    shipping_address_collection: {
      allowed_countries: ["US", "CA"],
    },
    // Placeholder using the product's flat rate — the actual customer hasn't
    // entered a shipping address yet at session-creation time. The client
    // replaces this with a live Shippo quote via /api/checkout/update-shipping
    // as soon as the ShippingAddressElement has a complete address.
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: product.shippingCents, currency: product.currency },
          display_name: "Standard Shipping",
        },
      },
    ],
    metadata: {
      productId: product.id,
      quantity: String(quantity),
      ...(addOn
        ? { addOnId: addOn.id, addOnName: addOn.name, addOnPriceCents: String(addOn.priceCents) }
        : {}),
    },
    return_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}
