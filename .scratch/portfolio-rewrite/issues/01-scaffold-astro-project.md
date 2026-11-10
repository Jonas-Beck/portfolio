# Scaffold the Astro project

Status: ready-for-agent

Stand up a flat Astro 5 + Tailwind 4 project at the repository root, per the
layout in `../spec.md`.

- `mise.toml`: keep `node` and `aube`, add `hk`, **remove the `biome` pin** —
  Biome is not used (see spec, Formatting and linting).
- `package.json` via `aube`: `astro`, `@astrojs/check`, `typescript`,
  `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/jetbrains-mono`.
  Scripts: `dev`, `build` (`astro check && astro build`), `preview`, `check`,
  `test`, `lint`, `format`.
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
