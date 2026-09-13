// @ts-check
import { defineConfig } from 'astro/config';

// Canonical site origin. Set SITE_URL in the build environment when the
// production domain changes (Cloudflare Workers URL or a custom domain).
const site = process.env.SITE_URL ?? 'https://archcell-atelier.aunabbas572.chatgpt.site';

export default defineConfig({
  site,
  output: 'static',
});
