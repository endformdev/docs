// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
	base: '/docs',
  integrations: [
      starlight({
          title: 'Endform Docs',
          social: {
              github: 'https://github.com/endformdev/docs',
          },
					customCss: [
						'./src/styles/custom.css',
					],
          sidebar: [
              {
                  label: 'Guides',
                  items: [
                      // Each item here is one entry in the navigation menu.
                      { label: 'Example Guide', slug: 'guides/example' },
                  ],
              },
              {
                  label: 'Reference',
                  autogenerate: { directory: 'reference' },
              },
          ],
      }),
	],

  adapter: cloudflare({
			imageService: 'cloudflare',
      platformProxy: {
          enabled: true,
					
      }
  }),
});