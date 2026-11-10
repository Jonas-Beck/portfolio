import { describe, expect, it } from "vitest";
import {
  formatDateRange,
  groupByCompany,
  isCurrentRole,
  sortExperience,
  splitCodeSpans,
} from "./experience";

describe("formatDateRange", () => {
  it("formats a finished role as month and year at both ends", () => {
    expect(formatDateRange("2024-04", "2024-12")).toBe("Apr 2024 — Dec 2024");
  });

  // "Present" is display only: the data marks the current role by leaving
  // `end` out, never with the word.
  it("ends the current role with Present", () => {
    expect(formatDateRange("2026-08", undefined)).toBe("Aug 2026 — Present");
  });

  it("refuses a month that does not exist rather than printing undefined", () => {
    expect(() => formatDateRange("2024-13")).toThrow(/YYYY-MM/);
  });
});

describe("isCurrentRole", () => {
  it("is true for the role with no end date", () => {
    expect(isCurrentRole({})).toBe(true);
  });

  it("is false for a role that has ended", () => {
    expect(isCurrentRole({ end: "2024-12" })).toBe(false);
  });
});

describe("sortExperience", () => {
  it("puts the most recently started role first", () => {
    const intern = { id: "intern", data: { start: "2024-04" } };
    const junior = { id: "junior", data: { start: "2025-01" } };
    const core = { id: "core", data: { start: "2026-08" } };

    expect(sortExperience([junior, intern, core])).toEqual([
      core,
      junior,
      intern,
    ]);
  });

  it("returns an empty list for no roles", () => {
    expect(sortExperience([])).toEqual([]);
  });
});

describe("groupByCompany", () => {
  it("puts consecutive roles at one company under one heading", () => {
    const core = { id: "core", data: { company: "VELUX" } };
    const junior = { id: "junior", data: { company: "VELUX" } };

    expect(groupByCompany([core, junior])).toEqual([
      { company: "VELUX", roles: [core, junior] },
    ]);
  });

  it("keeps a return to an earlier company as a separate stint", () => {
    const back = { id: "back", data: { company: "VELUX" } };
    const away = { id: "away", data: { company: "Acme" } };
    const first = { id: "first", data: { company: "VELUX" } };

    expect(groupByCompany([back, away, first])).toEqual([
      { company: "VELUX", roles: [back] },
      { company: "Acme", roles: [away] },
      { company: "VELUX", roles: [first] },
    ]);
  });

  it("returns no groups for no roles", () => {
    expect(groupByCompany([])).toEqual([]);
  });
});

describe("splitCodeSpans", () => {
  it("marks backticked names as code", () => {
    expect(splitCodeSpans("Built `helms-deep`, our chart.")).toEqual([
      { text: "Built ", code: false },
      { text: "helms-deep", code: true },
      { text: ", our chart.", code: false },
    ]);
  });

  it("returns a line without backticks as one plain segment", () => {
    expect(splitCodeSpans("Ran the runners.")).toEqual([
      { text: "Ran the runners.", code: false },
    ]);
  });

  it("refuses an unclosed backtick rather than swallowing the line", () => {
    expect(() => splitCodeSpans("Built `helms-deep, our chart.")).toThrow(
      /Unclosed backtick/,
    );
  });
});
