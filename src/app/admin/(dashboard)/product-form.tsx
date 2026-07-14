"use client";

import { useActionState } from "react";
import { updateProduct, type FormState } from "./actions";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    priceCents: number;
    shippingCents: number;
    inventory: number;
    status: "DRAFT" | "LIVE" | "SOLD_OUT" | "ARCHIVED";
  };
};

export default function ProductForm({ product }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateProduct, undefined);

  return (
    <form action={formAction} className="space-y-4 border border-white/10 bg-white/[0.03] p-6">
      <input type="hidden" name="productId" value={product.id} />

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Drop name</label>
        <input
          name="name"
          defaultValue={product.name}
          required
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">
          URL slug <span className="normal-case text-white/30">(luminadrops.com/?)</span>
        </label>
        <input
          name="slug"
          defaultValue={product.slug}
          required
          pattern="[a-z0-9-]+"
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Description</label>
        <textarea
          name="description"
          defaultValue={product.description}
          rows={5}
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Price (USD)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={(product.priceCents / 100).toFixed(2)}
            required
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Shipping (USD)</label>
          <input
            name="shipping"
            type="number"
            step="0.01"
            min="0"
            defaultValue={(product.shippingCents / 100).toFixed(2)}
            required
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Inventory</label>
          <input
            name="inventory"
            type="number"
            min="0"
            step="1"
            defaultValue={product.inventory}
            required
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Status</label>
        <select
          name="status"
          defaultValue={product.status}
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
        >
          <option value="DRAFT">Draft (hidden)</option>
          <option value="LIVE">Live (visible on site)</option>
          <option value="SOLD_OUT">Sold out</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-400">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-[#c9a227] px-5 py-2 text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#e0b830] disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save product"}
      </button>
    </form>
  );
}
