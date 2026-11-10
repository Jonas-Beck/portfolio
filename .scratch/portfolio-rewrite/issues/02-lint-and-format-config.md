# Prettier and ESLint config

Status: ready-for-agent

Prettier formats, ESLint lints. Rationale is in `../spec.md`.

- `.prettierrc.mjs` with `prettier-plugin-astro` and
  `prettier-plugin-tailwindcss`.
- `eslint.config.js` (flat), in this order:
  1. `typescript-eslint` **recommended** — not `strictTypeChecked`
  2. `eslint-plugin-unicorn` **recommended**
  3. `eslint-plugin-astro` recommended, for `*.astro` via `astro-eslint-parser`
  4. `eslint-config-prettier` **last**
- Scope `unicorn/filename-case`: `pascalCase` for `src/components/**`,
  `kebabCase` elsewhere. It ships in unicorn-recommended defaulting to kebabCase
  and would otherwise flag every component file.

**Open risk:** `typescript` is pinned to `7.1.0-beta` (see issue 01).
`typescript-eslint@8.x` predates TypeScript 7 and may not accept it as a peer or
may fail to build a program. Check this first. If it does not work, the options
are to run `typescript-eslint` without type-aware rules (which is already the
plan — only `recommended`, not `strictTypeChecked`), or to drop
`typescript-eslint` and rely on unicorn plus `tsc` for correctness.

Current versions at time of writing: `eslint-plugin-unicorn@79.0.0`,
`eslint-plugin-astro@3.2.1`, `astro-eslint-parser@3.2.0`,
`typescript-eslint@8.72.2`, `eslint-config-prettier@10.1.8`.

## Done when

`aube run lint` and `aube run format --check` both pass on the scaffolded repo,
and a deliberately misnamed file in `src/lib/` is flagged while
`src/components/Section.astro` is not.
