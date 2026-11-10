# Social / OG image

Status: needs-info

Blocked by: 06

The live site currently serves `zen-og-image.jpeg`, the AstroZen template's
social image, as its OG card. Issue 08 drops it, which leaves the OG card unset.

That is the right interim state — an unset card is honest, a borrowed one is not
— but it is a real gap: links to `jonasbeck.dk` on LinkedIn, GitHub and in chat
will render without a preview image, and the site's whole job is being found and
judged by peers.

Needs from Jonas: either an image, or a decision to generate one from the
terminal design (the design has everything needed — JetBrains Mono, the
Catppuccin palette, the name and title — so a generated card would be
self-consistent, and Astro can produce it at build time).

Until then `socialImage` stays unset and `Layout.astro` omits the `og:image` and
`twitter:image` tags rather than pointing at something that is not there.
