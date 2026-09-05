import { getContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { DROP01_SLUG } from "@/lib/products";
import CartView from "./cart-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bag — Lumina Drops",
  description: "Your Lumina Drops bag.",
};

export default async function CartPage() {
  const content = getContent("cart");
  const drop01Content = getContent("drop01");
  const product = await prisma.product.findUnique({ where: { slug: DROP01_SLUG } });
  const addOn = product
    ? await prisma.addOn.findFirst({ where: { productId: product.id, status: "LIVE", inventory: { gt: 0 } } })
    : null;

  return (
    <CartView
      content={content}
      product={product}
      productImage={drop01Content.purchaseImage}
      productImageAlt={drop01Content.purchaseImageAlt}
      addOn={addOn}
    />
  );
}
