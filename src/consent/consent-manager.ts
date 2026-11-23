/**
 * The cookie banner's behaviour, copied from `domains/consent` in the endform
 * monorepo, which the marketing site, the new docs and the dashboard use.
 * These docs share the endform.dev origin with them, so a choice made on any
 * of them applies here too. Keep the cookie format, version and wording in
 * sync with that package until these docs are replaced.
 */
import posthog from "posthog-js";

type ConsentCategory = "analytics" | "marketing";
type ConsentChoices = Record<ConsentCategory, boolean>;
type Consent = ConsentChoices & { version: number; updatedAt: string };

const CONSENT_COOKIE_NAME = "endform_consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;
const POSTHOG_KEY = "phc_CFBLzSpXHQAX9UYMiHudLL3iYWgXfnUVOCuEd079EV1";

/**
 * Prefixes of the first-party cookies and local and session storage keys set
 * by each category's scripts, removed when the visitor withdraws that category.
 */
const TRACKING_PREFIXES: Record<ConsentCategory, string[]> = {
	analytics: ["ph_", "_ga"],
	marketing: ["endform_gclid", "_gcl_", "_fbp", "_fbc", "li_fat_id", "dayly_"],
};

/**
 * Runs third-party scripts according to the visitor's choice and shows the
 * cookie banner until they make one. Scripts that need consent are rendered as
 * `<script type="text/plain" data-consent="marketing">`, with every category
 * that allows them in `data-consent`. Any element with `data-consent-open`
 * reopens the banner.
 */
export function startConsentManager(banner: HTMLElement) {
	const consent = readConsent();

	pushGoogleConsent("default", consent);
	posthog.init(POSTHOG_KEY, {
		ui_host: "eu.posthog.com",
		api_host: "/p5g",
		defaults: "2025-05-24",
		disable_surveys: true,
		persistence: posthogPersistence(consent),
	});
	activateConsentedScripts(consent);

	wireBanner(banner);
	if (!consent) showBanner(banner, { focus: false });

	document.addEventListener("click", (event) => {
		if (!(event.target instanceof Element)) return;
		if (!event.target.closest("[data-consent-open]")) return;

		event.preventDefault();
		showBanner(banner, { focus: true });
	});
}

function saveConsent(choices: ConsentChoices) {
	const previous = readConsent();
	const next: Consent = {
		version: CONSENT_VERSION,
		...choices,
		updatedAt: new Date().toISOString(),
	};
	document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(next))}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax; Secure`;

	const withdrawn = (["analytics", "marketing"] as const).filter(
		(category) => previous?.[category] && !next[category],
	);
	if (withdrawn.length > 0) {
		// Scripts that already run can't be stopped, so start over without them.
		deleteTrackingData(
			withdrawn.flatMap((category) => TRACKING_PREFIXES[category]),
		);
		location.reload();
		return;
	}

	pushGoogleConsent("update", next);
	posthog.set_config({ persistence: posthogPersistence(next) });
	activateConsentedScripts(next);
	if (next.marketing) storeGclid();
}

function readConsent(): Consent | null {
	const cookie = document.cookie
		.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${CONSENT_COOKIE_NAME}=`));
	if (!cookie) return null;

	try {
		const value = JSON.parse(
			decodeURIComponent(cookie.slice(CONSENT_COOKIE_NAME.length + 1)),
		);
		if (
			value?.version === CONSENT_VERSION &&
			typeof value.analytics === "boolean" &&
			typeof value.marketing === "boolean"
		)
			return value;
	} catch {}
	return null;
}

function wireBanner(banner: HTMLElement) {
	const details = banner.querySelector<HTMLElement>("[data-consent-details]")!;
	const customize = banner.querySelector("[data-consent-customize]")!;
	const save = banner.querySelector<HTMLElement>("[data-consent-save]")!;

	const choose = (choices: ConsentChoices) => {
		saveConsent(choices);
		banner.hidden = true;
	};

	customize.addEventListener("click", () => {
		const expanded = details.hidden;
		details.hidden = !expanded;
		save.hidden = !expanded;
		customize.setAttribute("aria-expanded", String(expanded));
	});
	save.addEventListener("click", () =>
		choose({
			analytics: checkbox(banner, "analytics").checked,
			marketing: checkbox(banner, "marketing").checked,
		}),
	);
	banner
		.querySelector("[data-consent-reject]")!
		.addEventListener("click", () =>
			choose({ analytics: false, marketing: false }),
		);
	banner
		.querySelector("[data-consent-accept]")!
		.addEventListener("click", () =>
			choose({ analytics: true, marketing: true }),
		);
}

function showBanner(banner: HTMLElement, options: { focus: boolean }) {
	const consent = readConsent();
	checkbox(banner, "analytics").checked = consent?.analytics ?? false;
	checkbox(banner, "marketing").checked = consent?.marketing ?? false;

	banner.hidden = false;
	if (options.focus) banner.querySelector<HTMLElement>("button")?.focus();
}

function checkbox(banner: HTMLElement, category: ConsentCategory) {
	return banner.querySelector<HTMLInputElement>(`input[name="${category}"]`)!;
}

function activateConsentedScripts(consent: Consent | null) {
	const placeholders = document.querySelectorAll<HTMLScriptElement>(
		'script[type="text/plain"][data-consent]',
	);

	for (const placeholder of placeholders) {
		const categories = placeholder.dataset.consent!.split(
			" ",
		) as ConsentCategory[];
		if (!categories.some((category) => consent?.[category])) continue;

		const script = document.createElement("script");
		for (const attribute of placeholder.attributes) {
			if (attribute.name === "type" || attribute.name === "data-consent")
				continue;
			script.setAttribute(attribute.name, attribute.value);
		}
		script.text = placeholder.text;
		placeholder.replaceWith(script);
	}
}

function pushGoogleConsent(
	command: "default" | "update",
	consent: Consent | null,
) {
	const w = window as Window & { dataLayer?: unknown[] };
	const dataLayer = (w.dataLayer ??= []);
	const marketing = consent?.marketing ? "granted" : "denied";

	// Google tags only read commands pushed as an `arguments` object.
	function gtag(..._args: unknown[]) {
		dataLayer.push(arguments);
	}
	gtag("consent", command, {
		ad_storage: marketing,
		ad_user_data: marketing,
		ad_personalization: marketing,
		analytics_storage: consent?.analytics ? "granted" : "denied",
	});
}

function posthogPersistence(consent: Consent | null) {
	return consent?.analytics ? "localStorage+cookie" : "memory";
}

/** Keeps the Google Ads click ID until signup, which reports the conversion. */
function storeGclid() {
	const gclid = new URLSearchParams(location.search).get("gclid")?.trim();
	if (!gclid) return;

	document.cookie = `endform_gclid=${encodeURIComponent(gclid)}; Path=/; Max-Age=${90 * 24 * 60 * 60}; SameSite=Lax; Secure`;
}

function deleteTrackingData(prefixes: string[]) {
	const names = document.cookie
		.split(";")
		.map((cookie) => cookie.split("=")[0]!.trim())
		.filter((name) => prefixes.some((prefix) => name.startsWith(prefix)));

	// A cookie can only be removed with the domain it was set with.
	const labels = location.hostname.split(".");
	const domains = ["", location.hostname, labels.slice(-2).join(".")];

	for (const name of names) {
		for (const domain of domains) {
			document.cookie = `${name}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
		}
	}

	for (const storage of [localStorage, sessionStorage]) {
		for (const key of Object.keys(storage)) {
			if (prefixes.some((prefix) => key.startsWith(prefix)))
				storage.removeItem(key);
		}
	}
}
