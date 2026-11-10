# jonasbeck.dk

Jonas Beck's personal site: one static page whose job is passive credibility. A
peer, maintainer or recruiter looks him up and finds an accurate, current record
of his platform-engineering work, plus a route onward.

## Language

### Sections

The page has exactly four sections. Each section's name, its anchor id and its
nav label are the same word.

**whoami**:
The opening section: name, title, one-line summary and contact.
_Avoid_: hero, about, intro, landing

**experience**:
A role held at an employer, described in prose. Experience is where work that
cannot be linked belongs.
_Avoid_: work history, jobs, career, positions

**contrib**:
A body of work contributed to one upstream repository owned by someone else.
One contrib is one upstream repository, however many pull requests it took.
_Avoid_: project, upstream, open-source, portfolio piece

**certs**:
A list of certifications Jonas holds, each a **cert**. It comes last on the page:
for the readers the site is for, an exam supports the upstream work rather than
leading it.
_Avoid_: certifications, credentials, badges

### Within a contrib

**pr**:
One pull request within a contrib. A contrib's `prs` list is the evidence that
the work is real and public, except where Jonas maintains the repository: there
the repository itself is the evidence, and the contrib may list no prs, because one
pr out of many would undersell the role.
_Avoid_: change, contribution, commit, link

**contrib state**:
The word shown beside a contrib, derived rather than written: `maintainer` where
Jonas holds that role in the upstream project, otherwise rolled up from the
states of its prs: the most advanced state true of every pr, so `merged` only
once all are merged and `open` while any is still open.
_Avoid_: status, badge

### Within certs

**cert**:
One certification, linked to a verification page a visitor can open. It shows
its issue and expiry months rather than a state word: a static build cannot know
whether it has lapsed on the day of the visit. A lapsed cert stays until it is
renewed or removed.
_Avoid_: certification, credential, badge

### Boundaries

**current role**:
The one experience entry that has not ended. Expressed as an absent end date,
never as the word "Present".
_Avoid_: present role, active job

**theme**:
A named terminal colour scheme a visitor can select, persisted for them. Three
exist: Catppuccin Mocha (default), Gruvbox, Tokyo Night.
_Avoid_: dark mode, colour mode, skin, palette

## The boundary that matters

Work is a **contrib** only if a visitor can open a **pr** and read it, or open
the repository Jonas maintains. Everything
else is **experience**, however substantial. Jonas's internal VELUX tooling (the
Bura CLI, the `helms-deep` golden-path chart, the self-hosted Actions runners) is
experience and must never be presented as a contrib.
