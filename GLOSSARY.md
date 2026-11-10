# jonasbeck.dk

Jonas Beck's personal site: one static page whose job is passive credibility. A
peer, maintainer or recruiter looks him up and finds an accurate, current record
of his platform-engineering work, plus a route onward.

## Language

### Sections

The page has exactly three sections. Each section's name, its anchor id and its
nav label are the same word.

**whoami**:
The opening section: name, title, one-line summary, portrait and contact.
_Avoid_: hero, about, intro, landing

**experience**:
A role held at an employer, described in prose. Experience is where work that
cannot be linked belongs.
_Avoid_: work history, jobs, career, positions

**contrib**:
A body of work contributed to one upstream repository owned by someone else.
One contrib is one upstream repository, however many pull requests it took.
_Avoid_: project, upstream, open-source, portfolio piece

### Within a contrib

**pr**:
One pull request within a contrib. A contrib's `prs` list is the evidence that
the work is real and public.
_Avoid_: change, contribution, commit, link

**contrib state**:
The word shown beside a contrib, derived rather than written: `maintainer` where
Jonas holds that role in the upstream project, otherwise rolled up from the
states of its prs.
_Avoid_: status, badge

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

Work is a **contrib** only if a visitor can open a **pr** and read it. Everything
else is **experience**, however substantial. Jonas's internal VELUX tooling (the
Bura CLI, the `helms-deep` golden-path chart, the self-hosted Actions runners) is
experience and must never be presented as a contrib.
