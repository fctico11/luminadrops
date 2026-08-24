"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 font-[family-name:var(--font-mono)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a227]">Lumina Drops</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#f5f2ea]">
            Admin sign in
          </h1>
        </div>

        <form action={formAction} className="space-y-4 border border-white/10 bg-white/[0.03] p-6">
          <div>
            <label htmlFor="password" className="mb-1 block text-xs uppercase tracking-wider text-white/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-[#f5f2ea] outline-none focus:border-[#c9a227]"
            />
          </div>

          {state?.error && <p className="text-sm text-red-400">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#c9a227] py-2 text-sm font-semibold uppercase tracking-wider text-black transition hover:bg-[#e0b830] disabled:opacity-50"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
