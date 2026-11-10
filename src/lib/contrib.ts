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
  // Only a maintainer contrib may list no prs, and that returned above. Past
  // here `every` would be vacuously true on an empty list and report
  // unevidenced work as merged.
  if (prs.length === 0) throw new Error("A contrib with no prs has no state");
  return prs.every((pr) => pr.state === "merged") ? "merged" : "open";
}

const STATE_RANK: Record<ContribState, number> = {
  maintainer: 0,
  merged: 1,
  open: 2,
};

// Strongest claim first, then by name. `getCollection` returns entries by id,
// not in file order, so the order has to be derived. Plain comparison rather
// than localeCompare, so the order does not depend on the build machine.
export function sortContribs<
  Entry extends { data: Pick<ContribData, "name" | "maintainer" | "prs"> },
>(entries: readonly Entry[]): Entry[] {
  const rank = ({ data }: Entry) => STATE_RANK[deriveContribState(data)];
  return entries.toSorted(
    (a, b) =>
      rank(a) - rank(b) ||
      (a.data.name < b.data.name ? -1 : a.data.name > b.data.name ? 1 : 0),
  );
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
