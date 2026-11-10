# hk pre-push hook

Status: done

Blocked by: 01, 02

`hk init --mise`, then define a **pre-push** hook only, in check mode:

1. `aube run format:check` — `prettier --check .`
2. `aube run check` — `tsc --noEmit --runExternalCode`
3. `vitest run`

**Three steps, not four — the `eslint` step is gone.** Issue 02 dropped ESLint
entirely: `typescript-eslint` cannot run on the pinned `typescript@7.1.0-beta`,
because TypeScript 7 no longer exposes the classic compiler API. See issue 02's
comments for the full finding and the spec's **Formatting and linting** section
for the decision. Do not add an `eslint` step; there is no `eslint` binary and
no `lint` script in `package.json`.

Call the **`format:check` script**, never `aube run format --check`. Script
arguments are appended, so the latter expands to `prettier --write . --check`
and `--write` wins: it rewrites the tree instead of checking it, and exits 0
while doing so. That is exactly the kind of silent pass a push hook must not
have.

Check mode, not fix mode: a hook that fixes during a push leaves the fix stranded
outside the commits being pushed. `hk fix` stays available as a manual command.

No pre-commit hook for now. The typecheck has to see the whole project, so it
cannot be scoped to staged files and would cost seconds on every commit — which is how `--no-verify` becomes a habit.

## Done when

`hk check` runs all three steps, `hk install` registers only the pre-push hook,
and a push with a formatting error fails. Verify the formatting step *fails*
without rewriting the offending file — `aube run format:check` exits 1 and
leaves the file untouched, which is the behaviour to preserve.

## Comments

Done, but not as specified. **Every command moved to `mise run`** partway
through, at Jonas's request, and the hook is **one step, not three**.

### What landed

- `mise.toml` gained a task per command: `dev`, `preview`, `build`,
  `typecheck`, `test`, `format`, `format:check`, and `check`.
- `package.json`'s `scripts` block is **gone**. A task and a script defining the
  same command is drift waiting to happen, so each command is defined once.
  `[env] _.path = ["{{config_root}}/node_modules/.bin"]` puts the installed
  binaries on `PATH`, so tasks call `prettier`/`tsc`/`vitest` directly.
  Verified: `mise exec -- which prettier tsc vitest` resolves all three inside
  `node_modules/.bin`.
- `check` is the gate. No command of its own, only
  `depends = ["format:check", "typecheck", "test"]`, which mise runs in
  parallel. This issue's three steps still exist — they are those three
  dependencies.
- `hk.pkl` has one step, `mise run check`, on the `pre-push` hook. Jonas's
  point: a `check` task with `depends` means the hook names the gate instead of
  listing it, so `hk.pkl` cannot drift from what must pass, and a fourth check
  later is a line in `mise.toml` and no change to `hk.pkl`.
- The former `check` script (`tsc`) is now `typecheck`, since `check` is the
  aggregate. Issues 04 and 06 were updated to say `mise run typecheck`.

### What the one-step hook costs

hk sees one opaque step, so hk's own per-step reporting, `--step` filtering and
parallelism do not apply to the three checks; mise provides them instead.
Failure attribution survives: mise prefixes every line with the task name and
ends with `[format:check] ERROR task failed`, which is as legible as hk's
`✗ format` was. Checked before collapsing the three steps, because that was the
only real argument for keeping them.

### The `format --check` trap survives the move to mise

mise appends task arguments exactly as aube appends script arguments, so the
trap this issue warned about is **not** an aube quirk. Verified, not assumed:

- `mise run format --check` → `prettier --write . --check`, prints
  "Code style issues fixed", **exits 0**, and the file is rewritten.
- `mise run format:check` → `prettier --check .`, exits 1, file byte-identical
  (compared by `shasum` before and after).

`format:check` is therefore a task of its own, and `mise.toml` carries the
warning inline next to it.

### vitest was not installed

Issue 01 added a `test` script but never installed the package, so step 3 had no
binary behind it. Installed `vitest@5.1.0` as a devDependency. The spec's
**Tooling** section already assigned `vitest` to `package.json`, so this closes
an issue 01 gap rather than opening new scope.

`vitest run` exits 1 when it finds no test files, and there are none until issue
05, which would have made the hook red on every push — the fastest possible route
to a `--no-verify` habit. The `test` task therefore runs
`vitest run --passWithNoTests` for now. The flag is in `mise.toml` only, never in
a place CI would inherit silently, and **issue 05 has been told to remove it**
when it lands real tests.

### `hk init --mise`

Ran it, then overrode most of what it produced:

- It autodetected and wrote six builtin steps — `astro`, `prettier`,
  `shellcheck`, `shellharden`, `shfmt`, `tsc`. Three of those binaries are not
  installed in this repo, and `Builtins.prettier`/`Builtins.tsc` run per-file
  commands rather than this repo's whole-project ones. All discarded.
- It appended `[tasks.pre-commit]` (`run = "hk run pre-commit"`) to `mise.toml`.
  Removed — this repo deliberately has no pre-commit hook.
- It left the existing `[tools]` pins alone, and `hk` was already pinned there
  from issue 01, so `--mise` contributed nothing else.

The `Builtins.pkl` import is not in the final config, because nothing uses it.

### Verified

- `hk validate` passes.
- `hk check` runs the gate and exits 0; nested output shows all three tasks.
- `mise run check` exits 0 clean, and exits 1 with
  `[format:check] ERROR task failed` when a badly formatted file is present.
- `mise run format:check` exits 1 and leaves the offending file byte-identical —
  this issue's acceptance criterion, confirmed by `shasum`.
- `hk fix` runs `mise run format` and rewrites the badly formatted file.
- `mise run build` runs `typecheck` first, then `astro build`, and completes.
- `hk install --mise` registers **only** `.git/hooks/pre-push`. Nothing else in
  `.git/hooks` but git's own inert `*.sample` files, and no `hook.*` git config
  entries. In particular there is no `pre-commit`.

**Not verified: an actual push.** Jonas's call — take it as working if
`hk check` and `hk fix` do. The installed shim is
`exec mise x -- hk run pre-push --from-hook "$@"`, and `hk run pre-push --plan`
resolves to the same single step in check mode (`Run type: check`).

Two notes for whoever runs into them:

- Git here is **2.47**, below the 2.54 that `hk install` needs for config-based
  hooks, so it wrote a `.git/hooks/pre-push` script shim instead. Nothing
  depends on which mechanism is used.
- `hk run pre-push` **blocks on stdin** when run by hand, because the real hook
  receives the updated refs there. Use `hk run pre-push </dev/null`.

### Known limitation

The hook checks the **working tree**, not the commits being pushed. Dirty
unrelated files can fail a push, and a dirty fix can make a bad commit pass.
`stash = "git"` on the hook would close that gap but risks stranding unstaged
work mid-push, so it was left at the default. Out of scope here; worth revisiting
only if it actually bites.
