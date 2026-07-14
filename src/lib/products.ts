import { prisma } from "@/lib/prisma";

export async function getActiveProduct() {
  try {
    return await prisma.product.findFirst({
      where: { status: "LIVE" },
      orderBy: { updatedAt: "desc" },
      include: { images: { orderBy: { position: "asc" } } },
    });
  } catch {
    return null;
  }
}

export function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}
