/**
 * `prettier-plugin-tailwindcss` must stay last: it sorts class lists by
 * wrapping the printers of the plugins loaded before it, and cannot do that for
 * anything loaded after.
 *
 * Tailwind 4 has no config file, so the plugin is pointed at the stylesheet
 * holding `@theme` instead.
 *
 * Known gap: sorting is currently a no-op in `.astro`. Version 0.8.1 of the
 * plugin predates `prettier-plugin-astro@1.0.0` and does not understand its
 * rewritten AST, so it silently skips those files. It still sorts every other
 * file type. Remove this note once the plugin ships Astro 1.x support.
 *
 * @type {import("prettier").Config}
 */
export default {
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/styles/global.css",
};
