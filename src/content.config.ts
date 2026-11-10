import { defineCollection } from "astro:content";
import { file, type Loader } from "astro/loaders";
import { z } from "astro/zod";
import { REPO_PATTERN } from "./lib/contrib";
import { YEAR_MONTH_PATTERN } from "./lib/experience";

// See docs/adr/0001-content-collections-with-derived-contrib-state.md.

// Zero-padded, so plain string comparison orders these chronologically.
const yearMonth = z
  .string()
  .regex(YEAR_MONTH_PATTERN, "Expected a date as YYYY-MM");

// `file()` only logs when the file is missing, is not valid YAML, or holds an
// entry with no id, and the build then passes with entries absent. Here every
// one of those is a broken record, so the first error it logs is thrown.
function strictFile(fileName: string): Loader {
  const loader = file(fileName);
  return {
    ...loader,
    load: (context) => {
      const logger = Object.create(context.logger) as typeof context.logger;
      logger.error = (message) => {
        throw new Error(`${fileName}: ${message}`);
      };
      return loader.load({ ...context, logger });
    },
  };
}

// Strict objects throughout: a misspelt key such as `ned:` would otherwise be
// stripped silently and turn a past role into the current one.
const experience = defineCollection({
  loader: strictFile("src/content/experience.yaml"),
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
  loader: strictFile("src/content/contrib.yaml"),
  // No state field: the contrib state is derived from `maintainer` and the pr
  // states, so it cannot contradict its own evidence.
  schema: z.strictObject({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Expected kebab-case"),
    name: z.string().min(1),
    repo: z.string().regex(REPO_PATTERN, "Expected a repository as owner/name"),
    summary: z.string().min(1),
    note: z.string().min(1).optional(),
    image: z.string().min(1).optional(),
    maintainer: z.boolean().default(false),
    prs: z
      .array(
        z.strictObject({
          title: z.string().min(1),
          url: z.url({ protocol: /^https$/ }),
          state: z.enum(["open", "merged"]),
        }),
      )
      .min(1, "A contrib needs at least one pr as evidence"),
  }),
});

export const collections = { experience, contrib };
