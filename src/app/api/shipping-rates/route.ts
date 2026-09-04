import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { destinationAddressSchema, quoteShippingForProduct } from "@/lib/shipping";

const bodySchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(2).default(1),
  address: destinationAddressSchema,
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request." }, { status: 400 });
  }

  const { productId, quantity, address } = parsed.data;

  const rate = await quoteShippingForProduct(productId, quantity, address);
  if (!rate) {
    return NextResponse.json({ error: "This drop is not available." }, { status: 404 });
  }

  return NextResponse.json({
    amountCents: rate.amountCents,
    provider: rate.provider,
    serviceLevel: rate.serviceLevel,
  });
}
