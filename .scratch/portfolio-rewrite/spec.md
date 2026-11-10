# Portfolio rewrite

Rebuild `jonasbeck.dk` in this repository, with Jonas's own terminal-emulator
design, replacing the AstroZen-template-based site in
`/Users/jonasbeck/Developer/astro-zen-portfolio`.

Settled in a grilling session on 2026-11-10. Vocabulary is defined in
`GLOSSARY.md`; the content-model decision is recorded in
`docs/adr/0001-content-collections-with-derived-contrib-state.md`.

## Baseline

The redesign existed only as uncommitted working-tree changes on
`redesign/terminal` in the old repo. It is now committed there as
`b62d18b redesign: terminal baseline` so it is recoverable.

This repository starts from its own history. The baseline is imported by **copying
files**, not by merging git history: carrying the old history would drag the
AstroZen template's lineage into a repo whose purpose is being Jonas's own.

`.impeccable/mocks/`, `questions/` and `review/` each carry a `.gitignore`
containing `*` — Impeccable declares them local runtime state, so the approved
terminal mock and the decision mocks are **not** in that commit. They are copied
across on disk; whether to override Impeccable and commit them is still open.

## Repository shape

Flat single Astro project at the repository root. No workspaces.

```
/
├── GLOSSARY.md
├── DESIGN.md                  design system (Impeccable writes this at root)
├── PRODUCT.md                 product definition (likewise)
├── README.md                  written for this repo, no template credit
├── LICENSE                    MIT, Jonas Beck
├── mise.toml                  node, aube, hk
├── hk.pkl
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── .prettierrc.mjs
├── eslint.config.js
├── docs/adr/
├── .impeccable/
├── public/
└── src/
    ├── content.config.ts      collection definitions + Zod schemas
    ├── site.config.ts         site metadata, nav, social links, THEMES
    ├── content/
    │   ├── experience.yaml
    │   └── contrib.yaml
    ├── components/            PascalCase, one per section + Section.astro
    │   └── icons/
    ├── layouts/Layout.astro
    ├── lib/                   tested helpers, *.test.ts beside each
    ├── pages/index.astro
    └── styles/global.css
```

## Sections

Three, not four. `whoami`, `experience`, `contrib`. The name, the anchor id and
the nav label are the same word in each case.

The old nav had four entries with two pointing at the same idea (`whoami` and
`about`), one label whose anchor was named something else (`upstream` →
`#projects`), and a `#whoami` anchor matching no section. The About prose is
folded into `whoami`; `#about` is dropped.

`contrib` replaces `projects`: it is the ecosystem's word, and it cannot be
stretched to cover internal work with nothing to link, so the vocabulary itself
enforces the experience/contrib boundary.

## Content model

See the ADR. In short:

- Two collections (`experience`, `contrib`), one YAML file each, `file()` loader,
  Zod schemas in `src/content.config.ts`.
- Site metadata, nav, social links and `THEMES` in `src/site.config.ts`.
- A contrib is one upstream repository and holds `prs: [{ title, url, state }]`.
- Contrib state is derived, never stored.
- Experience dates are `YYYY-MM`; an absent end date means the current role.

## Tooling

**mise owns what bootstraps the repo** — `node`, `aube`, `hk`. The unused
`biome` pin in the (still untracked) `mise.toml` is dropped.

**`package.json` owns what the build imports** — `astro`, `typescript`, `eslint`
and plugins, `prettier` and plugins, `vitest`. Installed with `aube`.

### Formatting and linting

Prettier formats; ESLint lints. The requirement that decides the formatter:
`.astro` templates must be formatted and Tailwind classes sorted. In a
design-heavy repo the templates are the code, and unsorted class lists make
diffs unreadable. Prettier covers both through its Astro and Tailwind plugins.

- Prettier with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`.
- ESLint flat config: `eslint-plugin-unicorn` **recommended** (the strict part),
  `typescript-eslint` **recommended** (not `strictTypeChecked`: it needs type
  information, TypeScript cannot see `.astro`, and `astro check` already covers
  that ground), `eslint-plugin-astro` recommended via `astro-eslint-parser`,
  `eslint-config-prettier` last.
- `unicorn/filename-case` ships in unicorn-recommended defaulting to kebabCase,
  which flags every `.astro` component. Scope it: PascalCase under
  `src/components/**`, kebab-case elsewhere.

### tsconfig

`astro/tsconfigs/strictest`. `noUncheckedIndexedAccess` and
`exactOptionalPropertyTypes` are exactly the rules that catch "this contrib has
no image" — the failure mode this data model actually has.

### Hooks

`hk`, pre-push only to start: `prettier --check`, `eslint` (no `--fix`),
`astro check`, `vitest run`. Check mode, not fix mode — a hook that fixes during
a push strands the fix outside the commits being pushed. `hk fix` stays available
manually. A pre-commit fix hook can be attached to the same steps later.

## Testing

Vitest, configured with `getViteConfig` from `astro/config` so aliases and
collections resolve.

Unit tests for the pure helpers in `src/lib/`: `deriveContribState`,
`formatDateRange`, `isCurrentRole`, `repoUrl`, `resolveTheme`.

A few Container API render assertions (`experimental_AstroContainer`): a contrib
card with no `image` renders no media panel; a contrib with two `prs` renders two
links.

No page snapshot tests — they break on every design tweak and teach you to run
`-u` reflexively. No DOM-level theme-switcher tests; `resolveTheme` covers the
logic.

## Theming

Astro has no built-in theming, and Tailwind's `@custom-variant` mechanism is the
wrong tool here: with three themes it would mean a variant per theme and every
colour utility written three times.

Keep the baseline's approach. `@theme` maps role tokens to indirections
(`--color-bg: var(--t-bg)`) and each `:root[data-theme="…"]` block redefines the
`--t-*` set, so `bg-bg` is written once and resolves per theme. A fourth theme is
one CSS block plus one `THEMES` entry.

Two additions:

- `THEMES` in `src/site.config.ts` (id + label) as the single source of truth, so
  the header chips and the CSS blocks cannot drift apart.
- A `<script is:inline>` in `<head>` that reads `localStorage`, falls back to
  `prefers-color-scheme`, validates against `THEMES` and sets `data-theme` before
  paint. `is:inline` matters: without it Astro bundles and defers the script,
  giving a flash of the wrong theme. Validation matters: a stale stored value
  naming a deleted theme currently sets a `data-theme` no CSS block matches, and
  the page renders unstyled.

## Hosting

GitHub Pages, static output, `site: "https://jonasbeck.dk"`, no `base`. A switch
to Cloudflare Pages is possible later and out of scope.

`.github/workflows/deploy.yaml` is written now but nothing is pushed: `mise` →
`aube ci` → `astro build` → `actions/upload-pages-artifact` →
`actions/deploy-pages`. Not `withastro/action`, which detects the package manager
from the lockfile and does not know `aube`.

The custom domain stays with `astro-zen-portfolio` for now. Cutover — enabling
Pages here, adding `public/CNAME`, removing it there, archiving the old repo — is
future work and deliberately out of scope.

## Assets

Carried over: `jonas-big.jpg`, `jonas-small.jpg`, `policy-reporter.png`,
`favicon.svg`.

Dropped: `shopify-clon.png`, `spotifu.png`, `raja.png`, `zen-og.png` — template
images that are not Jonas's work, and which `PRODUCT.md` says must never be
presented as such. Not kept unreferenced either: in `public/` they stay publicly
fetchable from a site claiming to be an accurate record.

Also dropped: `zen-og-image.jpeg`, the template's social image, which the live
site still serves as its OG card. An unset OG card is honest; a borrowed one is
not. Replacing it is tracked as an issue.

`check.svg` and `external.svg` are likely dead now that `Check.astro` and
`External.astro` exist as inline icon components — confirm during the port and
drop if nothing references them.

## Working method

Incremental commits on `main` in this repository. No remote, no pushing. Steps:
tooling, content model, components, tests — so a bad port can be bisected to
rather than unpicked from a 40-file blob.
