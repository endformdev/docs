// @ts-check
import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://endform.dev",
	base: "/docs",
	trailingSlash: "never",

	build: {
		// This is needed when you want to remove trailing slashes with static output.
		format: "file",
	},

	integrations: [
		starlight({
			title: "Endform docs",
			logo: {
				dark: "./src/assets/endform-logo-wordmark-colored-on-dark-padding.svg",
				light:
					"./src/assets/endform-logo-wordmark-colored-on-light-padding.svg",
				replacesTitle: true,
				alt: "Endform logo",
			},
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/endformdev/docs",
				},
			],
			customCss: ["./src/styles/custom.css"],
			sidebar: [
				{
					label: "Explanation",
					autogenerate: { directory: "explanation" },
				},
				{
					label: "Guides",
					autogenerate: { directory: "guides" },
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],
		}),
	],

	adapter: cloudflare({
		imageService: "passthrough",
		platformProxy: {
			enabled: true,
		},
	}),
});
