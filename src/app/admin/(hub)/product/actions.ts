"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DROP01_SLUG } from "@/lib/products";

const updateSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().trim().min(1, "Description is required."),
  price: z.coerce.number().min(0.5, "Price must be at least $0.50."),
  shipping: z.coerce.number().min(0, "Shipping can't be negative."),
  inventory: z.coerce.number().int().min(0, "Inventory can't be negative."),
  weightOz: z.coerce.number().min(0, "Weight can't be negative."),
  lengthIn: z.coerce.number().min(0, "Length can't be negative."),
  widthIn: z.coerce.number().min(0, "Width can't be negative."),
  heightIn: z.coerce.number().min(0, "Height can't be negative."),
  shipFromName: z.string().trim().min(1, "Ship-from name is required."),
  shipFromStreet1: z.string().trim().min(1, "Ship-from street address is required."),
  shipFromStreet2: z.string().trim().optional().default(""),
  shipFromCity: z.string().trim().min(1, "Ship-from city is required."),
  shipFromState: z.string().trim().length(2, "Use a 2-letter state code."),
  shipFromZip: z.string().trim().min(3, "Ship-from ZIP is required."),
  shipFromCountry: z.string().trim().length(2, "Use a 2-letter country code."),
});

export type UpdateProductState = { error?: string; success?: boolean } | undefined;

export async function updateProduct(
  _prevState: UpdateProductState,
  formData: FormData
): Promise<UpdateProductState> {
  const parsed = updateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    shipping: formData.get("shipping"),
    inventory: formData.get("inventory"),
    weightOz: formData.get("weightOz"),
    lengthIn: formData.get("lengthIn"),
    widthIn: formData.get("widthIn"),
    heightIn: formData.get("heightIn"),
    shipFromName: formData.get("shipFromName"),
    shipFromStreet1: formData.get("shipFromStreet1"),
    shipFromStreet2: formData.get("shipFromStreet2"),
    shipFromCity: formData.get("shipFromCity"),
    shipFromState: formData.get("shipFromState"),
    shipFromZip: formData.get("shipFromZip"),
    shipFromCountry: formData.get("shipFromCountry"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const {
    name,
    description,
    price,
    shipping,
    inventory,
    weightOz,
    lengthIn,
    widthIn,
    heightIn,
    shipFromName,
    shipFromStreet1,
    shipFromStreet2,
    shipFromCity,
    shipFromState,
    shipFromZip,
    shipFromCountry,
  } = parsed.data;

  await prisma.product.update({
    where: { slug: DROP01_SLUG },
    data: {
      name,
      description,
      priceCents: Math.round(price * 100),
      shippingCents: Math.round(shipping * 100),
      inventory,
      weightOz,
      lengthIn,
      widthIn,
      heightIn,
      shipFromName,
      shipFromStreet1,
      shipFromStreet2,
      shipFromCity,
      shipFromState: shipFromState.toUpperCase(),
      shipFromZip,
      shipFromCountry: shipFromCountry.toUpperCase(),
      // A restock (inventory moved back above 0) should bring the drop back to LIVE.
      status: inventory > 0 ? "LIVE" : "SOLD_OUT",
    },
  });

  revalidatePath("/admin/product");
  revalidatePath("/drop01");

  return { success: true };
}
