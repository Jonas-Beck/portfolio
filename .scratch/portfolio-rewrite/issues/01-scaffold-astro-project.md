# Scaffold the Astro project

Status: done

Stand up a flat Astro 7 + Tailwind 4 project at the repository root, per the
layout in `../spec.md`.

- `mise.toml`: keep `node` and `aube`, add `hk`, **remove the `biome` pin** —
  Biome is not used (see spec, Formatting and linting).
- `package.json` via `aube`: `astro`, `typescript`, `@astrojs/ts-content-mapper`,
  `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/jetbrains-mono`.
  Scripts: `dev`, `build` (`tsc --noEmit --runExternalCode && astro build`),
  `preview`, `check`, `test`, `lint`, `format`.
- `astro.config.mjs`: `site: "https://jonasbeck.dk"`, no `base`, Tailwind via the
  `@tailwindcss/vite` plugin.
- `tsconfig.json`: extends `astro/tsconfigs/strictest`.
- `.gitignore`: `dist/`, `.astro/`, `node_modules/`, `.DS_Store`, plus
  Impeccable's local state.

Drop the old repo's font dependencies other than JetBrains Mono Variable: the
design binds one face to both `--font-sans` and `--font-mono`, so Gabarito and
Be Vietnam Pro are dead weight.

## Done when

`aube install` succeeds, `aube run dev` serves an empty page, `aube run build`
passes.

## Comments

Done. `aube-lock.yaml` is the only lockfile; no npm, pnpm or yarn lockfile was
created at any point.

Three things differed from this issue as written:

1. **Astro resolved to 7.4.7, not 5.x.** The spec was written when 5 was assumed
   current. A fresh repo takes the current major; nothing in the baseline port
   depends on 5-specific behaviour, but issue 06 should expect Astro 7 APIs.
2. **`astro check` is gone.** Astro 7 deprecates it, it refuses TypeScript 7.0,
   and `@astrojs/check@0.9.12` crashes on Node 26 besides. Replaced with
   `tsc --noEmit --runExternalCode` via `@astrojs/ts-content-mapper`, which needs
   TypeScript 7.1+ — pinned to `7.1.0-beta`. Verified to catch a type error in
   `.astro` frontmatter at the right line, exiting 2.
3. **An `aube.overrides` block was needed** to pin emnapi to 1.x. See the spec
   for the full diagnosis. Without it a cold install is broken.

Verified: cold `aube install` (lockfile and `node_modules` deleted) succeeds,
`aube run build` passes, `aube run dev` serves HTTP 200 with Tailwind compiled
and JetBrains Mono bound to `--font-sans` and `--font-mono`.
