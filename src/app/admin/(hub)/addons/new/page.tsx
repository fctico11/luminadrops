import { prisma } from "@/lib/prisma";
import AddOnForm from "../addon-form";
import { createAddOn } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewAddOnPage() {
  const products = await prisma.product.findMany({ select: { id: true, name: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm text-white/50">New add-on</p>
      <AddOnForm addOn={null} products={products} action={createAddOn} />
    </div>
  );
}
