import { getSession } from "@/lib/session";
import { logout } from "@/app/admin/actions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a227]">Lumina Drops</p>
          <h1 className="text-lg font-semibold">Admin</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>{session?.email}</span>
          <form action={logout}>
            <button
              type="submit"
              className="border border-white/15 px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
