import { Suspense } from "react";
import { getContent } from "@/lib/content";
import Motes from "../motes";
import AfterHours from "./after-hours";

export default function TmmcPage() {
  const content = getContent("tmmc");

  return (
    <main className="grain relative flex flex-1 flex-col">
      <Motes />
      <Suspense fallback={null}>
        <AfterHours content={content} />
      </Suspense>
    </main>
  );
}
