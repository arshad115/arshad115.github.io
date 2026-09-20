/**
 * URL parity: every path in the frozen Jekyll sitemap must land on real HTML in dist/.
 *
 * Redirects are aliases only. After following them, the destination must exist as a
 * non-redirect page. Redirect *sources* do not count as successful pages.
 *
 * Run: npm run test:urls  (requires a fresh npm run build)
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
const fixturePath = path.join(root, 'tests/fixtures/jekyll-sitemap.xml');

const EXCLUDED_PATHS = new Set([
  '/MIGRATION_PLAN/',
  '/POST_GENERATOR_README/',
  '/today-i-learned/readme/',
  '/today-i-learned/SCRIPT_README/',
  '/today-i-learned/TIL_SCRIPTS_README/',
]);

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

async function collectHtmlFiles(baseDir, relativeDir = '') {
  const files = new Map();
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
      const nested = await collectHtmlFiles(path.join(baseDir, entry.name), entryRelative);
      nested.forEach((value, key) => files.set(key, value));
      continue;
    }
    if (entry.name === 'index.html') {
      files.set(normalizePath(`/${relativeDir}`), path.join(baseDir, entry.name));
    } else if (entry.name.endsWith('.html')) {
      files.set(normalizePath(`/${entryRelative}`), path.join(baseDir, entry.name));
    }
  }

  return files;
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

function isRedirectHtml(html) {
  return /http-equiv=["']refresh["']/i.test(html) || /<title>\s*Redirecting to:/i.test(html);
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
