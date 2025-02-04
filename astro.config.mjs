// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// import tailwind from "@astrojs/tailwind";
import tailwindcss from "@tailwindcss/vite";

import sitemap from "@astrojs/sitemap";

// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
export default defineConfig({
  site: "https://bunestro.ardastroid.com/",
  integrations: [
    react(),
    // tailwind({
    //   applyBaseStyles: false,
    // }),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
