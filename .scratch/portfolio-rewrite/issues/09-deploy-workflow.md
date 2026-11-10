# GitHub Pages deploy workflow (written, not pushed)

Status: ready-for-agent

Blocked by: 01

`.github/workflows/deploy.yaml`, on push to `main` plus `workflow_dispatch`:

1. `actions/checkout`
2. `jdx/mise-action` — installs node, aube, hk from `mise.toml`/`mise.lock`
3. `aube ci` — clean install from the frozen lockfile
4. `aube run build` — `tsc --noEmit --runExternalCode && astro build`
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
