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

// YYYY-MM. Shared with the schemas in src/content.config.ts.
export const YEAR_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function formatYearMonth(yearMonth: string): string {
  const [, year, month] = YEAR_MONTH_PATTERN.exec(yearMonth) ?? [];
  const name = MONTHS[Number(month) - 1];
  if (year === undefined || name === undefined) {
    throw new Error(`Expected a date as YYYY-MM, got "${yearMonth}"`);
  }
  return `${name} ${year}`;
}
