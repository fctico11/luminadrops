import Link from "next/link";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let email: string | null = null;
  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      email = session.customer_details?.email ?? null;
    } catch {
      // ignore — still show a generic confirmation
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-6 text-center text-[#f5f2ea]">
      <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a227]">Order confirmed</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">You&apos;re in the drop.</h1>
      <p className="mt-3 max-w-sm text-sm text-white/60">
        {email ? `A receipt is on its way to ${email}.` : "A receipt is on its way to your inbox."} We&apos;ll email
        you when it ships.
      </p>
      <Link href="/" className="mt-8 border border-white/20 px-5 py-2 text-xs uppercase tracking-wider text-white/70 transition hover:border-[#c9a227] hover:text-[#c9a227]">
        Back to site
      </Link>
    </div>
  );
}
