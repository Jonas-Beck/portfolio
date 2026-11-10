# hk pre-push hook

Status: ready-for-agent

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
