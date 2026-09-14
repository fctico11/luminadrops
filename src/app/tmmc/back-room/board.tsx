"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import EditableText from "@/components/edit/EditableText";
import RoomModal from "../room-modal";
import { findRoom } from "../rooms";
import { createPost, likePost, type PostCategory } from "./actions";
import type { TmmcContent } from "@/lib/content";

export type BoardPost = {
  id: string;
  handle: string;
  body: string;
  category: PostCategory;
  likes: number;
  createdAt: string;
};

const MAX_LENGTH = 300;

const TABS: { label: string; value: "ALL" | PostCategory }[] = [
  { label: "All", value: "ALL" },
  { label: "Notes", value: "NOTE" },
  { label: "Recommendations", value: "RECOMMENDATION" },
  { label: "Little Joys", value: "LITTLE_JOY" },
];

const CATEGORY_OPTIONS: { label: string; value: PostCategory }[] = [
  { label: "A note", value: "NOTE" },
  { label: "A recommendation", value: "RECOMMENDATION" },
  { label: "A little joy", value: "LITTLE_JOY" },
];

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const room = findRoom("back-room")!;

export default function BackRoomBoard({ content, initialPosts }: { content: TmmcContent; initialPosts: BoardPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("ALL");
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState<PostCategory>("NOTE");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const visiblePosts = useMemo(
    () => (tab === "ALL" ? posts : posts.filter((p) => p.category === tab)),
    [posts, tab]
  );

  const submit = () => {
    const body = draft.trim();
    if (!body || isPending) return;

    // Optimistic: show it immediately with a temp id, replaced by the real
    // list once the server action's revalidation lands.
    const optimistic: BoardPost = {
      id: `pending-${Date.now()}`,
      handle: "You",
      body,
      category,
      likes: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [optimistic, ...prev]);
    setDraft("");

    startTransition(async () => {
      await createPost(body, category);
      router.refresh();
    });
  };

  const like = (id: string) => {
    if (likedIds.has(id) || id.startsWith("pending-")) return;
    setLikedIds((prev) => new Set(prev).add(id));
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
    startTransition(async () => {
      await likePost(id);
    });
  };

  return (
    <RoomModal room={room} onClose={() => router.push("/tmmc")} onNavigate={undefined} tagline={content.backRoomTagline}>
      <EditableText
        file="tmmc"
        field="backRoomBody"
        value={content.backRoomBody}
        as="p"
        className="mx-auto max-w-sm text-sm leading-relaxed text-[#c4bba8]"
      />

      <div className="mt-8 border border-[#4c4740] bg-white/[0.03] p-4 text-left">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="Leave a note..."
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-[#e9e1cd] outline-none placeholder:text-[#6f695c]"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={`border px-3 py-1 text-[10px] tracking-[0.15em] transition-colors duration-300 ${
                  category === opt.value
                    ? "border-[#cfc0a0] text-[#fff6e0]"
                    : "border-[#4c4740] text-[#9c9384] hover:border-[#6f695c]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="text-[10px] tabular-nums text-[#6f695c]">
            {draft.length}/{MAX_LENGTH}
          </span>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={!draft.trim() || isPending}
            className="border border-[#6f695c] px-6 py-2 text-[11px] tracking-[0.2em] text-[#e9e1cd] transition-all duration-300 hover:border-[#cfc0a0] hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
          >
            POST +
          </button>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-xs items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-[#4c4740]" />
        <span className="teaser-twinkle text-[11px] text-[#cfc6b1]">✦</span>
        <span className="h-px flex-1 bg-[#4c4740]" />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.2em]">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`transition-colors duration-300 ${
              tab === t.value ? "text-[#fff6e0]" : "text-[#6f695c] hover:text-[#b9b09d]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4 text-left">
        {visiblePosts.length === 0 && (
          <p className="py-6 text-center text-sm text-[#6f695c]">Nothing here yet — be the first.</p>
        )}
        {visiblePosts.map((post) => (
          <div key={post.id} className="border-b border-[#2a2620] pb-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-medium tracking-[0.1em] text-[#e9e1cd]">{post.handle}</p>
              <p className="text-[10px] text-[#6f695c]">{timeAgo(post.createdAt)}</p>
            </div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#c4bba8]">{post.body}</p>
            <button
              type="button"
              onClick={() => like(post.id)}
              disabled={likedIds.has(post.id)}
              className="mt-2 flex items-center gap-1.5 text-[11px] text-[#9c9384] transition-colors duration-300 hover:text-[#e07a5f] disabled:cursor-default"
            >
              <span aria-hidden>{likedIds.has(post.id) ? "♥" : "♡"}</span>
              <span className="tabular-nums">{post.likes}</span>
            </button>
          </div>
        ))}
      </div>
    </RoomModal>
  );
}
