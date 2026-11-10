# Cutover to jonasbeck.dk

Status: needs-info

Blocked by: 06, 07, 08, 09

Explicitly out of scope for the rewrite. Recorded so the steps are not
rediscovered later.

Only one GitHub repository can serve `jonasbeck.dk`, and it is currently
`astro-zen-portfolio`. When Jonas is ready:

1. Push this repository to GitHub.
2. Enable Pages, confirm the workflow in issue 09 produces a green run and a
   working site on the `github.io` URL.
3. Add `public/CNAME` here; remove it from `astro-zen-portfolio`.
4. Archive `astro-zen-portfolio` — archive rather than delete: it carries the
   AstroZen template attribution and the license history, which is where that
   credit is actually true.

Open question Jonas has deferred: whether to stay on GitHub Pages or move to
Cloudflare Pages. Cloudflare adds a preview URL per pull request; it needs the
domain's DNS on Cloudflare nameservers. Either way the repository name does not
change.

Decide before step 2, since it determines whether step 3 happens at all.
