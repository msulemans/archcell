// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import { hasSanity, projectId, dataset } from './src/sanity/env.ts';

// Canonical site origin. Set SITE_URL in the shell/.env locally, and in the
// Cloudflare Workers Build environment for CI. Falls back to the original
// design-preview host.
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = process.env.SITE_URL ?? fileEnv.SITE_URL ?? 'https://archcell-atelier.aunabbas572.chatgpt.site';

// The Sanity Studio is embedded at /admin and content is fetched at build
// time. Until a project exists (see src/sanity/env.ts) the integration is
// skipped and the site builds from local fallback data.
export default defineConfig({
  site,
  output: 'static',
  integrations: hasSanity
    ? [
        sanity({
          projectId,
          dataset,
          useCdn: false,
          studioBasePath: '/admin',
        }),
        react(),
      ]
    : [],
});
