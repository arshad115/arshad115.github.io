/**
 * URL parity: every path in the frozen Jekyll sitemap must land on real HTML in dist/.
 *
 * Live Jekyll paths in the fixture may redirect to cleaned slugs. After following
 * aliases, the landing path must be real HTML in dist/, not a redirect page.
 *
 * Run: npm run test:site  (requires a fresh npm run build)
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { legacyUrlRedirects } from '../scripts/legacy-url-redirects.mjs';
import {
  collectHtmlFiles,
  collectStaticAssetPaths,
  distDir,
  isRedirectHtml,
  normalizePath,
  pathnameFromUrl,
  root,
} from './helpers/dist.mjs';

const fixturePath = path.join(root, 'tests/fixtures/jekyll-sitemap.xml');

const EXCLUDED_PATHS = new Set([
  '/MIGRATION_PLAN/',
  '/POST_GENERATOR_README/',
  '/today-i-learned/readme/',
  '/today-i-learned/SCRIPT_README/',
  '/today-i-learned/TIL_SCRIPTS_README/',
]);

function shouldExclude(pathname) {
  return EXCLUDED_PATHS.has(pathname);
}

function resolveRedirect(pathname, redirects, maxHops = 12) {
  let current = normalizePath(pathname);
  const visited = new Set();

  for (let hop = 0; hop < maxHops; hop += 1) {
    if (visited.has(current)) return current;
    visited.add(current);
    const target = redirects[current];
    if (!target) return current;
    current = normalizePath(target);
  }

  return current;
}

async function parseFixtureUrls() {
  const xml = await fs.readFile(fixturePath, 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test('frozen Jekyll sitemap URLs land on real HTML in dist/', async () => {
  const [liveUrls, htmlFiles, assetPaths] = await Promise.all([
    parseFixtureUrls(),
    collectHtmlFiles(distDir),
    collectStaticAssetPaths(path.join(distDir, 'assets'), '/assets'),
  ]);

  const redirectSources = new Set(Object.keys(legacyUrlRedirects).map(normalizePath));
  const missing = [];

  for (const liveUrl of liveUrls) {
    const livePath = pathnameFromUrl(liveUrl);
    if (shouldExclude(livePath)) continue;

    const expectedPath = resolveRedirect(livePath, legacyUrlRedirects);

    if (/\.[a-z0-9]+$/i.test(expectedPath)) {
      if (!assetPaths.has(expectedPath) && !htmlFiles.has(expectedPath)) {
        missing.push({ livePath, expectedPath, reason: 'asset missing' });
      }
      continue;
    }

    const htmlPath = htmlFiles.get(expectedPath);
    if (!htmlPath) {
      missing.push({ livePath, expectedPath, reason: 'no HTML in dist' });
      continue;
    }

    if (redirectSources.has(expectedPath)) {
      missing.push({ livePath, expectedPath, reason: 'landed on a redirect source' });
      continue;
    }

    const html = await fs.readFile(htmlPath, 'utf8');
    if (isRedirectHtml(html)) {
      missing.push({ livePath, expectedPath, reason: 'landing HTML is a redirect page' });
    }
  }

  const report = missing
    .map(({ livePath, expectedPath, reason }) => `  ${livePath} -> ${expectedPath} (${reason})`)
    .join('\n');

  assert.equal(
    missing.length,
    0,
    missing.length ? `${missing.length} fixture URL(s) failed:\n${report}` : undefined,
  );
});
