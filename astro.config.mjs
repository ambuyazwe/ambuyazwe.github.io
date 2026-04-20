import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ambuyazwe.github.io',
  output: 'static',
  integrations: [sitemap()],
  server: { host: true },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
