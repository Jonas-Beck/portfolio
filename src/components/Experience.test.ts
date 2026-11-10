import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import Experience from "./Experience.astro";

function role(
  data: Partial<CollectionEntry<"experience">["data"]>,
): CollectionEntry<"experience"> {
  return {
    id: "velux-core-platform-engineer",
    collection: "experience",
    data: {
      company: "VELUX",
      position: "Core Platform Engineer",
      start: "2026-08",
      summary: ["Self-hosted GitHub Actions runners on Kubernetes."],
      ...data,
    },
  };
}

async function render(experience: CollectionEntry<"experience">[]) {
  const container = await AstroContainer.create();
  return container.renderToString(Experience, { props: { experience } });
}

// The badge is matched by its data attribute, not its text, so a change of
// wording (or a date range ending in "Present") cannot fool the assertion.
describe("Experience", () => {
  it("badges the current role", async () => {
    const html = await render([role({})]);
    expect(html).toContain("data-current-role");
  });

  it("does not badge a role that has ended", async () => {
    const html = await render([role({ end: "2026-09" })]);
    expect(html).toContain("Core Platform Engineer");
    expect(html).not.toContain("data-current-role");
  });

  it("heads consecutive roles at one company with the company once", async () => {
    const html = await render([
      role({}),
      role({ position: "Junior Developer in CCoE", end: "2026-07" }),
    ]);
    expect(html).toContain("Junior Developer in CCoE");
    expect(html.match(/<h3\b/g)).toHaveLength(1);
  });

  it("sets a backticked name as code", async () => {
    const html = await render([role({ summary: ["Built `helms-deep`."] })]);
    expect(html).toMatch(/<code\b[^>]*>helms-deep<\/code>/);
  });

  it("leaves a line without backticks free of code", async () => {
    const html = await render([role({})]);
    expect(html).toContain("Self-hosted GitHub Actions runners");
    expect(html).not.toContain("<code");
  });
});
