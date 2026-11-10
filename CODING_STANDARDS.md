# Coding standards

Judgement calls for review. Anything a tool can check belongs in `mise run
check`, not here. Each rule is followed by why it exists; a change that breaks a
rule for a stated reason in the diff is fine.

## Domain

- **Glossary words.** Identifiers, test names, comments and copy use the terms
  in `GLOSSARY.md` (_contrib_, _pr_, _contrib state_, _current role_, _theme_).
  A word under a term's _Avoid_ list is a finding when it names that term.
  Why: the glossary is how a visitor, the code and an agent mean the same thing.
- **Derive, don't store.** A value computable from content (contrib state, the
  current role) comes from a helper in `src/lib`, never a field in the YAML and
  never logic repeated inside a component. Why: stored state can contradict its
  own evidence (`docs/adr/0001`).
- **Data is sortable; display is formatted.** Content holds validated,
  machine-ordered values (`YYYY-MM`, an absent `end`); turning them into display
  text ("Apr 2024", "Present") happens in a tested helper. Why: display strings
  in data cannot be sorted or validated, and a typo renders silently.

## One definition

- **One source per rule.** A pattern, list or constant used in two places is
  defined once and imported: validation patterns live in `src/lib` and the
  schemas in `src/content.config.ts` import them; sections, nav and themes come
  from `src/site.config.ts` and components map over them. Why: two copies drift,
  and the schema and the page then disagree about what is valid.
- **Copy comes from config or content.** Components render text from
  `site.config.ts` or a collection, never prose written into the markup. Why:
  the record stays in one editable place.

## Failure

- **Broken records fail the build.** Bad content, an impossible date or an
  empty list a helper cannot honestly handle throws with a message naming the
  value. Rendering `undefined`, a fallback that hides the fault, or a silently
  skipped entry is a finding. Why: the site's job is an accurate record; a loud
  build beats a quietly wrong page.
- **Guards over loosening.** Satisfy `strictest` with real narrowing (`??`,
  an early throw, a type derived from the schema). Non-null `!`, a widening `as`
  and config relaxations each need a comment saying why they are safe. Why:
  `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` catch this data
  model's real failure, the missing optional field.
- **Same output on every machine.** Build output does not depend on locale,
  time zone or the clock. Why: the build runs in CI and on a laptop and must
  produce the same page.

## Tests

- **Behaviour at the interface.** Tests call the exported helper or render the
  component through `experimental_AstroContainer`; they do not reach into
  internals or mock collaborators.
- **Independent expected values.** Expectations are literals from the spec or a
  worked example, never recomputed the way the code computes them.
- **Stable hooks.** Render assertions find elements by structure or data
  attribute (`<figure>`, `data-current-role`), not by copy or class names. Why:
  copy and styling change with design; the behaviour under test does not.
- **Absence has a positive control.** An assertion that something is _not_
  rendered sits beside one showing it _is_ rendered when the condition holds.
  Why: otherwise a component that renders nothing passes.
- **No snapshots.** Why: they break on every design tweak and teach `-u`
  without reading.

## Comments

- **Comments carry the why.** The reason for a choice, the gotcha no config
  confesses, the rule a regex encodes. Match the density of
  `src/content.config.ts`. Why: the code already says what it does.
