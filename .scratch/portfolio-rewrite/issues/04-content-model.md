# Content model: collections, schemas and site config

Status: ready-for-agent

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

`astro check` passes, `aube run build` fails loudly if a date is malformed or a
contrib has no prs.
