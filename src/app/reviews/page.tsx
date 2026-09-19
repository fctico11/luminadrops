import { getContent } from "@/lib/content";
import Motes from "../motes";
import ReviewForm from "./review-form";

export default function ReviewsPage() {
  const content = getContent("reviews");

  return (
    <main className="grain relative flex flex-1 flex-col">
      <Motes />
      <ReviewForm content={content} />
    </main>
  );
}
