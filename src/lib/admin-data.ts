import "server-only";
import { prisma } from "@/lib/prisma";

/** Admin always edits the single most-recently-touched product. Creates a
 * placeholder draft the first time the dashboard is opened. */
export async function getOrCreateManagedProduct() {
  const existing = await prisma.product.findFirst({
    orderBy: { updatedAt: "desc" },
    include: { images: { orderBy: { position: "asc" } } },
  });
  if (existing) return existing;

  return prisma.product.create({
    data: {
      name: "Untitled Drop",
      slug: `untitled-drop-${Date.now()}`,
      description: "",
      priceCents: 0,
      shippingCents: 0,
      inventory: 0,
      status: "DRAFT",
    },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getOrCreateTheme() {
  const existing = await prisma.themeSettings.findUnique({ where: { id: "default" } });
  if (existing) return existing;
  return prisma.themeSettings.create({ data: { id: "default" } });
}
