import { getContent } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import BackRoomBoard from "./board";

export default async function BackRoomPage() {
  const content = getContent("tmmc");
  const posts = await prisma.tmmcPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="flex flex-1 flex-col">
      <BackRoomBoard
        content={content}
        initialPosts={posts.map((p) => ({
          id: p.id,
          handle: p.handle,
          body: p.body,
          category: p.category,
          likes: p.likes,
          createdAt: p.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
