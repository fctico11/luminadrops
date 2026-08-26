import { prisma } from "@/lib/prisma";
import { DROP01_SLUG } from "@/lib/products";
import CheckoutView from "./checkout-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout — Lumina Drops",
  description: "Complete your Lumina Drops order.",
};

export default async function CheckoutPage() {
  const product = await prisma.product.findUnique({ where: { slug: DROP01_SLUG } });

  return <CheckoutView product={product} />;
}
