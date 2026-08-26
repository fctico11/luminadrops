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
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { name, description, price, shipping, inventory } = parsed.data;

  await prisma.product.update({
    where: { slug: DROP01_SLUG },
    data: {
      name,
      description,
      priceCents: Math.round(price * 100),
      shippingCents: Math.round(shipping * 100),
      inventory,
      // A restock (inventory moved back above 0) should bring the drop back to LIVE.
      status: inventory > 0 ? "LIVE" : "SOLD_OUT",
    },
  });

  revalidatePath("/admin/product");
  revalidatePath("/drop01");

  return { success: true };
}
