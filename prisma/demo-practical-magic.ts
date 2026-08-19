// One-off demo content: a "Practical Magic"-inspired drop, used to preview
// what a fully dressed drop looks like. Run with: npx tsx prisma/demo-practical-magic.ts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const DESCRIPTION = `There are some things, after all, that midnight is for.

A limited apothecary box for anyone who has ever wanted to live in a house on a hill with herbs drying in the kitchen. Inside:

— "Midnight Garden" hand-poured candle, gardenia & tuberose
— Blood-orange margarita mixer + chili-lime rimming salt
— Pressed-herb spell journal with linen cover
— Lavender & rosemary bath salts, small-batch
— Set of six botanical moon-phase prints

Edition of 250. When they're gone, they're gone.`;

async function main() {
  // retire whatever is currently live so this drop takes the stage
  await prisma.product.updateMany({
    where: { status: "LIVE" },
    data: { status: "ARCHIVED" },
  });

  const product = await prisma.product.upsert({
    where: { slug: "midnight-margarita-box" },
    create: {
      name: "The Midnight Margarita Box",
      slug: "midnight-margarita-box",
      description: DESCRIPTION,
      priceCents: 6800,
      shippingCents: 950,
      inventory: 250,
      status: "LIVE",
    },
    update: {
      name: "The Midnight Margarita Box",
      description: DESCRIPTION,
      priceCents: 6800,
      shippingCents: 950,
      inventory: 250,
      status: "LIVE",
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.createMany({
    data: [
      { productId: product.id, url: "/drops/practical-magic/hero.svg", alt: "Moonlit Victorian house on a hill", position: 0 },
      { productId: product.id, url: "/drops/practical-magic/candle.svg", alt: "Hand-poured candle burning beside dried herbs", position: 1 },
      { productId: product.id, url: "/drops/practical-magic/apothecary.svg", alt: "Apothecary shelf with bottles and herb bundles", position: 2 },
    ],
  });

  await prisma.themeSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      headingFont: "Cormorant Garamond",
      bodyFont: "EB Garamond",
      primaryColor: "#f1e9d6",
      backgroundColor: "#161a24",
      accentColor: "#cf9b4a",
    },
    update: {
      headingFont: "Cormorant Garamond",
      bodyFont: "EB Garamond",
      primaryColor: "#f1e9d6",
      backgroundColor: "#161a24",
      accentColor: "#cf9b4a",
    },
  });

  console.log(`Demo drop live: ${product.name} (${product.slug})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
