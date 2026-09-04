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
            Flat shipping fallback (USD)
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
          <p className="mt-1 text-xs text-white/40">
            Only used if the live carrier rate lookup fails — normally shipping is calculated
            per order from the package details below.
          </p>
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

      <div className="border-t border-white/10 pt-5">
        <p className="mb-3 text-xs uppercase tracking-wider text-white/50">Package details (for shipping rates)</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="weightOz" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Weight (oz)
            </label>
            <input
              id="weightOz"
              name="weightOz"
              type="number"
              step="0.1"
              min="0"
              required
              defaultValue={product.weightOz}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
          <div>
            <label htmlFor="lengthIn" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Length (in)
            </label>
            <input
              id="lengthIn"
              name="lengthIn"
              type="number"
              step="0.1"
              min="0"
              required
              defaultValue={product.lengthIn}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
          <div>
            <label htmlFor="widthIn" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Width (in)
            </label>
            <input
              id="widthIn"
              name="widthIn"
              type="number"
              step="0.1"
              min="0"
              required
              defaultValue={product.widthIn}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
          <div>
            <label htmlFor="heightIn" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Height (in)
            </label>
            <input
              id="heightIn"
              name="heightIn"
              type="number"
              step="0.1"
              min="0"
              required
              defaultValue={product.heightIn}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-5">
        <p className="mb-1 text-xs uppercase tracking-wider text-white/50">Ship-from address</p>
        <p className="mb-3 text-xs text-white/40">
          Used only to calculate shipping rates — never shown to customers.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="shipFromName" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Name
            </label>
            <input
              id="shipFromName"
              name="shipFromName"
              type="text"
              required
              defaultValue={product.shipFromName}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
          <div>
            <label htmlFor="shipFromStreet1" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Street address
            </label>
            <input
              id="shipFromStreet1"
              name="shipFromStreet1"
              type="text"
              required
              defaultValue={product.shipFromStreet1}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
          <div>
            <label htmlFor="shipFromStreet2" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Apt, suite, etc. (optional)
            </label>
            <input
              id="shipFromStreet2"
              name="shipFromStreet2"
              type="text"
              defaultValue={product.shipFromStreet2}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label htmlFor="shipFromCity" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
                City
              </label>
              <input
                id="shipFromCity"
                name="shipFromCity"
                type="text"
                required
                defaultValue={product.shipFromCity}
                className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
              />
            </div>
            <div>
              <label htmlFor="shipFromState" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
                State
              </label>
              <input
                id="shipFromState"
                name="shipFromState"
                type="text"
                maxLength={2}
                required
                defaultValue={product.shipFromState}
                className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
              />
            </div>
            <div>
              <label htmlFor="shipFromZip" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
                ZIP
              </label>
              <input
                id="shipFromZip"
                name="shipFromZip"
                type="text"
                required
                defaultValue={product.shipFromZip}
                className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
              />
            </div>
          </div>
          <div className="w-32">
            <label htmlFor="shipFromCountry" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Country
            </label>
            <input
              id="shipFromCountry"
              name="shipFromCountry"
              type="text"
              maxLength={2}
              required
              defaultValue={product.shipFromCountry}
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>
        </div>
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
