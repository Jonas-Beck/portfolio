# Cutover to jonasbeck.dk

Status: ready-for-human

Blocked by: 06, 07, 08, 09

Serve `jonasbeck.dk` from this repository on GitHub Pages, through the workflow
from issue 09.

## Where things stand (2026-11-12)

- `astro-zen-portfolio` no longer holds the custom domain, so `jonasbeck.dk` is
  free. Pages is still enabled there on its `github.io` URL, and the repository
  is not archived.
- `Jonas-Beck/portfolio` exists and is public. Pages is enabled with source
  "GitHub Actions" and has no custom domain yet. Only the initial commit is
  pushed; local `main` is ahead, and the workflow has never run.
- DNS needs no change: the apex resolves to GitHub's four Pages IPs, and `www`
  is a CNAME to `jonas-beck.github.io`.

## Steps

1. Set the custom domain to `jonasbeck.dk` under Settings → Pages in this
   repository. Do this before the first push: `astro.config.mjs` sets no
   `base`, so on `jonas-beck.github.io/portfolio/` every asset path is wrong.
2. Push `main`. The push triggers the deploy workflow.
3. Confirm the run is green, and the site loads on `https://jonasbeck.dk` with
   its images, fonts and theme toggle. Turn on "Enforce HTTPS" once the
   certificate is issued.
4. Disable Pages on `astro-zen-portfolio`, then archive it. Archive rather than
   delete: it carries the AstroZen template attribution and the license
   history, which is where that credit is actually true.

No `public/CNAME`: a Pages site published from a workflow ignores the file, and
the domain lives in the repository settings.

## Done when

`https://jonasbeck.dk` serves this site from a green run of `deploy.yaml`, and
`astro-zen-portfolio` is archived.

## Comments

Decided 2026-11-12: stay on GitHub Pages. Moving to Cloudflare Pages, for a
preview URL on every pull request, is off the table for the cutover. It would
need the domain's DNS on Cloudflare nameservers.
