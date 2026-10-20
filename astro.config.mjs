import fs from 'node:fs';
import path from 'node:path';
import expressiveCode from 'astro-expressive-code';
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import {
  rehypeLocalImageDimensions,
  remarkNormalizeHeadingDepth,
  remarkRewriteJekyll,
  remarkStripJekyllRaw,
} from './src/lib/jekyll.ts';
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
  site: process.env.SITE_URL || 'https://arshadmehmood.com',
  output: 'static',
  trailingSlash: 'always',
  redirects: astroRedirects,
  build: {
    format: 'directory',
    // The complete shared stylesheet is small enough to ship with the document.
    // Inlining removes a render-blocking request and lets the browser discover
    // the preloaded body font without waiting for a CSS round trip.
    inlineStylesheets: 'always',
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkRewriteJekyll, remarkStripJekyllRaw, remarkNormalizeHeadingDepth],
      rehypePlugins: [rehypeLocalImageDimensions],
    }),
  },
  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme='${theme.type}']`,
      defaultProps: {
        wrap: true,
        overridesByLang: {
          'bash,console,powershell,sh,shell,terminal,zsh': { wrap: false },
        },
      },
      styleOverrides: {
        borderRadius: '0.625rem',
        codeFontFamily: 'var(--font-mono)',
        codeFontSize: '0.9rem',
        codeLineHeight: '1.55',
      },
    }),
  ],
});
