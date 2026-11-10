# Content collections, with contrib state derived from pull requests

Site data lives in two Astro content collections (`experience`, `contrib`) loaded
from single YAML files via the `file()` loader, with Zod schemas in
`src/content.config.ts`; site metadata, nav and themes stay in a plain typed
`src/site.config.ts` rather than becoming collections of one.

A contrib models **one upstream repository**, holding a list of `prs`, because the
Backstage events Kafka module landed as two separate pull requests (pull support
and push support) and a single `link` field cannot represent that. The state word
shown beside a contrib is therefore **derived** — `maintainer` where Jonas holds
that role, otherwise rolled up from the pr states — not stored, so merging another
pr cannot leave the card contradicting its own evidence.

Experience dates are stored as `YYYY-MM` with an absent end date meaning the
current role, replacing display strings like `"Apr 2024"` and the magic value
`"Present"`. Those strings could not be sorted or validated: a typo such as
`"Agu 2026"` rendered silently. The schema now rejects it at build time, ordering
is derivable, and formatting moves into a tested helper.

## Consequences

The `prs` array is where a reasonable reader would expect a flat `link` field, and
the absent state field is where they would expect a written one. Both are
deliberate. Adding a contrib means adding its prs; the card's headline follows.
