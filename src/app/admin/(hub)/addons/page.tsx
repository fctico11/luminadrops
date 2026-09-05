import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/products";
import { deleteAddOn } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminAddOnsPage() {
  const addOns = await prisma.addOn.findMany({ include: { product: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/50">
          Optional upsells shown on the bag page once their linked product is already in the
          customer&apos;s cart. Create, edit, or remove them here.
        </p>
        <Link
          href="/admin/addons/new"
          className="shrink-0 border border-[#c9a227]/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#c9a227] transition hover:bg-[#c9a227]/10"
        >
          New add-on
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {addOns.length === 0 && <p className="text-sm text-white/40">No add-ons yet.</p>}

        {addOns.map((addOn) => (
          <div key={addOn.id} className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-5 py-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-[#f5f2ea]">{addOn.name}</p>
                <span
                  className={
                    addOn.status === "LIVE"
                      ? "text-xs uppercase tracking-wider text-[#c9a227]"
                      : "text-xs uppercase tracking-wider text-white/40"
                  }
                >
                  {addOn.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/40">
                {formatPrice(addOn.priceCents, addOn.currency)} · {addOn.inventory} in stock · tied to{" "}
                {addOn.product.name}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={`/admin/addons/${addOn.id}`}
                className="border border-white/15 px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white"
              >
                Edit
              </Link>
              <form action={deleteAddOn.bind(null, addOn.id)}>
                <button
                  type="submit"
                  className="border border-red-400/30 px-3 py-1.5 text-xs uppercase tracking-wider text-red-400 transition hover:border-red-400/60 hover:bg-red-400/10"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
