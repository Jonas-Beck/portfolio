# Port the components to three sections

Status: ready-for-agent

Blocked by: 04, 05

Copy the baseline components from
`/Users/jonasbeck/Developer/astro-zen-portfolio` at commit
`b62d18b redesign: terminal baseline`, then rework them to the three-section
structure and the new data model.

- `Layout.astro`, `Section.astro`, `icons/Check.astro`, `icons/External.astro`
  port largely as-is.
- **`Whoami.astro`** (was `Hero.astro` + `About.astro`): name, title, summary,
  portrait, contact. The About prose folds in here as the lede; the second About
  paragraph restates experience and contrib, so trim rather than transplant.
- **`Experience.astro`**: reads the collection, sorted by `sortExperience`, badge
  from `isCurrentRole`, dates through `formatDateRange`.
- **`Contrib.astro`** (was `Projects.astro`): state from `deriveContribState`,
  one link per pr, media panel only when `image` is set.
- **`Header.astro`**: three nav entries from `site.config.ts`; theme chips mapped
  from `THEMES`.
- **`Footer.astro`**: social links from `site.config.ts`.

Delete `src/config/index.ts` and `src/types/index.ts` — collections and
`site.config.ts` replace both. No copy is hardcoded into a component
(`PRODUCT.md` principle 3).

`strictest` will require guards where the old code indexed arrays freely; add the
guards rather than loosening the config.

## Done when

The page renders all three sections, `aube run check` passes, and no component
contains prose that is not from config or a collection.
