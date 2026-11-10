import { DEFAULT_THEME, THEMES, type ThemeId } from "../site.config";

// The localStorage key a chosen theme is saved under. One constant, so the
// code that writes the choice and the code that restores it cannot drift.
export const THEME_STORAGE_KEY = "theme";

// `stored` is whatever localStorage held, which may be nothing or a theme that
// has since been removed. There is no prefers-color-scheme input: every theme
// is dark, so the visitor's preference has nothing to choose between.
export function resolveTheme(stored: string | null | undefined): ThemeId {
  return THEMES.find(({ id }) => id === stored)?.id ?? DEFAULT_THEME;
}
