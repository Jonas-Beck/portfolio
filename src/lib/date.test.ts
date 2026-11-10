import { describe, expect, it } from "vitest";
import { formatYearMonth } from "./date";

describe("formatYearMonth", () => {
  it("formats as month and year", () => {
    expect(formatYearMonth("2025-06")).toBe("Jun 2025");
  });

  it("refuses a month that does not exist rather than printing undefined", () => {
    expect(() => formatYearMonth("2024-13")).toThrow(/YYYY-MM/);
  });
});
