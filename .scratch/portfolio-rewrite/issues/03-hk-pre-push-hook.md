# hk pre-push hook

Status: ready-for-agent

Blocked by: 01, 02

`hk init --mise`, then define a **pre-push** hook only, in check mode:

1. `prettier --check`
2. `eslint` (no `--fix`)
3. `astro check`
4. `vitest run`

Check mode, not fix mode: a hook that fixes during a push leaves the fix stranded
outside the commits being pushed. `hk fix` stays available as a manual command.

No pre-commit hook for now. `astro check` has to boot the Astro language server
and see the whole project, so it cannot be scoped to staged files and would cost
seconds on every commit — which is how `--no-verify` becomes a habit.

## Done when

`hk check` runs all four steps, `hk install` registers only the pre-push hook,
and a push with a formatting error fails.
