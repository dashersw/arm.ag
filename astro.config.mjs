import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import redirects from './src/data/redirects.json' with { type: 'json' }

export default defineConfig({
  site: 'https://arm.ag',
  trailingSlash: 'always',
  redirects,
  integrations: [sitemap()],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
})
