"use client";

import { useActionState } from "react";
import Image from "next/image";
import type { AddOn } from "@/generated/prisma";
import { type AddOnFormState } from "./actions";

type Props = {
  addOn: AddOn | null;
  products: { id: string; name: string }[];
  action: (prevState: AddOnFormState, formData: FormData) => Promise<AddOnFormState>;
};

const STATUS_OPTIONS = ["DRAFT", "LIVE", "SOLD_OUT", "ARCHIVED"] as const;

export default function AddOnForm({ addOn, products, action }: Props) {
  const [state, formAction, pending] = useActionState<AddOnFormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="mt-8 space-y-5 border border-white/10 bg-white/[0.03] p-6">
      {addOn && <input type="hidden" name="id" value={addOn.id} />}

      <div>
        <label htmlFor="name" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={addOn?.name}
          placeholder="THE AFTER MIDNIGHT CHARM"
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
          defaultValue={addOn?.description}
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
            min="0"
            required
            defaultValue={addOn ? (addOn.priceCents / 100).toFixed(2) : "20.00"}
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
          />
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
            defaultValue={addOn?.inventory ?? 0}
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
          />
          <p className="mt-1 text-xs text-white/40">Decreases automatically on each purchase.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={addOn?.status ?? "DRAFT"}
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-white/40">
            Only LIVE add-ons with stock left show up on the bag page.
          </p>
        </div>
        <div>
          <label htmlFor="productId" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
            Linked product
          </label>
          <select
            id="productId"
            name="productId"
            required
            defaultValue={addOn?.productId ?? products[0]?.id}
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-white/40">Only shown once this product is already in the bag.</p>
        </div>
      </div>

      <div>
        <label htmlFor="image" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
          Photo
        </label>
        {addOn?.imageUrl && (
          <div className="relative mb-2 h-28 w-28 overflow-hidden border border-white/15">
            <Image src={addOn.imageUrl} alt={addOn.name} fill className="object-cover" />
          </div>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none file:mr-3 file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-[#f5f2ea]"
        />
        <p className="mt-1 text-xs text-white/40">
          {addOn ? "Leave empty to keep the current photo." : "Optional — can be added later."}
        </p>
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="bg-[#c9a227] px-6 py-2 text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#e0b830] disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
