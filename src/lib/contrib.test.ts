import { describe, expect, it } from "vitest";
import {
  deriveContribState,
  repoUrl,
  sortContribs,
  type PrState,
} from "./contrib";

const pr = (state: PrState) => ({
  title: "a pr",
  url: "https://github.com/owner/repo/pull/1",
  state,
});

describe("deriveContribState", () => {
  it("is merged when every pr is merged", () => {
    expect(
      deriveContribState({
        maintainer: false,
        prs: [pr("merged"), pr("merged")],
      }),
    ).toBe("merged");
  });

  it("is maintainer when Jonas maintains the repository, whatever the prs say", () => {
    expect(deriveContribState({ maintainer: true, prs: [pr("open")] })).toBe(
      "maintainer",
    );
  });

  it("is maintainer for a maintained repository that lists no prs", () => {
    expect(deriveContribState({ maintainer: true, prs: [] })).toBe(
      "maintainer",
    );
  });

  // The rollup: the most advanced state true of every pr. With only open and
  // merged, one open pr holds the whole contrib at open.
  it("is open while any pr is still open", () => {
    expect(
      deriveContribState({
        maintainer: false,
        prs: [pr("merged"), pr("open")],
      }),
    ).toBe("open");
  });

  it("refuses a contrib with no prs rather than calling it merged", () => {
    expect(() => deriveContribState({ maintainer: false, prs: [] })).toThrow(
      /no prs/,
    );
  });
});

describe("repoUrl", () => {
  it("links an owner/name repository on GitHub", () => {
    expect(repoUrl("backstage/backstage")).toBe(
      "https://github.com/backstage/backstage",
    );
  });

  it("refuses an empty repository instead of linking GitHub's front page", () => {
    expect(() => repoUrl("")).toThrow(/owner\/name/);
  });
});

describe("sortContribs", () => {
  const entry = (name: string, maintainer: boolean, states: PrState[]) => ({
    data: { name, maintainer, prs: states.map(pr) },
  });

  // Strongest claim first: maintained, then landed, then still in review.
  it("orders maintainer, then merged, then open", () => {
    const sorted = sortContribs([
      entry("open-one", false, ["open"]),
      entry("merged-one", false, ["merged"]),
      entry("maintained-one", true, []),
    ]);
    expect(sorted.map(({ data }) => data.name)).toEqual([
      "maintained-one",
      "merged-one",
      "open-one",
    ]);
  });

  it("orders contribs in the same state by name", () => {
    const sorted = sortContribs([
      entry("github-actions-cache-server", false, ["merged"]),
      entry("backstage events kafka module", false, ["merged", "merged"]),
    ]);
    expect(sorted.map(({ data }) => data.name)).toEqual([
      "backstage events kafka module",
      "github-actions-cache-server",
    ]);
  });
});
