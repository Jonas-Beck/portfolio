# Pure helpers in src/lib, with Vitest

Status: done

Blocked by: 04

Vitest configured with `getViteConfig` from `astro/config` so aliases and
collections resolve. Tests sit beside their source as `*.test.ts`.

## Helpers

- **`deriveContribState(contrib)`** — `"maintainer"` when `maintainer` is true,
  otherwise rolled up from `prs[].state`. Decide and document the rollup: all
  merged → `"merged"`; any open → `"open"`; mixed → the most advanced state that
  is true of all prs.
- **`formatDateRange(start, end)`** — `2024-04`, `2024-12` → `"Apr 2024 — Dec 2024"`;
  absent `end` → `"Aug 2026 — Present"`. "Present" is a *display* string only; it
  never appears in the data.
- **`isCurrentRole(entry)`** — true when `end` is absent. Drives the badge.
- **`repoUrl(repo)`** — `"backstage/backstage"` → `"https://github.com/backstage/backstage"`.
- **`resolveTheme(stored, prefersDark)`** — returns a valid theme id, falling back
  to the default when `stored` is absent or names a theme not in `THEMES`.
- **`sortExperience(entries)`** — newest first, by `start`. Sound now that dates
  are sortable.

## Render assertions

A handful via `experimental_AstroContainer`:

- a contrib with no `image` renders no media panel
- a contrib with two `prs` renders two links
- the current role renders the badge; a past role does not

## Out of scope

No page snapshot tests: they break on every design tweak and train you to run
`-u` without reading. No DOM-level theme-switcher test; `resolveTheme` covers the
logic.

## Done when

`mise run test` passes, every helper above has at least its empty/absent case
covered, and `--passWithNoTests` is gone from the `test` task in `mise.toml`.

## Comments

`--passWithNoTests` on the `test` task is issue 03's doing. The pre-push hook
runs `mise run test`, and `vitest run` exits 1 when it finds no test files, so
without the flag every push was red before any test existed. Once this issue
lands real tests the flag only hides an empty suite, which is why removing it is
in the Done when above.

Landed with two departures from the text above.

`resolveTheme` takes `stored` only, not `(stored, prefersDark)`. All three themes
are dark, so `prefers-color-scheme` has nothing to choose between, and an unused
parameter fails `strictest`. Add it back alongside the first light theme. The
spec's Theming section is updated to match.

The render assertions need section components, which are 06's to port. So
`src/components/Contrib.astro` and `Experience.astro` exist here as unstyled
structure: they take collection entries as props (`contribs`, `experience`),
and `Contrib.test.ts` / `Experience.test.ts` pin the media panel, one link per
pr and the current-role badge. 06 ports the baseline markup onto them rather
than replacing them.

`REPO_PATTERN` and `YEAR_MONTH_PATTERN` now live in `src/lib` and the schemas
in `src/content.config.ts` import them, so the helpers and the schema validate
against one definition.
