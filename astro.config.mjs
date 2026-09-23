import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkRewriteJekyll, remarkStripJekyllRaw } from './src/lib/jekyll.ts';
import { astroRedirects } from './scripts/legacy-url-redirects.mjs';

function tilSubmodule() {
  const root = path.resolve('today-i-learned');
  const populated = fs.existsSync(path.join(root, 'git')) || fs.existsSync(path.join(root, 'python'));
  if (!fs.existsSync(root) || !populated) {
    throw new Error('today-i-learned submodule is missing. Run: git submodule update --init --recursive');
  }
}

tilSubmodule();

export default defineConfig({
  site: 'https://arshadmehmood.com',
  output: 'static',
  trailingSlash: 'always',
  redirects: astroRedirects,
  build: {
    format: 'directory',
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkRewriteJekyll, remarkStripJekyllRaw],
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: true,
    },
  },
});
