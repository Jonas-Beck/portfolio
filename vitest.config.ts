/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// getViteConfig runs the tests through Astro's Vite pipeline, so `astro:*`
// virtual modules, collections and `.astro` components resolve as they do in
// the build.
export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts"],
  },
});
