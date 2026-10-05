import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;

	const ogImage = new URL("/og-image.png", "https://og-image.endform.dev");
	ogImage.searchParams.set("title", route.entry.data.title);

	route.head.push(
		{ tag: "meta", attrs: { property: "og:image", content: ogImage.href } },
		{ tag: "meta", attrs: { name: "twitter:image", content: ogImage.href } },
	);
});
