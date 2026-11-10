# Content model: collections, schemas and site config

Status: done

Blocked by: 01

Implements `../../../docs/adr/0001-content-collections-with-derived-contrib-state.md`.

## `src/content.config.ts`

Two collections, `file()` loader, Zod schemas.

**`experience`** — `company`, `position`, `start` (`YYYY-MM`), `end`
(`YYYY-MM`, optional; absent means the current role), `summary` (array of
paragraphs). Validate the date format with a regex and reject `end` earlier than
`start`.

**`contrib`** — `slug`, `name`, `repo` (`owner/name`), `summary`, `note`
(optional), `image` (optional), `maintainer` (boolean, default false), and
`prs: [{ title, url, state }]` with at least one entry. `url` must be a URL.

No stored state field: the card's word is derived (see issue 05).

## `src/site.config.ts`

Plain typed module: `title`, `description`, `author`, `lang`, `canonicalURL`,
`socialImage`, `siteLogo`, `email`, `navLinks`, `socialLinks`, and `THEMES`
(`[{ id, label }]` for catppuccin, gruvbox, tokyo). The whoami prose lives here
too.

`navLinks` must be exactly the three sections — `whoami`, `experience`,
`contrib` — with label and anchor identical. Type it so they cannot drift.

## `src/content/*.yaml`

Port the three experience entries and three contrib entries from the baseline's
`src/config/index.ts`. Dates convert as: Apr 2024–Dec 2024 → `2024-04`/`2024-12`;
Jan 2025–Jul 2026 → `2025-01`/`2026-07`; Aug 2026–Present → `2026-08`/absent.

The Kafka module is the entry that needs more than one pr once the second URL is
known (see issue 12).

## Done when

`mise run typecheck` passes, `mise run build` fails loudly if a date is malformed or a
contrib has no prs.

## Comments

Landed with these deviations and additions:

- **One contrib, not three.** Only `github-actions-cache-server` is in
  `contrib.yaml`; the other two wait on issue 12, which says to hold them back
  rather than weaken the at-least-one-pr rule.
- **`experience.yaml` is a keyed map**, not a list. The `file()` loader needs an
  id per entry and the schema gives experience no `id` or `slug`. The keys
  (`velux-intern`, …) are only entry ids.
- **Schemas are strict.** An unknown key fails the build, so a misspelt `end:`
  cannot silently turn a past role into the current one, and a hand-written
  `state:` on a contrib is rejected.
- **`strictFile()` wraps `file()`.** The stock loader only logs when the file is
  missing, the YAML does not parse, or an entry has no id, and the build passes
  with entries absent. The wrapper throws on the first logged error.
- **pr `state` is `open | merged`**, matching issue 05's rollup. pr `url` must be
  `https`.
- **`socialImage` is `undefined`**, per issue 11.
- **whoami prose** is the first baseline About paragraph only, as `whoami.lede`;
  issue 06 says to trim the second. See the note this leaves on issue 12.
- `DEFAULT_THEME`, `SECTIONS`, `SectionId` and `ThemeId` are exported beside
  `SITE` and `THEMES` for issue 05's helpers.

Verified by breaking the data and running the build: malformed date, month 13,
`end` before `start`, unknown key, empty `prs`, non-https url, missing slug,
unparseable YAML and a missing file each exit 1. A nav `href` that differs from
its label fails `mise run typecheck`.
