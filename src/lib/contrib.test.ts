import { describe, expect, it } from "vitest";
import { deriveContribState, repoUrl, type PrState } from "./contrib";

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
