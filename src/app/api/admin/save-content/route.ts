import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { isAdminSession } from "@/lib/session";
import { getContent, contentPath, setByPath, type ContentName } from "@/lib/content";
import { commitFiles, type CommitFile } from "@/lib/github";

type TextEdit = { file: ContentName; field: string; value: string };
type ListEdit = { file: ContentName; field: string; value: string[] };
type ImageEdit = { path: string; dataUrl: string };

export async function POST(req: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const textEdits: TextEdit[] = body?.textEdits ?? [];
  const imageEdits: ImageEdit[] = body?.imageEdits ?? [];
  const listEdits: ListEdit[] = (body?.listEdits ?? []).filter(
    (e: ListEdit) => Array.isArray(e?.value) && e.value.every((v) => typeof v === "string")
  );

  if (textEdits.length === 0 && imageEdits.length === 0 && listEdits.length === 0) {
    return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  }

  try {
    const byFile = new Map<ContentName, { texts: TextEdit[]; lists: ListEdit[] }>();
    const bucket = (file: ContentName) => {
      const entry = byFile.get(file) ?? { texts: [], lists: [] };
      byFile.set(file, entry);
      return entry;
    };
    for (const edit of textEdits) bucket(edit.file).texts.push(edit);
    for (const edit of listEdits) bucket(edit.file).lists.push(edit);

    const filesToCommit: CommitFile[] = [];

    for (const [name, { texts, lists }] of byFile) {
      const current = getContent(name) as unknown as Record<string, unknown>;
      for (const edit of texts) {
        setByPath(current, edit.field, edit.value);
      }
      for (const edit of lists) {
        // Rows added in the editor and left blank are dropped rather than
        // saved as empty paragraphs.
        setByPath(
          current,
          edit.field,
          edit.value.map((v) => v.trim()).filter((v) => v.length > 0)
        );
      }
      const json = JSON.stringify(current, null, 2) + "\n";
      filesToCommit.push({ path: `src/content/${name}.json`, content: json, encoding: "utf-8" });

      try {
        fs.writeFileSync(contentPath(name), json, "utf-8");
      } catch {
        // read-only filesystem in production — the GitHub commit below is the source of truth there
      }
    }

    for (const edit of imageEdits) {
      const match = edit.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!match) continue;
      const base64 = match[2];
      const publicPath = edit.path.startsWith("/") ? edit.path.slice(1) : edit.path;
      filesToCommit.push({ path: `public/${publicPath}`, content: base64, encoding: "base64" });

      try {
        fs.writeFileSync(path.join(process.cwd(), "public", publicPath), Buffer.from(base64, "base64"));
      } catch {
        // read-only filesystem in production
      }
    }

    const commit = await commitFiles(
      filesToCommit,
      `Admin: update site content (${new Date().toISOString()})`
    );

    return NextResponse.json({ ok: true, commit });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Save failed." },
      { status: 500 }
    );
  }
}
