"use client";

import { useActionState } from "react";
import { updateTheme, type FormState } from "./actions";

type Props = {
  theme: {
    headingFont: string;
    bodyFont: string;
    primaryColor: string;
    backgroundColor: string;
    accentColor: string;
  };
};

const FONT_SUGGESTIONS = [
  "Anton",
  "Bebas Neue",
  "Playfair Display",
  "Fraunces",
  "Archivo Black",
  "IBM Plex Mono",
  "Space Mono",
  "Cormorant Garamond",
];

export default function ThemeForm({ theme }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateTheme, undefined);

  return (
    <form action={formAction} className="space-y-4 border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-xs uppercase tracking-wider text-white/50">Site look &amp; feel</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Heading font</label>
          <input
            name="headingFont"
            defaultValue={theme.headingFont}
            list="font-suggestions"
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Body font</label>
          <input
            name="bodyFont"
            defaultValue={theme.bodyFont}
            list="font-suggestions"
            className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm outline-none focus:border-[#c9a227]"
          />
        </div>
        <datalist id="font-suggestions">
          {FONT_SUGGESTIONS.map((f) => (
            <option key={f} value={f} />
          ))}
        </datalist>
      </div>
      <p className="-mt-2 text-xs text-white/30">Any Google Fonts family name works.</p>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Text color</label>
          <div className="flex items-center gap-2">
            <input type="color" name="primaryColorPicker" defaultValue={theme.primaryColor} className="h-9 w-9 shrink-0 border border-white/15 bg-transparent p-0" onChange={(e) => {
              const input = e.currentTarget.form?.elements.namedItem("primaryColor") as HTMLInputElement | null;
              if (input) input.value = e.currentTarget.value;
            }} />
            <input name="primaryColor" defaultValue={theme.primaryColor} className="w-full border border-white/15 bg-black/40 px-2 py-2 text-xs outline-none focus:border-[#c9a227]" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Background</label>
          <div className="flex items-center gap-2">
            <input type="color" name="backgroundColorPicker" defaultValue={theme.backgroundColor} className="h-9 w-9 shrink-0 border border-white/15 bg-transparent p-0" onChange={(e) => {
              const input = e.currentTarget.form?.elements.namedItem("backgroundColor") as HTMLInputElement | null;
              if (input) input.value = e.currentTarget.value;
            }} />
            <input name="backgroundColor" defaultValue={theme.backgroundColor} className="w-full border border-white/15 bg-black/40 px-2 py-2 text-xs outline-none focus:border-[#c9a227]" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/50">Accent</label>
          <div className="flex items-center gap-2">
            <input type="color" name="accentColorPicker" defaultValue={theme.accentColor} className="h-9 w-9 shrink-0 border border-white/15 bg-transparent p-0" onChange={(e) => {
              const input = e.currentTarget.form?.elements.namedItem("accentColor") as HTMLInputElement | null;
              if (input) input.value = e.currentTarget.value;
            }} />
            <input name="accentColor" defaultValue={theme.accentColor} className="w-full border border-white/15 bg-black/40 px-2 py-2 text-xs outline-none focus:border-[#c9a227]" />
          </div>
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-400">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="border border-[#c9a227] px-5 py-2 text-sm font-semibold uppercase tracking-wider text-[#c9a227] transition hover:bg-[#c9a227] hover:text-black disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save theme"}
      </button>
    </form>
  );
}
