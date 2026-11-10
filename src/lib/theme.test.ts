import { describe, expect, it } from "vitest";
import { resolveTheme } from "./theme";

describe("resolveTheme", () => {
  it("keeps a stored theme that still exists", () => {
    expect(resolveTheme("gruvbox")).toBe("gruvbox");
  });

  it("falls back to the default when nothing is stored", () => {
    expect(resolveTheme(null)).toBe("catppuccin");
    expect(resolveTheme(undefined)).toBe("catppuccin");
  });

  // A stale value naming a deleted theme would set a data-theme no CSS block
  // matches, and the page would render unstyled.
  it("falls back to the default when the stored theme no longer exists", () => {
    expect(resolveTheme("solarized")).toBe("catppuccin");
  });
});
