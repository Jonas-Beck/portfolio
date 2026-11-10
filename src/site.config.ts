// Site metadata, nav and themes. Experience and contrib are content
// collections (src/content.config.ts); everything that would be a collection
// of one lives here instead.

export const SECTIONS = ["whoami", "experience", "contrib"] as const;
export type SectionId = (typeof SECTIONS)[number];

// A section's name, its anchor and its nav label are the same word, so both
// fields are derived from the one id and cannot drift apart.
type NavLinksFor<Ids extends readonly SectionId[]> = {
  -readonly [I in keyof Ids]: { label: Ids[I]; href: `#${Ids[I]}` };
};
type NavLinks = NavLinksFor<typeof SECTIONS>;

export const THEMES = [
  { id: "catppuccin", label: "catppuccin" },
  { id: "gruvbox", label: "gruvbox" },
  { id: "tokyo", label: "tokyo-night" },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];
export const DEFAULT_THEME: ThemeId = "catppuccin";

interface SiteConfig {
  title: string;
  description: string;
  author: string;
  lang: string;
  canonicalURL: string;
  /** Unset until there is a card of Jonas's own; the layout then omits the tags. */
  socialImage: string | undefined;
  email: string;
  /** user@host shown in the header status bar and the footer prompt. */
  shellPrompt: string;
  navLinks: NavLinks;
  socialLinks: { label: string; href: string }[];
  whoami: {
    name: string;
    title: string;
    summary: string;
  };
}

export const SITE: SiteConfig = {
  title: "Jonas Beck — Platform Engineer",
  description:
    "Platform Engineer based in Denmark. Working to improve developer experience through IDP Backstage and building internal tooling.",
  author: "Jonas Beck",
  lang: "en",
  canonicalURL: "https://jonasbeck.dk",
  socialImage: undefined,
  email: "contact@jonasbeck.dk",
  shellPrompt: "jonas@jonasbeck.dk",
  navLinks: [
    { label: "whoami", href: "#whoami" },
    { label: "experience", href: "#experience" },
    { label: "contrib", href: "#contrib" },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://linkedin.com/in/jonas-beck-591a88291" },
    { label: "Github", href: "https://github.com/Jonas-Beck" },
    { label: "OpenProfile", href: "https://openprofile.dev/jonasbeck" },
  ],
  whoami: {
    name: "Jonas Beck",
    title: "Platform Engineer",
    summary:
      "Based in Denmark. I improve developer experience through Backstage and internal tooling, and work hands-on with Kubernetes.",
  },
};
