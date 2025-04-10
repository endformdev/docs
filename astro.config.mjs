// @ts-check
import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	base: "/docs",
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
