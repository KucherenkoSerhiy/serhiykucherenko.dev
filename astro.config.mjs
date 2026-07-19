// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://serhiykucherenko.dev',
  integrations: [mdx(), sitemap()],
  redirects: { '/projects/': '/lab/' },
});
