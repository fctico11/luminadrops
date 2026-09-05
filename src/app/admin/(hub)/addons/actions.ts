"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { commitFiles } from "@/lib/github";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().trim().min(1, "Description is required."),
  price: z.coerce.number().min(0, "Price can't be negative."),
  inventory: z.coerce.number().int().min(0, "Inventory can't be negative."),
  status: z.enum(["DRAFT", "LIVE", "SOLD_OUT", "ARCHIVED"]),
  productId: z.string().min(1, "Choose a linked product."),
});

export type AddOnFormState = { error?: string } | undefined;

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(name: string) {
  const base = slugify(name) || "addon";
  let slug = base;
  let n = 1;
  while (await prisma.addOn.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

/** Saves an add-on photo the same way the content editor does for site
 * images — written to the local filesystem for dev, and committed to GitHub
 * so it persists in production's read-only filesystem. */
async function saveImage(slug: string, file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = (file.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
  const filename = `${slug}.${ext}`;
  const publicPath = `/addons/${filename}`;

  try {
    const dir = path.join(process.cwd(), "public", "addons");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);
  } catch {
    // read-only filesystem in production — the GitHub commit below is the source of truth there
  }

  await commitFiles(
    [{ path: `public/addons/${filename}`, content: buffer.toString("base64"), encoding: "base64" }],
    `Admin: add-on image for ${slug}`
  );

  return publicPath;
}

function revalidateStorefront() {
  revalidatePath("/admin/addons");
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function createAddOn(_prevState: AddOnFormState, formData: FormData): Promise<AddOnFormState> {
  const parsed = formSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    status: formData.get("status"),
    productId: formData.get("productId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { name, description, price, inventory, status, productId } = parsed.data;
  const slug = await uniqueSlug(name);

  let imageUrl = "";
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await saveImage(slug, imageFile);
  }

  await prisma.addOn.create({
    data: { slug, name, description, priceCents: Math.round(price * 100), inventory, status, imageUrl, productId },
  });

  revalidateStorefront();
  redirect("/admin/addons");
}

const updateFormSchema = formSchema.extend({ id: z.string().min(1) });

export async function updateAddOn(_prevState: AddOnFormState, formData: FormData): Promise<AddOnFormState> {
  const parsed = updateFormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    inventory: formData.get("inventory"),
    status: formData.get("status"),
    productId: formData.get("productId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const { id, name, description, price, inventory, status, productId } = parsed.data;
  const existing = await prisma.addOn.findUnique({ where: { id } });
  if (!existing) return { error: "Add-on not found." };

  let imageUrl = existing.imageUrl;
  const imageFile = formData.get("image");
  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await saveImage(existing.slug, imageFile);
  }

  await prisma.addOn.update({
    where: { id },
    data: { name, description, priceCents: Math.round(price * 100), inventory, status, productId, imageUrl },
  });

  revalidateStorefront();
  redirect("/admin/addons");
}

export async function deleteAddOn(id: string) {
  await prisma.addOn.delete({ where: { id } });
  revalidateStorefront();
}
