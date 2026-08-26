"use client";

import { useActionState } from "react";
import type { Product } from "@/generated/prisma";
import { updateProduct, type UpdateProductState } from "./actions";

export default function ProductForm({ product }: { product: Product }) {
  const [state, formAction, pending] = useActionState<UpdateProductState, FormData>(updateProduct, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-5 border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-white/40">
        <span>Slug: {product.slug}</span>
        <span className={product.status === "LIVE" ? "text-[#c9a227]" : "text-red-400"}>{product.status}</span>
      </div>

      <div>
        <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product.name}
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={product.description}
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.5"
            required
            defaultValue={(product.priceCents / 100).toFixed(2)}
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
          />
        </div>
        <div>
          <label htmlFor="shipping" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
            Shipping (USD)
          </label>
          <input
            id="shipping"
            name="shipping"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={(product.shippingCents / 100).toFixed(2)}
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="inventory" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
          Inventory
        </label>
        <input
          id="inventory"
          name="inventory"
          type="number"
          step="1"
          min="0"
          required
          defaultValue={product.inventory}
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
        />
        <p className="mt-1 text-xs text-white/40">
          Decreases automatically on each purchase. Setting this to 0 marks the drop sold out;
          raising it back above 0 makes it live again.
        </p>
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-[#c9a227]">Saved.</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-[#c9a227] px-6 py-2 text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#e0b830] disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
