# certs section

Status: done

Implement `.scratch/certs/spec.md` in full:

- `certs` collection and schema in `src/content.config.ts`, data in
  `src/content/certs.yaml` with the KCNA entry.
- `src/lib/date.ts` holding `formatYearMonth`, used by experience and certs.
- `src/lib/certs.ts`: `formatCertDates`, `sortCerts`, with tests.
- `src/components/Certs.astro` with a container test, rendered last in
  `src/pages/index.astro`; `certs` added to `SECTIONS` and `navLinks`.
- `GLOSSARY.md`, `PRODUCT.md`, `docs/adr/0002-certs-show-dates-not-state.md`.

Done when `mise run check` passes.

## Comments
