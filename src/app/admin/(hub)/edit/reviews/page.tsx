import ReviewsPage from "@/app/reviews/page";
import EditRoot from "@/components/edit/EditRoot";

export default function AdminEditReviewsPage() {
  return (
    <EditRoot>
      <div className="bg-[#141115] text-[#e9e1cd]">
        <ReviewsPage />
      </div>
    </EditRoot>
  );
}
