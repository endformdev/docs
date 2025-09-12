// @ts-check
import cloudflare from "@astrojs/cloudflare";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightThemeRapide from "starlight-theme-rapide";

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
			plugins: [starlightThemeRapide()],
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
					href: "https://github.com/endformdev",
				},
			],
			sidebar: [
				{
					label: "Guides",
					autogenerate: { directory: "guides" },
				},
				{
					label: "Tutorial",
					autogenerate: { directory: "tutorial" },
				},
				{
					label: "Explanation",
					autogenerate: { directory: "explanation" },
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" },
				},
			],

			head: [{
				tag: 'script',
				attrs: {
					id: 'posthog-js',
					type: 'text/javascript',
				},
				content: `
					!(function (t, e) {
						var o, n, p, r
						e.__SV ||
							((window.posthog = e),
							(e._i = []),
							(e.init = function (i, s, a) {
								function g(t, e) {
									var o = e.split(".")
									;(2 == o.length && ((t = t[o[0]]), (e = o[1])),
										(t[e] = function () {
											t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
										}))
								}
								;(((p = t.createElement("script")).type = "text/javascript"),
									(p.crossOrigin = "anonymous"),
									(p.async = true),
									(p.src = s.api_host + "/static/array.js"),
									(r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(
										p,
										r
									))
								var u = e
								void 0 !== a ? (u = e[a] = []) : (a = "posthog")
								u.people = u.people || []
								u.toString = function (t) {
									var e = "posthog"
									return ("posthog" !== a && (e += "." + a), t || (e += " (stub)"), e)
								}
								u.people.toString = function () {
									return u.toString(1) + ".people (stub)"
								}
								o =
									"capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(
										" "
									)
								for (n = 0; n < o.length; n++) g(u, o[n])
								e._i.push([i, s, a])
							}),
							(e.__SV = 1))
					})(document, window.posthog || [])

					posthog.init("phc_CFBLzSpXHQAX9UYMiHudLL3iYWgXfnUVOCuEd079EV1", {
						ui_host: "eu.posthog.com",
						api_host: "/p5g",
						defaults: "2025-05-24",
						disable_surveys: true,
					})
				`
			}]
		}),
	],

	adapter: cloudflare({
		imageService: "passthrough",
		platformProxy: {
			enabled: true,
		},
	}),
});
