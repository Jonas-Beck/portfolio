import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import Contrib from "./Contrib.astro";

function contrib(
  data: Partial<CollectionEntry<"contrib">["data"]>,
): CollectionEntry<"contrib"> {
  return {
    id: "kafka-events",
    collection: "contrib",
    data: {
      slug: "kafka-events",
      name: "backstage events kafka",
      repo: "backstage/backstage",
      summary: "Kafka module for the Backstage events plugin",
      maintainer: false,
      prs: [
        {
          title: "feat(events): kafka pull support",
          url: "https://github.com/backstage/backstage/pull/1",
          state: "merged",
        },
      ],
      ...data,
    },
  };
}

async function render(contribs: CollectionEntry<"contrib">[]) {
  const container = await AstroContainer.create();
  return container.renderToString(Contrib, { props: { contribs } });
}

describe("Contrib", () => {
  it("renders no media panel for a contrib with no image", async () => {
    const html = await render([contrib({})]);
    expect(html).toContain("backstage events kafka");
    expect(html).not.toContain("<figure");
  });

  it("renders a media panel when the contrib has an image", async () => {
    const html = await render([contrib({ image: "/kafka.png" })]);
    expect(html).toContain("<figure");
  });

  // The state is matched by its data attribute, as the badge in
  // Experience.test.ts is, so wording and styling stay free to change.
  it("shows open while any pr is still open", async () => {
    const html = await render([
      contrib({
        prs: [
          {
            title: "feat(events): kafka pull support",
            url: "https://github.com/backstage/backstage/pull/1",
            state: "merged",
          },
          {
            title: "feat(events): kafka push support",
            url: "https://github.com/backstage/backstage/pull/2",
            state: "open",
          },
        ],
      }),
    ]);
    expect(html).toContain('data-contrib-state="open"');
  });

  it("shows merged once every pr is merged", async () => {
    const html = await render([contrib({})]);
    expect(html).toContain('data-contrib-state="merged"');
  });

  it("shows maintainer over the pr states", async () => {
    const html = await render([contrib({ maintainer: true })]);
    expect(html).toContain('data-contrib-state="maintainer"');
  });

  // A maintained repository is its own evidence, so it may list no prs.
  it("renders a maintainer contrib with no prs without a pr list", async () => {
    const html = await render([contrib({ maintainer: true, prs: [] })]);
    expect(html).toContain('data-contrib-state="maintainer"');
    expect(html).toContain('href="https://github.com/backstage/backstage"');
    expect(html).not.toContain("data-prs");
  });

  it("links the upstream repository", async () => {
    const html = await render([contrib({})]);
    expect(html).toContain('href="https://github.com/backstage/backstage"');
  });

  it("renders one link per pr", async () => {
    const html = await render([
      contrib({
        prs: [
          {
            title: "feat(events): kafka pull support",
            url: "https://github.com/backstage/backstage/pull/1",
            state: "merged",
          },
          {
            title: "feat(events): kafka push support",
            url: "https://github.com/backstage/backstage/pull/2",
            state: "open",
          },
        ],
      }),
    ]);
    expect(html).toContain(
      'href="https://github.com/backstage/backstage/pull/1"',
    );
    expect(html).toContain(
      'href="https://github.com/backstage/backstage/pull/2"',
    );
    expect(html).toContain("data-prs");
    expect(html.match(/<a [^>]*href="[^"]*\/pull\/\d+"/g)).toHaveLength(2);
  });
});
