import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const DROP01_SLUG = "drop-01";

async function main() {
  await prisma.product.upsert({
    where: { slug: DROP01_SLUG },
    create: {
      name: "The Midnight Margarita Club",
      slug: DROP01_SLUG,
      description: "Drop No. 01 — An Everlong Midnight, tucked into one box.",
      priceCents: 14900,
      shippingCents: 0,
      inventory: 100,
      status: "LIVE",
    },
    update: {},
  });
  console.log("Drop 01 product ready.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
