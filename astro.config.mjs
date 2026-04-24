import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ambuyazwe.github.io',
  output: 'static',
  integrations: [],
  server: { host: true },
  devToolbar: { enabled: false },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
