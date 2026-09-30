import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { setReviewStatus } from "./actions";
import type { ReviewStatus } from "@/generated/prisma";

export const dynamic = "force-dynamic";

function formatWhen(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} out of 5 stars`} className="text-[#e8d9ae]">
      {"✦".repeat(rating)}
      <span className="text-white/20">{"✦".repeat(5 - rating)}</span>
    </span>
  );
}

const STATUS_STYLE: Record<ReviewStatus, string> = {
  PENDING: "text-[#c9a227]",
  APPROVED: "text-emerald-400",
  REJECTED: "text-red-400",
};

export default async function AdminReviewSubmissionsPage() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  const pending = reviews.filter((r) => r.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-sm text-white/50">
        Reviews submitted from /reviews. Everything lands here unmoderated — nothing shown on the
        public site pulls from this list yet, so approving or rejecting is just for your own
        record-keeping until that's wired up.
      </p>

      <div className="mt-6 flex gap-4">
        <div className="border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Pending review</p>
          <p className="mt-1 text-2xl font-semibold text-[#f5f2ea]">{pending}</p>
        </div>
        <div className="border border-white/10 bg-white/[0.03] px-5 py-4">
          <p className="text-xs uppercase tracking-wider text-white/40">Total submitted</p>
          <p className="mt-1 text-2xl font-semibold text-[#f5f2ea]">{reviews.length}</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {reviews.length === 0 && <p className="text-sm text-white/40">No reviews submitted yet.</p>}

        {reviews.map((review) => (
          <div key={review.id} className="border border-white/10 bg-white/[0.03] px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold text-[#f5f2ea]">{review.name}</p>
                  <Stars rating={review.rating} />
                  <span className={`text-xs uppercase tracking-wider ${STATUS_STYLE[review.status]}`}>
                    {review.status}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-white/70">{review.body}</p>
                <p className="mt-2 text-xs text-white/40">
                  {formatWhen(review.createdAt)} · {review.consent ? "consented to public use" : "did not consent"}
                </p>
              </div>

              {review.photoUrl && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-white/10">
                  <Image src={review.photoUrl} alt="" fill sizes="80px" className="object-cover" />
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-3">
              <form action={setReviewStatus.bind(null, review.id, "APPROVED")}>
                <button
                  type="submit"
                  disabled={review.status === "APPROVED"}
                  className="border border-emerald-400/30 px-3 py-1.5 text-xs uppercase tracking-wider text-emerald-400 transition hover:border-emerald-400/60 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Approve
                </button>
              </form>
              <form action={setReviewStatus.bind(null, review.id, "REJECTED")}>
                <button
                  type="submit"
                  disabled={review.status === "REJECTED"}
                  className="border border-red-400/30 px-3 py-1.5 text-xs uppercase tracking-wider text-red-400 transition hover:border-red-400/60 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reject
                </button>
              </form>
              {review.status !== "PENDING" && (
                <form action={setReviewStatus.bind(null, review.id, "PENDING")}>
                  <button
                    type="submit"
                    className="border border-white/15 px-3 py-1.5 text-xs uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white"
                  >
                    Reset to pending
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
