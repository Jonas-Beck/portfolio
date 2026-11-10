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
    expect(html.match(/<a [^>]*href="[^"]*\/pull\/\d+"/g)).toHaveLength(2);
  });
});
