/**
 * URL path helpers. Kept as plain JS so Node 20 tests can import them
 * without a TypeScript loader.
 */

export function withTrailingSlash(pathname) {
  if (!pathname || pathname === '/') return '/';
  if (/\.[a-z0-9]+$/i.test(pathname)) return pathname;
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function stripSlashes(pathname) {
  return String(pathname).replace(/^\/+|\/+$/g, '');
}

export function categorySlug(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function filenameSlug(id) {
  return String(id).replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\\/g, '/');
}

export function postPermalink(category, fileId) {
  return withTrailingSlash(`/${categorySlug(category)}/${filenameSlug(fileId)}`);
}

export function tilPermalink(entryId) {
  return withTrailingSlash(`/today-i-learned/${entryId}`);
}
