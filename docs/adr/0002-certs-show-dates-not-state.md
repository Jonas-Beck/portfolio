# Certs show their dates, not a derived state

A cert is stored with `issued` and an optional `expires`, both `YYYY-MM`, and the
page shows those dates. It does not show a word such as `active` or `expired`,
even though contrib derives its state word (ADR 0001) and the same pattern looks
like it would fit here.

Contrib's state is derived from data that only changes when the site is edited,
so it is correct whenever the build is. Whether a cert has lapsed depends on the
date of the visit, and the site is static: a status word computed at build time
would be correct only on the day of the build, and the site is rebuilt rarely.
A cert would then read `active` for months after it lapsed, which goes against
the site's purpose of being an accurate record. Dates are always true, and a
visitor can judge them.

For the same reason there is no build-time check that fails on a lapsed cert: it
would fire at whatever moment the next unrelated edit happened. A lapsed cert
stays listed until Jonas renews it (new dates) or removes it.

## Consequences

The `certs` schema has no state field, and `Certs.astro` renders no status
badge. Someone adding one should first find a way to know the visit date, which
on a static site means client-side script and is not worth it for this.
