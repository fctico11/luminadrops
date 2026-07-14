"use client";

import { useActionState, useRef } from "react";
import Image from "next/image";
import { uploadProductImage, removeProductImage, type FormState } from "./actions";

type Props = {
  productId: string;
  images: { id: string; url: string; alt: string }[];
};

export default function ImageManager({ productId, images }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(uploadProductImage, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-4 border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xs uppercase tracking-wider text-white/50">Product images</h2>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden border border-white/10">
              <Image src={image.url} alt={image.alt} fill className="object-cover" />
              <form action={removeProductImage.bind(null, image.id)}>
                <button
                  type="submit"
                  className="absolute right-1 top-1 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-wider text-white opacity-0 transition group-hover:opacity-100"
                >
                  Remove
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <form
        ref={formRef}
        action={async (formData) => {
          await formAction(formData);
          formRef.current?.reset();
        }}
        className="flex items-center gap-3"
      >
        <input type="hidden" name="productId" value={productId} />
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="flex-1 text-xs text-white/60 file:mr-3 file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:uppercase file:tracking-wider file:text-white"
        />
        <button
          type="submit"
          disabled={pending}
          className="whitespace-nowrap border border-white/15 px-4 py-2 text-xs uppercase tracking-wider transition hover:border-[#c9a227] hover:text-[#c9a227] disabled:opacity-50"
        >
          {pending ? "Uploading..." : "Upload"}
        </button>
      </form>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
    </div>
  );
}
