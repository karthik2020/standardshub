// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://standardshub.in',
  integrations: [
    sitemap({
      // Exclude prototype pages and the 404 page from the sitemap.
      filter: (page) => !page.includes('/prototype/') && !page.includes('/404'),
    }),
  ],
});
