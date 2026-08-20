// @ts-check
import { defineConfig } from 'astro/config';

// Static site. `npm run build` emits a plain folder of HTML/CSS/JS in ./dist
// that can be dropped on any static host — no server, no runtime, no secrets.
export default defineConfig({
  site: 'https://minnattawat.com',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
