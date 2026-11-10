# Prettier and ESLint config

Status: done

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

## Comments

Done, but not as specified. **ESLint was dropped.** The open risk this issue
flagged turned out to be fatal, and neither fallback it offered works. Prettier
landed as planned, with one gap.

### The open risk, resolved

`typescript-eslint@8.72.1` cannot run on `typescript@7.1.0-beta` at all.

`typescript@7.x` no longer exposes the classic compiler API. Its main entry is
`./lib/version.cjs` and exports only `{version, versionMajorMinor}`;
`createSourceFile`, `SyntaxKind`, `ScriptTarget` and `forEachChild` are all
`undefined`. The replacement API lives under `typescript/ast`, and
`typescript-estree` has not adopted it — tracked upstream as typescript-eslint
issue 10940. So `@typescript-eslint/parser` throws at import whenever the
TypeScript major is 7 or above. The gate is a real incompatibility, not a
blanket refusal; patching it out would only turn a clear error into an
`undefined` dereference.

Both options this issue listed are dead ends:

1. **"Run it without type-aware rules"** — impossible. The throw is at
   _import_, unconditional, and fires regardless of which rules are enabled.
   Only using `recommended` changes nothing.
2. **"Drop `typescript-eslint`, rely on unicorn plus `tsc`"** — worse than it
   sounds. Tested: `.ts` files go completely unlinted, **and** `.astro` files
   with typed frontmatter fail to parse with
   `Parsing error: The keyword 'interface' is reserved`, because
   `eslint-plugin-astro` needs `@typescript-eslint/parser` for the frontmatter.
   Since every ported component will have a `Props` interface, this removes the
   only thing the ESLint setup was for. **Any ESLint coverage of `.astro`
   requires a TypeScript 6 in the lint chain.**

A third option not in this issue does work: a side-by-side TypeScript 6 for the
lint chain only. It requires `aube.packageExtensions` to convert
typescript-eslint's `typescript` _peer_ into a real dependency edge. Plain
`aube.overrides` is **not** sufficient and is a trap — a peer resolves from the
root, so the pin appears to hold on an incremental install and silently reverts
on `aube ci`. With `packageExtensions` the whole chain shares one TypeScript
6.0.3 instance, root `tsc` stays on 7.1.0-beta, and it survives a cold install.

That was verified working end to end: `eslint .` clean, and this issue's
acceptance criterion passing exactly — `src/lib/BadlyNamedFile.ts` flagged,
`src/components/Section.astro` not, and `src/components/bad-name.astro` flagged
in the inverse direction, with `src/components/icons/` left alone.

### Why it was dropped anyway

The choice was a second TypeScript in the repo purely to parse for the linter,
against dropping the linter. Jonas chose to drop it. The reasoning, recorded in
the spec:

- `tsc --noEmit` under `astro/tsconfigs/strictest` already supplies what ESLint
  was there for — unused locals, plus the `noUncheckedIndexedAccess` /
  `exactOptionalPropertyTypes` pair that catches this data model's actual
  failure mode. Vitest covers the helpers.
- Five of `eslint-plugin-astro`'s nine recommended rules check for deprecated
  Astro APIs a greenfield Astro 7 repo will never call.
- In the linting actually run before removal, unicorn produced zero findings
  that were bugs, and several that cost config work: it wanted `Props` renamed
  to `Properties` (Astro's own convention, had to be disabled via
  `name-replacements`), rewrote JSDoc into a non-standard asterisk-free shape,
  wanted a boolean parameter `merged` renamed `isMerged`, and demanded `src/`
  be renamed `Src/` until `filename-case` was given `checkDirectories: false`.
  Note for anyone re-adding it: a plain string in `directoryRoots` is an exact
  match, not a regex, so `[".*"]` does nothing — `checkDirectories: false` is
  the real option.

**What is lost:** this issue's `unicorn/filename-case` scoping is now a
convention only. It was already stated in the spec's **Repository shape**
section, so it is still written down, just not enforced. Revisit the whole
decision when typescript-eslint supports TypeScript 7; adding it back is a
`package.json` change plus one config file.

### Prettier

Landed as specified, with `prettier-plugin-astro` and
`prettier-plugin-tailwindcss` (Tailwind last so it can wrap the Astro printer).
Tailwind 4 has no config file, so `tailwindStylesheet` points at
`src/styles/global.css`. The `overrides` block forcing `parser: "astro"` turned
out to be unnecessary — `prettier-plugin-astro` registers the extension itself —
so it is not in the final config.

**Known gap: Tailwind class sorting is a silent no-op in `.astro`.**
`prettier-plugin-tailwindcss@0.8.1` (released 2026-07-15) predates
`prettier-plugin-astro@1.0.0` (2026-09-08) and does not understand its
rewritten AST. It skips those files without error while still sorting every
other file type — confirmed by sorting the same class list correctly in
`.html`. Verified that pinning `prettier-plugin-astro@0.14.1` restores sorting
immediately. Jonas chose to stay on 1.1.2 and accept unsorted classes for now;
the plugin is kept in the config so sorting starts working when it catches up,
and the gap is commented in `.prettierrc.mjs`. Note this weakens the spec's
stated reason for choosing Prettier, so it is worth revisiting.

Two things this issue did not anticipate:

- **`.prettierignore` was required.** Without it, `prettier --write .` rewrote
  60 files this repo does not own — the vendored `.agents/` skill trees,
  `aube-lock.yaml` and Astro's generated `.astro/` types. It now ignores build
  output, generated types, the machine-owned lockfiles and the vendored skill
  trees.
- **`aube run format --check` does not check.** Script arguments are appended,
  so it expands to `prettier --write . --check`, and `--write` wins — it
  rewrites the tree. That is how the 60 files were rewritten in the first
  place, while appearing to pass. Added a `format:check` script
  (`prettier --check .`) and used that instead; the pre-push hook in issue 03
  must call `format:check`, never `format --check`. This issue's "Done when"
  named the unsafe form.

### Verified

From a cold `aube ci` with `node_modules` removed: `aube run format:check`,
`aube run check` (`tsc --noEmit --runExternalCode`, still 7.1.0-beta) and
`aube run build` all exit 0. Only one TypeScript is installed. Prettier formats
`.astro` typed frontmatter correctly. The `lint` script and `eslint.config.js`
are gone; `aube.overrides` is back to just the emnapi block from issue 01.

### Knock-on changes

Dropping ESLint invalidated things written elsewhere, all corrected here:

- **Issue 03 rewritten.** It specified a four-step pre-push hook whose step 2
  was `eslint`. An agent picking it up would have installed a step with no
  binary behind it. Now three steps, calling `format:check`, with the reason
  and the `format --check` trap spelled out inline.
- **Spec `Repository shape`** no longer lists `eslint.config.js`, and lists
  `.prettierignore`.
- **The filename convention is now actually written down.** The note above
  claimed it was "already stated in Repository shape"; Repository shape only
  said components are PascalCase and never said kebab-case elsewhere, so half
  the rule the dropped lint rule enforced was recorded nowhere. Both halves are
  now stated in prose there.
- **`.scratch/` added to `.prettierignore`.** Prettier had quietly become the
  owner of the issue tracker's markdown and rewrote an unrelated ticket
  (`05-helpers-and-tests.md`) as collateral in this change. That rewrite is
  reverted.

One inconsistency left alone: `Status: done` is not one of the five canonical
values in `docs/agents/triage-labels.md`. Issue 01 already used it before this
work, so it is pre-existing drift rather than something introduced here, and
reconciling it means either amending that table — which the file explicitly
invites — or changing both issues. That is Jonas's call, not this ticket's.
