import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import External from "./External.astro";

async function render(text: string) {
  const container = await AstroContainer.create();
  return container.renderToString(External, { props: { text } });
}

describe("External", () => {
  // The mark must not wrap onto a line of its own.
  it("binds the last word to the mark", async () => {
    const html = await render("Kubernetes and Cloud Native Associate");
    expect(html).toMatch(
      /^Kubernetes and Cloud Native <span class="whitespace-nowrap">Associate <svg/,
    );
  });

  it("binds a one-word label whole", async () => {
    const html = await render("github");
    expect(html).toMatch(/^<span class="whitespace-nowrap">github <svg/);
  });

  it("tells screen readers the link opens a new tab", async () => {
    const html = await render("github");
    expect(html).toContain(
      '<span class="sr-only"> (opens in a new tab)</span>',
    );
  });
});
