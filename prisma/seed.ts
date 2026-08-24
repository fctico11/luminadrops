import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.themeSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
  console.log("Theme settings ready.");

  const existingProduct = await prisma.product.findFirst();
  if (!existingProduct) {
    await prisma.product.create({
      data: {
        name: "Sample Drop",
        slug: "sample-drop",
        description:
          "This is placeholder copy for the first drop. Edit everything — name, price, images, and description — from /admin.",
        priceCents: 4500,
        shippingCents: 800,
        inventory: 50,
        status: "DRAFT",
      },
    });
    console.log("Sample draft product created.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
