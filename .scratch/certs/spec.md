# certs section

Status: done

Add certifications to the page as a fourth section, `certs`. Jonas holds the
KCNA and may take more.

## Decisions

- **Placement**: a fourth section, last on the page after `contrib`. Its name,
  anchor id and nav label are `certs`; one entry is a **cert**. Last, because
  for the primary audience (maintainers, platform engineers) an entry-level exam
  says less than the upstream work, and should support it rather than lead.
- **Evidence**: every cert links to a verification page (Credly or the LF
  verify link). `url` is required and must be `https`; the rendered name links
  to it. Same rule as contrib: a claim needs something a peer can open.
- **Expiry**: stored as `issued` and optional `expires`, both `YYYY-MM`, with
  `expires >= issued` enforced by the schema. The page shows the dates, never a
  derived "active / expired" word: a static build cannot know the visit date,
  so such a word would be correct only on build day. See ADR 0002.
- **Lapsed certs** stay listed with their dates. No build-time expiry check.
  Jonas removes or renews them by hand.
- **Data home**: a third content collection, `src/content/certs.yaml`, keyed by
  id like `experience.yaml`, through `strictFile()` with a strict Zod schema.
  Fields: `abbr`, `name`, `issuer`, `issued`, `expires?`, `url`.
- **Display**: compact text rows, not bordered cards, and no badge images (they
  clash with the terminal themes):

  ```
  KCNA  Kubernetes and Cloud Native Associate ↗
        The Linux Foundation · Jun 2025 — Jun 2027
  ```

  The issuer is written as the badge states it.
- **Dates**: `formatYearMonth` moves to a shared `src/lib/date.ts`. Certs get
  their own range with no "Present" case: a cert with no `expires` shows only
  the issue month.
- **Order**: newest `issued` first.
- **Empty collection**: not handled. There is one cert; conditional sections
  and nav entries wait until they are needed.
- **Docs**: `GLOSSARY.md` (four sections, a **cert** entry), `PRODUCT.md`
  (section count, KCNA under Evidence on Hand), `docs/adr/0002`.

## First entry

KCNA, Kubernetes and Cloud Native Associate, The Linux Foundation, issued
`2025-06`, expires `2027-06`,
https://www.credly.com/badges/43b89d59-7a48-453e-af3e-929ce8d7368b
