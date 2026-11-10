import type { CollectionEntry } from "astro:content";

type ExperienceData = CollectionEntry<"experience">["data"];

// Spelt out rather than Intl.DateTimeFormat, so the output does not depend on
// the locale or time zone of whichever machine builds the site.
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

// YYYY-MM. Shared with the schema in src/content.config.ts.
export const YEAR_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

function formatYearMonth(yearMonth: string): string {
  const [, year, month] = YEAR_MONTH_PATTERN.exec(yearMonth) ?? [];
  const name = MONTHS[Number(month) - 1];
  if (year === undefined || name === undefined) {
    throw new Error(`Expected a date as YYYY-MM, got "${yearMonth}"`);
  }
  return `${name} ${year}`;
}

export function formatDateRange(
  start: ExperienceData["start"],
  end?: ExperienceData["end"],
): string {
  return `${formatYearMonth(start)} — ${end === undefined ? "Present" : formatYearMonth(end)}`;
}

// The current role is the one that has not ended: an absent `end`.
export function isCurrentRole({ end }: Pick<ExperienceData, "end">): boolean {
  return end === undefined;
}

// Newest first. `start` is zero-padded YYYY-MM, so string order is date order.
// Takes collection entries, as `getCollection("experience")` returns them.
export function sortExperience<
  Entry extends { data: Pick<ExperienceData, "start"> },
>(entries: readonly Entry[]): Entry[] {
  return entries.toSorted((a, b) =>
    b.data.start < a.data.start ? -1 : b.data.start > a.data.start ? 1 : 0,
  );
}

// Consecutive roles at one employer read as one stint, a ladder rather than
// three unrelated jobs. Only neighbours merge: leaving and coming back is two
// stints. Takes the entries already sorted, as sortExperience returns them.
export function groupByCompany<
  Entry extends { data: Pick<ExperienceData, "company"> },
>(entries: readonly Entry[]): { company: string; roles: Entry[] }[] {
  const groups: { company: string; roles: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groups.at(-1);
    if (last?.company === entry.data.company) last.roles.push(entry);
    else groups.push({ company: entry.data.company, roles: [entry] });
  }
  return groups;
}

export interface SummarySegment {
  text: string;
  code: boolean;
}

// A summary line marks the name of something Jonas built in backticks, as it
// would be written in a commit message. An odd backtick count is a typo that
// would otherwise swallow the rest of the line, so it fails the build.
export function splitCodeSpans(line: string): SummarySegment[] {
  const parts = line.split("`");
  if (parts.length % 2 === 0) {
    throw new Error(`Unclosed backtick in summary line "${line}"`);
  }
  return parts
    .map((text, index) => ({ text, code: index % 2 === 1 }))
    .filter(({ text }) => text !== "");
}
