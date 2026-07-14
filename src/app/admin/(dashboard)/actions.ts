"use server";

import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().default(""),
  price: z.coerce.number().min(0),
  shipping: z.coerce.number().min(0),
  inventory: z.coerce.number().int().min(0),
  status: z.enum(["DRAFT", "LIVE", "SOLD_OUT", "ARCHIVED"]),
});

export type FormState = { error?: string; success?: string } | undefined;

export async function updateProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = productSchema.safeParse({
    productId: formData.get("productId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    shipping: formData.get("shipping"),
    inventory: formData.get("inventory"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { productId, price, shipping, ...rest } = parsed.data;

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...rest,
      priceCents: Math.round(price * 100),
      shippingCents: Math.round(shipping * 100),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: "Product saved." };
}

export async function uploadProductImage(_prev: FormState, formData: FormData): Promise<FormState> {
  const productId = formData.get("productId");
  const file = formData.get("file");

  if (typeof productId !== "string" || !productId) {
    return { error: "Missing product." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image." };
  }

  const lastImage = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { position: "desc" },
  });

  const blob = await put(`products/${productId}/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  await prisma.productImage.create({
    data: {
      productId,
      url: blob.url,
      position: (lastImage?.position ?? -1) + 1,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: "Image uploaded." };
}

export async function removeProductImage(imageId: string) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  await prisma.productImage.delete({ where: { id: imageId } });
  try {
    await del(image.url);
  } catch {
    // ignore blob deletion failures
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

const themeSchema = z.object({
  headingFont: z.string().min(1),
  bodyFont: z.string().min(1),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #f5f2ea"),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #0a0a0a"),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #c9a227"),
});

export async function updateTheme(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = themeSchema.safeParse({
    headingFont: formData.get("headingFont"),
    bodyFont: formData.get("bodyFont"),
    primaryColor: formData.get("primaryColor"),
    backgroundColor: formData.get("backgroundColor"),
    accentColor: formData.get("accentColor"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.themeSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...parsed.data },
    update: parsed.data,
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { success: "Theme saved." };
}
