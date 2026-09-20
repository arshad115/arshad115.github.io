import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const root = path.join(__dirname, '../..');
export const distDir = path.join(root, 'dist');

export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  const withLeading = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (/\.[a-z0-9]+$/i.test(withLeading)) return withLeading;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export function pathnameFromUrl(url) {
  const { pathname } = new URL(url);
  return normalizePath(decodeURIComponent(pathname));
}

export function isRedirectHtml(html) {
  return /http-equiv=["']refresh["']/i.test(html) || /<title>\s*Redirecting to:/i.test(html);
}

export function distPathFor(urlPath) {
  const normalized = normalizePath(urlPath);
  if (normalized === '/404/' || normalized === '/404.html') {
    return path.join(distDir, '404.html');
  }
  if (/\.[a-z0-9]+$/i.test(normalized)) {
    return path.join(distDir, decodeURIComponent(normalized.slice(1)));
  }
  return path.join(distDir, ...normalized.split('/').filter(Boolean), 'index.html');
}

export async function collectHtmlFiles(baseDir, relativeDir = '') {
  const files = new Map();
  let entries;
  try {
    entries = await fs.readdir(baseDir, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error('dist/ not found. Run `npm run build` before site tests.');
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

export async function collectStaticAssetPaths(baseDir, urlPrefix) {
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

export async function readDist(urlPath) {
  const file = distPathFor(urlPath);
  try {
    return await fs.readFile(file, 'utf8');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`missing in dist/: ${urlPath} (${file})`);
    }
    throw error;
  }
}
