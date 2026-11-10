import { describe, expect, it } from "vitest";
import { formatCertDates, sortCerts } from "./certs";

describe("formatCertDates", () => {
  it("formats issue and expiry as month and year", () => {
    expect(formatCertDates({ issued: "2025-06", expires: "2027-06" })).toBe(
      "Jun 2025 — Jun 2027",
    );
  });

  // Unlike an experience range, an open end is not "Present".
  it("shows only the issue month for a cert that does not expire", () => {
    expect(formatCertDates({ issued: "2025-06" })).toBe("Jun 2025");
  });
});

describe("sortCerts", () => {
  it("puts the most recently issued cert first", () => {
    const kcna = { id: "kcna", data: { issued: "2025-06" } };
    const cka = { id: "cka", data: { issued: "2026-03" } };

    expect(sortCerts([kcna, cka])).toEqual([cka, kcna]);
  });

  it("returns an empty list for no certs", () => {
    expect(sortCerts([])).toEqual([]);
  });
});
