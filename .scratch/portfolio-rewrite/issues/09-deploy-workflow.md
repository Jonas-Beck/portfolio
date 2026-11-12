# GitHub Pages deploy workflow (written, not pushed)

Status: done

Blocked by: 01

`.github/workflows/deploy.yaml`, on push to `main` plus `workflow_dispatch`:

1. `actions/checkout`
2. `jdx/mise-action` — installs node, aube, hk from `mise.toml`/`mise.lock`
3. `aube ci` — clean install from the frozen lockfile
4. `mise run build` — the `typecheck` task, then `astro build`
5. `actions/upload-pages-artifact` with `path: dist`
6. `actions/deploy-pages` in the `github-pages` environment

Permissions: `contents: read`, `pages: write`, `id-token: write`.

**Not `withastro/action`.** It detects the package manager from the lockfile and
does not know `aube`.

Nothing is pushed as part of this work and GitHub Pages is not enabled on this
repository. The workflow is the artifact the eventual cutover needs; writing it
now beats reconstructing why `withastro/action` does not fit.

## Done when

The file exists and is valid YAML. It is deliberately unverified against a real
run — see issue 10.

## Notes

From the implementation: the file parses and passes `actionlint`. Actions are
pinned to commit SHAs, with the release tag in a trailing comment.

Two departures from the step list above, both from review:

- A `mise run check` step runs before `mise run build`. `hk.pkl` and the spec
  both say CI runs the same gate as the pre-push hook; with only `build`, a push
  that skipped the hook could deploy with failing tests. `typecheck` now runs
  twice, which costs under a second.
- Permissions are per job, not workflow-wide: `build` holds only
  `contents: read`, since it runs third-party install scripts, and `deploy`
  holds `pages: write` and `id-token: write`.

Also added: a `pages` concurrency group that never cancels a running deploy, and
the environment `url` from `deploy-pages`, as in GitHub's starter workflow.
