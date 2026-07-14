import Link from "next/link";
import { getOrCreateManagedProduct, getOrCreateTheme } from "@/lib/admin-data";
import ProductForm from "./product-form";
import ImageManager from "./image-manager";
import ThemeForm from "./theme-form";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [product, theme] = await Promise.all([getOrCreateManagedProduct(), getOrCreateTheme()]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">
          Editing the current drop. Set status to <span className="text-[#c9a227]">Live</span> to publish it on{" "}
          <Link href="/" className="underline">
            the landing page
          </Link>
          .
        </p>
      </div>

      <ProductForm product={product} />
      <ImageManager productId={product.id} images={product.images} />
      <ThemeForm theme={theme} />
    </div>
  );
}
