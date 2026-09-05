import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddOnForm from "../addon-form";
import { updateAddOn } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditAddOnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [addOn, products] = await Promise.all([
    prisma.addOn.findUnique({ where: { id } }),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { createdAt: "desc" } }),
  ]);

  if (!addOn) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="text-sm text-white/50">Edit add-on</p>
      <AddOnForm addOn={addOn} products={products} action={updateAddOn} />
    </div>
  );
}
