// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

// Canonical site origin. Set SITE_URL in the shell/.env locally, and in the
// Cloudflare Workers Build environment for CI. Falls back to the original
// design-preview host.
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const site = process.env.SITE_URL ?? fileEnv.SITE_URL ?? 'https://archcell-atelier.aunabbas572.chatgpt.site';

export default defineConfig({
  site,
  output: 'static',
});
