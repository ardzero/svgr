// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	// must include https:// in the url
	site: "https://svgr.ardzero.com",
	integrations: [react(), sitemap()],

	vite: {
		plugins: [tailwindcss()],
	},
});
