// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://docs.astro.build/en/guides/environment-variables/#in-the-astro-config-file
export default defineConfig({
	site: "https://svgr.ardastroid.com/",
	integrations: [react(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
});
