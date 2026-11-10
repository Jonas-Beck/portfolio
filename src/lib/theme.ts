import { DEFAULT_THEME, THEMES, type ThemeId } from "../site.config";

// `stored` is whatever localStorage held, which may be nothing or a theme that
// has since been removed. There is no prefers-color-scheme input: every theme
// is dark, so the visitor's preference has nothing to choose between.
export function resolveTheme(stored: string | null | undefined): ThemeId {
  return THEMES.find(({ id }) => id === stored)?.id ?? DEFAULT_THEME;
}
