# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: platform / developer-experience engineers and open-source maintainers. They arrive from a Backstage or Kyverno repo, a plugin page, LinkedIn or OpenProfile, already know the domain, and want to judge whether the work behind the name has real depth. They read the specifics (what was built, where it landed upstream) rather than the headline.

Recruiters and hiring managers are a known secondary audience, but the page is not optimized for them: the site is not a pitch.

## Product Purpose

`jonasbeck.dk` — Jonas Beck's personal site: one scrolling page covering who he is, his experience, his upstream contributions, and how to reach him.

Its job is passive credibility. He is not actively job hunting; the site exists so that when a peer, maintainer, or anyone else looks him up, they find an accurate, current record that holds up to scrutiny. Success is a visitor leaving with a correct picture of his platform-engineering depth and a route onward (GitHub, LinkedIn, OpenProfile, email) — not conversions or captured leads.

## Positioning

A platform engineer whose internal-platform work has gone upstream and stayed there. The policy-reporter Backstage plugin he built was open-sourced and donated to the Kyverno CNCF project, where he is now a maintainer; his Kafka module for Backstage's events plugin was contributed back to the official Backstage repository. The claim a neighboring portfolio cannot truthfully copy is that the internal tooling is publicly verifiable and still maintained by him.

## Operating Context

- Visitors land from external profiles and repos, often mid-skim and often on a phone.
- One page (`src/pages/index.astro`) with four sections, each a command: `whoami`, `experience` (`#experience`), `contrib` (`#contrib`), `certs` (`#certs`). See `GLOSSARY.md`.
- Site metadata, nav, themes and the whoami copy live in `src/site.config.ts`; experience, contrib and certs are content collections (`src/content/*.yaml`, schemas in `src/content.config.ts`). Components render that data and hold no copy of their own.
- Jonas maintains the site himself, in passing, alongside full-time platform work — edits must be a content change, not a redesign.

## Capabilities and Constraints

- Astro 7 static site; Tailwind CSS v4 through `@tailwindcss/vite`; TypeScript. No client-side framework, no CMS, no database.
- Tooling through `mise` and `aube`; `mise run check` (format, typecheck, tests) is the gate before a push.
- Three terminal themes (Catppuccin Mocha default, Gruvbox, Tokyo Night) selected by `data-theme` on `<html>` and persisted per visitor.
- Font self-hosted via Fontsource: JetBrains Mono Variable, bound to both `--font-sans` and `--font-mono`. One face carries the whole ramp.
- Content shapes are typed by the collection schemas and `SiteConfig`; new content shapes require a schema change.
- Static output only: no server runtime and no form backend. Contact is a `mailto:` to `contact@jonasbeck.dk`.
- Deployment target is GitHub Pages on `jonasbeck.dk`; the domain cutover from the old `astro-zen-portfolio` repo is future work.

## Brand Commitments

- Name and title as written: **Jonas Beck — Platform Engineer**, based in Denmark. The title is stated once on the page, not repeated through the copy.
- Contact `contact@jonasbeck.dk`; profiles: LinkedIn, GitHub (`Jonas-Beck`), OpenProfile.
- Voice: first person, plain, concrete about tools and outcomes ("I design and deploy…", "I maintain…"). Named technologies are the substance of the copy — Backstage, Kubernetes, Kyverno, Helm, GitHub Actions, GitOps.
- The terminal world is the committed visual direction.

## Evidence on Hand

Real and showable (the contrib section):

- **Policy Reporter** — Backstage plugin displaying policy reports from Kyverno, Trivy and Falco for Backstage entities; open-sourced and donated to the Kyverno CNCF project, which Jonas now helps maintain. Screenshot at `public/policy-reporter.png`.
- **Backstage Kafka module** — a module for Backstage's events plugin that subscribes to Kafka topics and exposes them through the internal event service; contributed upstream to the official Backstage repository in merged PRs.
- **github-actions-cache-server** — Azure Blob Storage driver for the self-hosted GitHub Actions cache server, merged upstream.

Certifications (the certs section): **KCNA** (Kubernetes and Cloud Native Associate, The Linux Foundation), Jun 2025 to Jun 2027, verifiable on Credly. An entry-level exam; it backs up the contrib work rather than leading it.

Described but not linkable — internal VELUX work, which belongs in experience prose and must never be dressed up as a public artifact: the Bura CLI for generating HelmReleases, the `helms-deep` golden-path Helm chart, and self-hosted GitHub Actions runners on Kubernetes with BuildKit builders and a local mirror registry.

Absences future work must not fabricate: there are no testimonials, no named clients, no metrics or benchmarks, no press, and no case studies. There is no portrait on the site and no social card image yet.

## Product Principles

1. **Verifiable over impressive.** Every contrib claim points at something a peer can open and read. If it cannot be linked, it is experience, not contrib.
2. **Written for someone who knows the domain.** Specific tool and project names earn more trust here than simplified benefit copy.
3. **Content stays in config and collections.** Components render data; copy never gets hardcoded into them.
4. **Cheap to keep current.** The record is maintained in spare moments, so updating it must mean editing one typed file.
5. **Internal work stays described, never claimed as public.** Employer tooling is context for the experience, not a portfolio artifact.
