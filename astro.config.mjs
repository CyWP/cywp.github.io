// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://cywp.github.io",
  base: "",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      wrap: true,
      theme: "min-light", // <-- change this to any Shiki theme you like
    },
  },
});