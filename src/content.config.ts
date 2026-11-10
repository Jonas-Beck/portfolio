import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";

// See docs/adr/0001-content-collections-with-derived-contrib-state.md.

// Zero-padded, so plain string comparison orders these chronologically.
const yearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Expected a date as YYYY-MM");

// Strict objects throughout: a misspelt key such as `ned:` would otherwise be
// stripped silently and turn a past role into the current one.
const experience = defineCollection({
  loader: file("src/content/experience.yaml"),
  schema: z
    .strictObject({
      company: z.string().min(1),
      position: z.string().min(1),
      start: yearMonth,
      // Absent means the current role. Never the word "Present".
      end: yearMonth.optional(),
      summary: z.array(z.string().min(1)).min(1),
    })
    .refine(({ start, end }) => end === undefined || end >= start, {
      message: "`end` is earlier than `start`",
      path: ["end"],
    }),
});

const contrib = defineCollection({
  loader: file("src/content/contrib.yaml"),
  // No state field: the word shown beside a contrib is derived from
  // `maintainer` and the pr states, so it cannot contradict its own evidence.
  schema: z.strictObject({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Expected kebab-case"),
    name: z.string().min(1),
    repo: z
      .string()
      .regex(/^[\w.-]+\/[\w.-]+$/, "Expected a repository as owner/name"),
    summary: z.string().min(1),
    note: z.string().min(1).optional(),
    image: z.string().min(1).optional(),
    maintainer: z.boolean().default(false),
    prs: z
      .array(
        z.strictObject({
          title: z.string().min(1),
          url: z.url(),
          state: z.enum(["open", "merged"]),
        }),
      )
      .min(1, "A contrib needs at least one pr as evidence"),
  }),
});

export const collections = { experience, contrib };
