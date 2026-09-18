/**
 * URL parity regression test for the Jekyll → Astro migration.
 *
 * Compares every URL in the live production sitemap against paths produced
 * by `npm run build`, following configured legacy redirects.
 *
 * Run: npm run test:urls
 * Requires: a fresh build in ./dist (npm run build)
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { legacyUrlRedirects } from '../scripts/legacy-url-redirects.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const liveSite = process.env.URL_PARITY_BASE || 'https://arshadmehmood.com';

/** Paths intentionally dropped or replaced during migration. */
const EXCLUDED_PATHS = new Set([
  '/POST_GENERATOR_README/',
  '/sitemap/',
  '/today-i-learned/readme/',
  '/today-i-learned/SCRIPT_README/',
  '/today-i-learned/TIL_SCRIPTS_README/',
]);

/** Regex exclusions for paths that redirect or are non-page assets we handle separately. */
const EXCLUDED_PATTERNS = [
  /^\/page\d+\/$/,
];

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (/\.[a-z0-9]+$/i.test(withLeading)) return withLeading;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

function pathnameFromUrl(url) {
  const { pathname } = new URL(url);
  return normalizePath(decodeURIComponent(pathname));
}

function shouldExclude(pathname) {
  if (EXCLUDED_PATHS.has(pathname)) return true;
  return EXCLUDED_PATTERNS.some((pattern) => pattern.test(pathname));
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

function pathKey(pathname) {
  return decodeURIComponent(pathname).toLowerCase();
}

async function fetchLiveSitemapUrls() {
  const response = await fetch(`${liveSite}/sitemap.xml`);
  assert.equal(response.ok, true, `Failed to fetch live sitemap (${response.status})`);

  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

async function collectBuiltPaths(baseDir, relativeDir = '') {
  const paths = new Set();
  let entries;

  try {
    entries = await fs.readdir(baseDir, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error('dist/ not found. Run `npm run build` before `npm run test:urls`.');
    }
    throw error;
  }

  for (const entry of entries) {
    const entryRelative = path.posix.join(relativeDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectBuiltPaths(path.join(baseDir, entry.name), entryRelative);
      nested.forEach((value) => paths.add(value));
      continue;
    }

    if (entry.name === 'index.html') {
      paths.add(normalizePath(`/${relativeDir}`));
    } else if (entryRelative.endsWith('.html') && entry.name !== 'index.html') {
      paths.add(normalizePath(`/${entryRelative}`));
    }
  }

  return paths;
}

async function collectStaticAssetPaths(baseDir, urlPrefix) {
  const paths = new Set();

  async function walk(currentDir, currentPrefix) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const nextDir = path.join(currentDir, entry.name);
      const nextPrefix = `${currentPrefix}/${entry.name}`;

      if (entry.isDirectory()) {
        await walk(nextDir, nextPrefix);
      } else {
        paths.add(normalizePath(decodeURIComponent(nextPrefix)));
      }
    }
  }

  try {
    await walk(baseDir, urlPrefix);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return paths;
    }
    throw error;
  }

  return paths;
}

test('production sitemap URLs resolve in the Astro build', async () => {
  const [liveUrls, builtPaths, assetPaths] = await Promise.all([
    fetchLiveSitemapUrls(),
    collectBuiltPaths(distDir),
    collectStaticAssetPaths(path.join(distDir, 'assets'), '/assets'),
  ]);

  const availablePaths = new Set([...builtPaths, ...assetPaths]);
  for (const source of Object.keys(legacyUrlRedirects)) {
    availablePaths.add(normalizePath(source));
  }
  const availablePathKeys = new Set([...availablePaths].map(pathKey));

  const missing = [];

  for (const liveUrl of liveUrls) {
    const livePath = pathnameFromUrl(liveUrl);
    if (shouldExclude(livePath)) continue;

    const expectedPath = resolveRedirect(livePath, legacyUrlRedirects);
    if (!availablePathKeys.has(pathKey(expectedPath)) && !availablePathKeys.has(pathKey(livePath))) {
      missing.push({ livePath, expectedPath });
    }
  }

  const report = missing
    .map(({ livePath, expectedPath }) => `  ${livePath} -> ${expectedPath}`)
    .join('\n');

  assert.equal(
    missing.length,
    0,
    missing.length
      ? `${missing.length} live URL(s) missing from the Astro build:\n${report}`
      : undefined,
  );
});
