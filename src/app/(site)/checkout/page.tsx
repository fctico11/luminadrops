import { getContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { DROP01_SLUG } from "@/lib/products";
import CheckoutView from "./checkout-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout — Lumina Drops",
  description: "Complete your Lumina Drops order.",
};

export default async function CheckoutPage() {
  const drop01Content = getContent("drop01");
  const checkoutContent = getContent("checkout");
  const product = await prisma.product.findUnique({ where: { slug: DROP01_SLUG } });
  const addOn = product
    ? await prisma.addOn.findFirst({ where: { productId: product.id, status: "LIVE", inventory: { gt: 0 } } })
    : null;

  return (
    <CheckoutView
      content={checkoutContent}
      product={product}
      productImage={drop01Content.purchaseImage}
      productImageAlt={drop01Content.purchaseImageAlt}
      addOn={addOn}
    />
  );
}
