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
