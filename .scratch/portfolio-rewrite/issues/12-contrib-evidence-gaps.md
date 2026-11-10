# Missing pr URLs for two contribs

Status: needs-info

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
