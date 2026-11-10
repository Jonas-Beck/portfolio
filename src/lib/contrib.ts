import type { CollectionEntry } from "astro:content";

type ContribData = CollectionEntry<"contrib">["data"];

export type PrState = ContribData["prs"][number]["state"];
export type ContribState = "maintainer" | PrState;

// The contrib state is derived, never stored (docs/adr/0001). The rollup is
// the most advanced state true of every pr: all merged is "merged", and a
// single open pr holds the whole contrib at "open".
export function deriveContribState({
  maintainer,
  prs,
}: Pick<ContribData, "maintainer" | "prs">): ContribState {
  if (maintainer) return "maintainer";
  // The schema requires a pr, but `every` is vacuously true on an empty list
  // and would report unevidenced work as merged.
  if (prs.length === 0) throw new Error("A contrib with no prs has no state");
  return prs.every((pr) => pr.state === "merged") ? "merged" : "open";
}

// owner/name. Shared with the schema in src/content.config.ts.
export const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/;

export function repoUrl(repo: ContribData["repo"]): string {
  // Anything short of owner/name links somewhere real but wrong: "" is
  // GitHub's front page, "owner" is a profile.
  if (!REPO_PATTERN.test(repo)) {
    throw new Error(`Expected a repository as owner/name, got "${repo}"`);
  }
  return `https://github.com/${repo}`;
}
