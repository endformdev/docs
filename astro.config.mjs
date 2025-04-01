import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";
// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	base: "/docs",
	integrations: [
		starlight({
			title: "Endform Documentation",
			social: {
				github: "https://github.com/endformdev/docs",
			},
			customCss: ["./src/styles/custom.css"],
			sidebar: [
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
				{
					label: "Guides",
					autogenerate: { directory: "guides" },
				},
			],
		}),
	],

	adapter: cloudflare({
		imageService: "cloudflare",
		platformProxy: {
			enabled: true,
		},
	}),
});
