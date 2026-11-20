// @ts-check
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightThemeRapide from "starlight-theme-rapide";

// https://astro.build/config
export default defineConfig({
	site: "https://endform.dev",
	base: "/docs",
	outDir: "./dist/docs",
	trailingSlash: "never",

	build: {
		// This is needed when you want to remove trailing slashes with static output.
		format: "file",
	},

	integrations: [
		starlight({
			title: "Endform docs",
			plugins: [
				starlightThemeRapide(),
				starlightLlmsTxt({
					projectName: "Endform",
					customSets: [
						{
							label: "Getting started",
							paths: [
								"index",
								"guides/getting-started",
								"guides/getting-started/local-cli/**",
								"reference/requirements",
							],
							description:
								"set up Endform and run an existing Playwright suite for the first time",
						},
						{
							label: "Run and configure Endform",
							paths: [
								"explanation/custom-reporters",
								"explanation/transfer-state-to-remote-runners",
								"explanation/webkit-browser-support",
								"guides/getting-started",
								"guides/proxy-via-local",
								"guides/tune-playwright-suite-performance",
								"reference/endform-config*",
								"reference/environment-variables",
								"reference/requirements",
							],
							description:
								"use the Endform CLI with your existing Playwright setup and configure remote test execution",
						},
						{
							label: "Test health and history",
							paths: [
								"explanation/dashboard-analytics",
								"reference/analytics-cli",
								"reference/mcp-server",
								"guides/investigate-test-history-with-ai",
							],
							description:
								"use the dashboard, Endform CLI, or MCP server to find flaky, failing, and slow tests and inspect past runs and traces",
						},
						{
							label: "Debugging tests",
							paths: ["reference/mcp-server", "guides/debug-tests-with-ai"],
							description:
								"set up and use the Endform MCP server to query test history and debug Playwright tests with your AI agent",
						},
						{
							label: "How Endform works",
							paths: [
								"index",
								"explanation/what-is-endform",
								"explanation/how-your-tests-are-run",
							],
							description:
								"what Endform is and how it runs Playwright tests in parallel on isolated machines",
						},
						{
							label: "GitHub Actions, CI, and Vercel",
							paths: [
								"guides/getting-started/github-actions/**",
								"guides/getting-started/other-ci/**",
								"guides/vercel-integration/**",
							],
							description:
								"run Endform in GitHub Actions or another CI system and test Vercel preview deployments",
						},
						{
							label: "Netlify",
							paths: ["guides/netlify-integration/**"],
							description:
								"run Endform against Netlify Deploy Previews with the Endform Netlify extension",
						},
					],
					minify: {
						whitespace: false,
					},
					customSelectors: {
						all: [".sl-anchor-link", ".selector-panel"],
					},
					promote: ["index", "guides/getting-started"],
					exclude: ["guides/getting-started/*/*/*"],
				}),
			],
			customCss: [
				"@fontsource/inter/400.css",
				"@fontsource/inter/400-italic.css",
				"@fontsource/inter/500.css",
				"@fontsource/inter/600.css",
				"@fontsource/inter/700.css",
				"/src/styles/custom.css",
			],
			components: {
				Sidebar: "./src/components/Sidebar.astro",
				// Adds the cookie banner, which also starts PostHog.
				Footer: "./src/components/Footer.astro",
			},
			routeMiddleware: "./src/routeData.ts",
			logo: {
				dark: "./src/assets/endform-logo-wordmark-colored-on-dark-padding.svg",
				light:
					"./src/assets/endform-logo-wordmark-colored-on-light-padding.svg",
				replacesTitle: true,
				alt: "Endform logo",
			},
			social: [
				{
					icon: "external",
					label: "Endform Dashboard",
					href: "https://endform.dev/app",
				},
				{
					icon: "discord",
					label: "Discord",
					href: "https://endform.dev/discord",
				},
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/endformdev",
				},
			],
			sidebar: [
				{
					label: "Explanation",
					items: [{ autogenerate: { directory: "explanation" } }],
				},
				{
					label: "Guides",
					items: [{ autogenerate: { directory: "guides" } }],
				},
				{
					label: "Tutorial",
					items: [{ autogenerate: { directory: "tutorial" } }],
				},
				{
					label: "Reference",
					items: [{ autogenerate: { directory: "reference" } }],
				},
			],

			head:
				process.env.NODE_ENV === "development"
					? []
					: [
							// Set theme before third-party scripts to avoid a dark flash on light theme.
							{
								tag: "script",
								content: `(() => {
						try {
							const storedTheme = localStorage.getItem("starlight-theme");
							const preferredTheme =
								storedTheme === "light" || storedTheme === "dark"
									? storedTheme
									: window.matchMedia("(prefers-color-scheme: light)").matches
										? "light"
										: "dark";
							document.documentElement.dataset.theme = preferredTheme;
						} catch {
							document.documentElement.dataset.theme = window.matchMedia("(prefers-color-scheme: light)").matches
								? "light"
								: "dark";
						}
					})();`,
							},
							{
								tag: "script",
								attrs: {
									defer: true,
									src: "https://static.cloudflareinsights.com/beacon.min.js",
									"data-cf-beacon":
										'{"token":"962bb11e04cf44df87f086d758a37710"}',
								},
							},
							{
								tag: "script",
								// Google Tag Manager
								attrs: {
									type: "text/plain",
									"data-consent": "analytics marketing",
								},
								content: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MG4F2GKF');`,
							},
							{
								tag: "script",
								// Snitcher
								attrs: {
									type: "text/plain",
									"data-consent": "marketing",
								},
								content: `!function(e){"use strict";var t=e&&e.namespace;if(t&&e.profileId&&e.cdn){var i=window[t];if(i&&Array.isArray(i)||(i=window[t]=[]),!i.initialized&&!i._loaded)if(i._loaded)console&&console.warn("[Radar] Duplicate initialization attempted");else{i._loaded=!0;["track","page","identify","company","group","alias","ready","debug","on","off","once","trackClick","trackSubmit","trackLink","trackForm","pageview","screen","reset","register","setAnonymousId","addSourceMiddleware","addIntegrationMiddleware","addDestinationMiddleware","giveCookieConsent","denyCookieConsent"].forEach((function(e){var a;i[e]=(a=e,function(){var e=window[t];if(e.initialized)return e[a].apply(e,arguments);var i=[].slice.call(arguments);return i.unshift(a),e.push(i),e})})),-1===e.apiEndpoint.indexOf("http")&&(e.apiEndpoint="https://"+e.apiEndpoint),i.bootstrap=function(){var t,i=document.createElement("script");i.async=!0,i.type="text/javascript",i.id="__radar__",i.setAttribute("data-settings",JSON.stringify(e)),i.src=[-1!==(t=e.cdn).indexOf("http")?"":"https://",t,"/releases/latest/radar.min.js"].join("");var a=document.scripts[0];a.parentNode.insertBefore(i,a)},i.bootstrap()}}else"undefined"!=typeof console&&console.error("[Radar] Configuration incomplete")}({
  "apiEndpoint": "radar.snitcher.com",
  "cdn": "cdn.snitcher.com",
  "namespace": "Snitcher",
  "profileId": "sujp9KJlvL"
});`,
							},
							{
								tag: "script",
								// LinkedIn Insight Tag
								attrs: {
									type: "text/plain",
									"data-consent": "marketing",
								},
								content: `window._linkedin_partner_id = "10077106";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
(function (l) {
  if (!l) {
    window.lintrk = function (a, b) {
      window.lintrk.q.push([a, b]);
    };
    window.lintrk.q = [];
  }
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";
  b.async = true;
  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);
})(window.lintrk);`,
							},
							{
								tag: "script",
								// Meta Pixel
								attrs: {
									type: "text/plain",
									"data-consent": "marketing",
								},
								content: `!(function (f, b, e, v, n, t, s) {
  if (f.fbq) return;
  n = f.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  };
  if (!f._fbq) f._fbq = n;
  n.push = n;
  n.loaded = !0;
  n.version = "2.0";
  n.queue = [];
  t = b.createElement(e);
  t.async = !0;
  t.src = v;
  s = b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t, s);
})(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
fbq("init", "1152253464451056");
fbq("track", "PageView");`,
							},
						],
		}),
	],
});
