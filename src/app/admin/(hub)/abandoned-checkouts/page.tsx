import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

function formatWhen(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminAbandonedCheckoutsPage() {
  const rows = await prisma.abandonedCheckout.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const stillAbandoned = rows.filter((r) => !r.completedAt).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-white/50">
        Emails captured mid-checkout (as soon as someone types a valid address) before they finish
        paying. &quot;Completed&quot; means the Stripe webhook later saw that same session finish —
        the rest never came back to pay. hello@luminadrops.com gets a notification email for each
        one that's still abandoned 20 minutes after it was captured; paying within that window
        cancels it, so a completed order never triggers an alert. No follow-up email is sent to the
        customer themselves yet.
      </p>

      <div className="mt-6 flex gap-4">
        <div className="border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Still abandoned</p>
          <p className="mt-1 text-2xl font-semibold text-[#f5f2ea]">{stillAbandoned}</p>
        </div>
        <div className="border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Total captured</p>
          <p className="mt-1 text-2xl font-semibold text-[#f5f2ea]">{rows.length}</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {rows.length === 0 && <p className="text-sm text-white/40">No emails captured yet.</p>}

        {rows.map((row) => (
          <div
            key={row.id}
            className={`flex items-center justify-between border px-5 py-4 ${
              row.completedAt
                ? "border-white/10 bg-white/[0.03]"
                : "border-[#c9a227]/30 bg-[#c9a227]/[0.06]"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="truncate text-sm font-semibold text-[#f5f2ea]">{row.email}</p>
                <span
                  className={
                    row.completedAt
                      ? "shrink-0 text-xs uppercase tracking-wider text-white/40"
                      : "shrink-0 text-xs uppercase tracking-wider text-[#c9a227]"
                  }
                >
                  {row.completedAt ? "Completed" : "Abandoned"}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/40">
                {row.productName} · Qty {row.quantity}
                {row.addOnName ? ` · ${row.addOnName}` : ""} ·{" "}
                {formatPrice(row.amountTotalCents, row.currency)}
              </p>
            </div>
            <div className="shrink-0 pl-4 text-right text-xs text-white/40">
              <p>Captured {formatWhen(row.createdAt)}</p>
              {row.completedAt && <p className="mt-0.5">Completed {formatWhen(row.completedAt)}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
