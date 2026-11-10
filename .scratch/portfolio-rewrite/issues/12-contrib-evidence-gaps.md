# Missing pr URLs for two contribs

Status: done

Blocked by: 04

Two of the three contrib entries cannot satisfy the schema's "at least one pr"
rule from real data yet. Both gaps are inherited from the baseline.

**policy-reporter** — the baseline carries a `TODO(jonas)`: the old `linkSource`
pointed at the AstroZen template repository, and the real repository URL was
deliberately not guessed. Needed: the repository (`kyverno/...`?) and at least
one pr URL. This is the entry that carries the strongest claim on the site —
donated to a CNCF project, still maintained by Jonas — so it is the worst one to
leave unlinkable.

**backstage events kafka module** — `repo: backstage/backstage` is known, but no
pr URLs. Jonas noted this contrib spans more than one pr: pull support and push
support. Needed: both URLs and their states. This entry is the reason the schema
models `prs` as a list at all.

**github-actions-cache-server** — complete already:
`falcondev-oss/github-actions-cache-server` PR #280.

Until the URLs arrive, keep the entries out of `contrib.yaml` rather than
weakening the schema to let a contrib exist with no evidence. Per `GLOSSARY.md`,
work with nothing to link is experience — and all three are already described in
the experience entries, so nothing is lost from the page in the meantime.

## Comments

Two things found while landing issue 04:

- **"Nothing is lost from the page in the meantime" is not quite true.** The only
  statement that Jonas is a Kyverno *maintainer* was the second baseline About
  paragraph, which issue 06 trims, and the policy-reporter contrib, which is held
  back here. The experience entry says only "donated to the official Kyverno CNCF
  project". Until policy-reporter lands with `maintainer: true`, the site does
  not say it anywhere.
- **The held-back entries are not in this repo.** Their `summary`, `note` and
  `image` have to be re-ported from the baseline's `src/config/index.ts` at
  `b62d18b` in `astro-zen-portfolio` when the URLs arrive.

Also worth knowing for the cache-server entry: PR #280 was opened by the
upstream maintainer, taking over Jonas's #257 (closed) with his commits kept.
#280 is the merged one and credits him in its description, so it stays as the
evidence link.

Done. Both entries are back in `contrib.yaml`, re-ported from the baseline.

- **backstage events kafka module**: both prs supplied by Jonas, both merged,
  titles as on GitHub.
- **policy-reporter**: repository `kyverno/backstage-policy-reporter-plugin`,
  `maintainer: true`, and deliberately no prs. Jonas: it "shouldn't reference a
  specific PR". The schema now lets a maintainer contrib list none, since the
  repository is the evidence. GLOSSARY and ADR 0001 are amended to match.
- **github-actions-cache-server**: the original, closed pr was offered and is
  not added. The pr states are only `open` and `merged`, and the merged takeover
  already credits Jonas, as noted above.
- Building with three entries showed `getCollection` returns them by id, not in
  file order, so `sortContribs` now derives the order: maintainer, merged,
  open, then by name. That reproduces the baseline order. If Jonas wants
  editorial order instead, it needs a stored field.
