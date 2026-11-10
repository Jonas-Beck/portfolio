import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { CollectionEntry } from "astro:content";
import { describe, expect, it } from "vitest";
import Certs from "./Certs.astro";

function cert(
  data: Partial<CollectionEntry<"certs">["data"]>,
): CollectionEntry<"certs"> {
  return {
    id: "kcna",
    collection: "certs",
    data: {
      abbr: "KCNA",
      name: "Kubernetes and Cloud Native Associate",
      issuer: "The Linux Foundation",
      issued: "2025-06",
      expires: "2027-06",
      url: "https://www.credly.com/badges/kcna",
      ...data,
    },
  };
}

async function render(certs: CollectionEntry<"certs">[]) {
  const container = await AstroContainer.create();
  return container.renderToString(Certs, { props: { certs } });
}

describe("Certs", () => {
  it("links the cert to its verification page", async () => {
    const html = await render([cert({})]);
    expect(html).toContain('href="https://www.credly.com/badges/kcna"');
    expect(html.replace(/<[^>]*>/g, "")).toContain(
      "Kubernetes and Cloud Native Associate",
    );
  });

  it("shows the issuer and the dates", async () => {
    const html = await render([cert({})]);
    expect(html).toContain("The Linux Foundation");
    expect(html).toContain("Jun 2025 — Jun 2027");
  });

  // Dates only: a static build cannot know whether the cert has lapsed today.
  it("shows no status word", async () => {
    const html = await render([
      cert({ expires: "2020-01", issued: "2019-01" }),
    ]);
    expect(html).not.toMatch(/expired|active|Present/i);
  });

  it("renders no badge image", async () => {
    const html = await render([cert({})]);
    expect(html).not.toContain("<img");
  });
});
