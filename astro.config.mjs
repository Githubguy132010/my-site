import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://GitHubguy132010.github.io/',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    react(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'dark-plus',
      wrap: true,
    },
  },
  output: 'static',
  outDir: './dist',
});