import { prisma } from "@/lib/prisma";
import { DROP01_SLUG } from "@/lib/products";
import ProductForm from "./product-form";

export const dynamic = "force-dynamic";

export default async function AdminProductPage() {
  const product = await prisma.product.findUnique({ where: { slug: DROP01_SLUG } });

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-sm text-red-400">
          No product found for slug &quot;{DROP01_SLUG}&quot;. Run <code>npm run db:seed</code> to create it.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm text-white/50">
        This is the one live product backing the drop01 page — price, inventory, and copy here
        drive what customers see and buy. Inventory decreases automatically as orders come in.
      </p>
      <ProductForm product={product} />
    </div>
  );
}
