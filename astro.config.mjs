import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import { remarkRewriteJekyll, remarkStripJekyllRaw } from './src/lib/jekyll.ts';
import { legacyUrlRedirects } from './scripts/legacy-url-redirects.mjs';

function tilSubmodule() {
  return {
    name: 'til-submodule-check',
    hooks: {
      'astro:config:setup': () => {
        const root = path.resolve('today-i-learned');
        const populated = fs.existsSync(path.join(root, 'git')) || fs.existsSync(path.join(root, 'python'));
        if (!fs.existsSync(root) || !populated) {
          throw new Error(
            'today-i-learned submodule is missing. Run: git submodule update --init --recursive',
          );
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://arshadmehmood.com',
  output: 'static',
  trailingSlash: 'always',
  redirects: legacyUrlRedirects,
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [remarkRewriteJekyll, remarkStripJekyllRaw],
    shikiConfig: {
      themes: {
        light: 'rose-pine-dawn',
        dark: 'rose-pine-moon',
      },
      defaultColor: false,
      wrap: true,
    },
  },
  integrations: [tilSubmodule()],
});
