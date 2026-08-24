import "server-only";
import { Octokit } from "@octokit/rest";

export type CommitFile = {
  /** repo-relative path, e.g. "src/content/teaser.json" */
  path: string;
  content: string;
  encoding: "utf-8" | "base64";
};

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO must be set to save content to GitHub."
    );
  }

  return { token, owner, repo, branch };
}

/** Commits every file in one atomic commit via the Git Data API (blobs -> tree ->
 * commit -> ref update), rather than the Contents API, which would create one
 * commit per file. */
export async function commitFiles(files: CommitFile[], message: string) {
  const { token, owner, repo, branch } = getConfig();
  const octokit = new Octokit({ auth: token });

  const { data: ref } = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
  const baseCommitSha = ref.object.sha;

  const { data: baseCommit } = await octokit.git.getCommit({ owner, repo, commit_sha: baseCommitSha });

  const blobs = await Promise.all(
    files.map(async (f) => {
      const { data: blob } = await octokit.git.createBlob({
        owner,
        repo,
        content: f.content,
        encoding: f.encoding,
      });
      return { path: f.path, sha: blob.sha };
    })
  );

  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: baseCommit.tree.sha,
    tree: blobs.map((b) => ({
      path: b.path,
      mode: "100644" as const,
      type: "blob" as const,
      sha: b.sha,
    })),
  });

  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.sha,
    parents: [baseCommitSha],
  });

  await octokit.git.updateRef({ owner, repo, ref: `heads/${branch}`, sha: newCommit.sha });

  return { sha: newCommit.sha, url: newCommit.html_url };
}
