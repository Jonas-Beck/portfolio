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

Filenames are **PascalCase under `src/components/**`** (including
`icons/`) and **kebab-case everywhere else**; directories are kebab-case
throughout. Nothing enforces this — see **Formatting and linting** — so it
lives here.

```
/
├── GLOSSARY.md
├── DESIGN.md                  design system (Impeccable writes this at root)
├── PRODUCT.md                 product definition (likewise)
├── README.md                  written for this repo, no template credit
├── LICENSE                    MIT, Jonas Beck
├── mise.toml                  node, aube, hk — and every task
├── hk.pkl
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── .prettierrc.mjs
├── .prettierignore
├── docs/adr/
├── .impeccable/
├── public/
└── src/
    ├── content.config.ts      collection definitions + Zod schemas
    ├── site.config.ts         site metadata, nav, social links, THEMES
    ├── content/
    │   ├── experience.yaml
    │   └── contrib.yaml
    ├── components/            PascalCase filenames, one per section + Section.astro
    │   └── icons/
    ├── layouts/Layout.astro
    ├── lib/                   kebab-case, tested helpers, *.test.ts beside each
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

**mise also owns every command.** Tasks live in `mise.toml` and are run as
`mise run <task>`: `dev`, `preview`, `build`, `typecheck`, `test`, `format`,
`format:check`, and `check`. `package.json` has **no `scripts` block** — a task
and a script defining the same command is exactly the drift this avoids, so
there is one definition of each and one way to run it. `mise.toml` puts
`node_modules/.bin` on `PATH` (`[env] _.path`), so tasks call the installed
binaries directly rather than through a package manager.

`check` is the gate: it has no command of its own, only
`depends = ["format:check", "typecheck", "test"]`, which mise runs in parallel.
The pre-push hook, CI and a human all run that one task, so what must pass is
defined once. The former `check` script, which was `tsc`, is now `typecheck`.

**`package.json` owns what the build imports** — `astro`, `typescript`,
`prettier` and plugins, `vitest`. Installed with `aube`;
`aube-lock.yaml` is the only lockfile in the repo, and no npm, pnpm or yarn
lockfile is ever committed. Dependency work stays `aube` (`aube add`,
`aube install`, `aube ci`); only command-running moved to mise.

### Formatting and linting

Prettier formats. Nothing lints — see below.

The requirement that decides the formatter: `.astro` templates must be
formatted and Tailwind classes sorted. In a design-heavy repo the templates are
the code, and unsorted class lists make diffs unreadable.

- Prettier with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`,
  the Tailwind plugin last so it can wrap the Astro printer. Tailwind 4 has no
  config file, so `tailwindStylesheet` points at the stylesheet holding
  `@theme`.
- `.prettierignore` holds the build output, Astro's generated types, the
  machine-owned lockfiles, the vendored agent-skill trees and `.scratch/`.
  Without it `prettier --write .` rewrites 60 files this repo does not own.
  `.scratch/` is excluded deliberately: the issue tracker is hand-written
  working notes, and a formatter that rewraps tickets churns files unrelated to
  whatever is being worked on.

**Known gap: Tailwind sorting is a no-op in `.astro`.**
`prettier-plugin-tailwindcss@0.8.1` (2026-07-15) predates
`prettier-plugin-astro@1.0.0` (2026-09-08) and does not understand its
rewritten AST, so it silently skips those files while still sorting every other
file type. Verified: pinning `prettier-plugin-astro@0.14.1` restores sorting
immediately. Staying on 1.1.2 and accepting unsorted classes for now; revisit
when the Tailwind plugin ships Astro 1.x support.

**ESLint is dropped.** The original plan was `eslint-plugin-unicorn`
recommended plus `typescript-eslint` recommended, `eslint-plugin-astro` via
`astro-eslint-parser`, `eslint-config-prettier` last. It cannot run on
TypeScript 7:

- `typescript@7.x` no longer exposes the classic compiler API. Its main entry
  is `./lib/version.cjs`, exporting only `{version, versionMajorMinor}`;
  `createSourceFile`, `SyntaxKind` and `forEachChild` are all `undefined`, and
  the replacement API lives under `typescript/ast`. `@typescript-eslint/parser`
  therefore throws at import whenever the TypeScript major is 7 or above. The
  gate is honest, not a blanket refusal, and lifting it upstream is tracked in
  typescript-eslint issue 10940.
- Running it without type-aware rules does not help: the throw is at _import_,
  so it fires regardless of which rules are enabled.
- Dropping only `typescript-eslint` does not help either. `.ts` files then go
  unlinted entirely, and `.astro` files with typed frontmatter fail to parse
  with `The keyword 'interface' is reserved`, because `eslint-plugin-astro`
  needs `@typescript-eslint/parser` for the frontmatter. **Any ESLint coverage
  of `.astro` requires a TypeScript 6 in the lint chain.**
- A side-by-side TypeScript 6 does work, but only via
  `aube.packageExtensions`, which converts typescript-eslint's `typescript`
  _peer_ into a real dependency edge. Plain `aube.overrides` is not enough: a
  peer resolves from the root, so the pin holds on an incremental install and
  silently reverts on `aube ci`.

So the choice was a second TypeScript in the repo purely to parse for the
linter, against dropping the linter. Dropped it. `tsc --noEmit` under
`astro/tsconfigs/strictest` already supplies the strictness ESLint was there
for, including unused locals and the `noUncheckedIndexedAccess` /
`exactOptionalPropertyTypes` pair that catches this data model's real failure
mode; Vitest covers the helpers. Of `eslint-plugin-astro`'s nine recommended
rules, five check for deprecated Astro APIs this greenfield Astro 7 repo will
never call.

What is lost, and where it goes instead:

- `unicorn/filename-case` enforcing PascalCase under `src/components/**` and
  kebab-case elsewhere. This is now a convention only, stated in
  **Repository shape** above.
- unicorn's opinions. Worth noting what they cost before they were dropped:
  they wanted `Props` renamed to `Properties` (Astro's own convention),
  rewrote JSDoc into a non-standard asterisk-free shape, and demanded
  `src/` be renamed `Src/` until `filename-case` was given
  `checkDirectories: false`.

Revisit when typescript-eslint supports TypeScript 7. Nothing in the repo
depends on ESLint's absence, so adding it back is a `package.json` change and
one config file.

### tsconfig and type-checking

`astro/tsconfigs/strictest`. `noUncheckedIndexedAccess` and
`exactOptionalPropertyTypes` are exactly the rules that catch "this contrib has
no image" — the failure mode this data model actually has.

Type-checking is **`tsc --noEmit --runExternalCode`**, not `astro check`. Astro
7 deprecates `astro check`, it refuses TypeScript 7.0 outright, and
`@astrojs/check@0.9.12` additionally crashes on Node 26. Astro's own replacement
is `@astrojs/ts-content-mapper`, registered through a `contentMappers` entry in
`tsconfig.json`, which lets plain `tsc` type-check `.astro` files. It requires
TypeScript 7.1+, so `typescript` is pinned to `7.1.0-beta`. `--runExternalCode`
is required because content mappers execute code from `node_modules`.

Verified: a type error in `.astro` frontmatter is reported with the correct file
and line, and exits non-zero.

### The emnapi override

`package.json#aube.overrides` pins `@emnapi/runtime`, `@emnapi/core` and
`@emnapi/wasi-threads` to their 1.x releases. Without it, a cold install
resolves `@emnapi/runtime@2.0.0-beta.2` — a prerelease matched by a
`^1.7.1 || ^2.0.0-alpha.4` range in the WASM runtime chain under
`@astrojs/astro2tsx` — which is ABI-incompatible with the 1.x
`@napi-rs/wasm-runtime` it gets paired with, and throws
`this.bridge.setLastError is not a function` on import.

That single fault is what breaks both `@astrojs/check` and
`@astrojs/ts-content-mapper`. Verified by cold install in both directions: the
prerelease returns without the override and disappears with it. Revisit when the
upstream chain stops accepting emnapi prereleases.

### Hooks

`hk`, pre-push only to start, and the hook is one step: `mise run check`.
Check mode, not fix mode — a hook that fixes during a push strands the fix
outside the commits being pushed. `hk fix` runs `mise run format` and stays
available manually. A pre-commit fix hook can be attached to the same step
later.

The hook names the `check` task rather than listing the three commands, so
`hk.pkl` cannot drift from what the gate actually is; adding a fourth thing that
must pass is a line in `mise.toml` and no change to `hk.pkl`. What hk still owns
is installing the git hook and nothing else — `hk install --mise` writes a
`.git/hooks/pre-push` shim that launches through `mise x`, so mise-managed tools
are on `PATH` without mise being activated in the shell.

`check` and `fix` hooks are declared in `hk.pkl` too, both on the same step.
Without them `hk check` and `hk fix` would be silent no-ops, because hk only
creates its three default hooks from a top-level `steps` block and this config
has none.

Use the `format:check` task, not `mise run format --check`: task arguments are
appended, so that expands to `prettier --write . --check` and `--write`
wins — it rewrites the tree instead of checking it, and exits 0 while doing so.
Verified under mise, not just assumed from the aube behaviour it inherits.

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
- A `<script is:inline>` in `<head>` that reads `localStorage`, validates
  against `THEMES` (falling back to the default) and sets `data-theme` before
  paint. There is no `prefers-color-scheme` fallback: every theme is dark, so
  the preference has nothing to choose between. `is:inline` matters: without it Astro bundles and defers the script,
  giving a flash of the wrong theme. Validation matters: a stale stored value
  naming a deleted theme currently sets a `data-theme` no CSS block matches, and
  the page renders unstyled.

## Hosting

GitHub Pages, static output, `site: "https://jonasbeck.dk"`, no `base`. A switch
to Cloudflare Pages is possible later and out of scope.

`.github/workflows/deploy.yaml` is written now but nothing is pushed: `mise` →
`aube ci` → `mise run build` → `actions/upload-pages-artifact` →
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
