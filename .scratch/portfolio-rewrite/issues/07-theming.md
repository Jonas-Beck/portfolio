# Theming: THEMES as source of truth, pre-paint script

Status: ready-for-agent

Blocked by: 04, 06

Astro has no built-in theming and Tailwind's `@custom-variant` is the wrong tool
for three named themes (it would mean a variant per theme and every colour
utility written three times). Keep the baseline's token indirection: `@theme`
maps `--color-*` to `--t-*`, and each `:root[data-theme="…"]` block redefines the
`--t-*` set, so `bg-bg` is written once and resolves per theme.

Two additions:

1. **`THEMES` drives the chips.** The header maps over `THEMES` from
   `site.config.ts`; the CSS blocks are keyed to the same ids. A fourth theme is
   one CSS block plus one array entry.
2. **A `<script is:inline>` in `<head>`** that reads `localStorage`, falls back to
   `prefers-color-scheme`, runs the value through `resolveTheme`, and sets
   `data-theme` on `<html>` before paint.

`is:inline` is load-bearing: without it Astro bundles and defers the script and
you get a flash of the wrong theme. So is the validation — a stale stored value
naming a theme that no longer exists sets a `data-theme` no CSS block matches,
and the page renders unstyled.

## Done when

Switching themes persists across a reload with no flash, and manually setting
`localStorage` to a junk theme id falls back to Catppuccin instead of rendering
unstyled.

## Comments

From 05: `resolveTheme(stored)` takes no `prefersDark`. Every theme is dark, so
there is no `prefers-color-scheme` fallback (point 2 above predates that).
Also, a `<script is:inline>` is not bundled, so it cannot import
`src/lib/theme.ts`. Decide here how the script gets the logic, e.g. serialise
the valid ids and default into it with `define:vars`, and keep `resolveTheme`
as the tested statement of the same rule.
