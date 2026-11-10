# public/ assets

Status: needs-info

Blocked by: 01

Carry over from the old repo's `public/`: `jonas-big.jpg`, `jonas-small.jpg`,
`policy-reporter.png`, `favicon.svg`.

Do **not** carry over `shopify-clon.png`, `spotifu.png`, `raja.png`,
`zen-og.png`, or `zen-og-image.jpeg`. The first four are AstroZen template images
that are not Jonas's work; `PRODUCT.md` says they must never be presented as
such, and leaving them unreferenced in `public/` still leaves them publicly
fetchable from a site whose whole claim is being an accurate record.
`zen-og-image.jpeg` is the template's social image.

Do not carry `public/CNAME` — the custom domain stays with the old repo until
cutover.

Check whether anything references `check.svg` or `external.svg` after the
component port; they are probably dead now that `Check.astro` and
`External.astro` exist. Drop them if nothing does.

## Done when

`public/` contains only Jonas's own assets, and no build warning references a
missing image.

## Notes

From the implementation: the four listed files are copied byte-for-byte, and
nothing else came across. `check.svg`, `external.svg` and `menu.svg` (the last
one not named above) have no references and were dropped. `mise run build` is
clean, and every image path in `dist/index.html` resolves.

Open: `favicon.svg` is the stock Astro logo from `npm create astro`, not
Jonas's own mark, so carrying it over conflicts with "Done when". Jonas has to
choose: keep it, ship no favicon (an honest gap, like the unset OG card), or
make a replacement and track it as its own issue. Once that's decided this is
done.
