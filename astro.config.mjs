import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ambuyazwe.sevalla.page',
  output: 'static',
  integrations: [sitemap()],
  server: { host: true },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
