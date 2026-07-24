// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://serhiykucherenko.dev',
  integrations: [mdx(), sitemap()],
  redirects: {
    '/projects/': '/lab/',
    '/hire/': '/contact/',
    '/build/': '/systems/',
    '/build/[id]': '/systems/[id]',
    // The article moved back to where it was published.
    '/blog/localhost-trap/':
      'https://www.linkedin.com/pulse/localhost-trap-10-second-database-connection-windows-kucherenko-1cm1e/',
  },
  markdown: { shikiConfig: { theme: 'css-variables' } },
});
