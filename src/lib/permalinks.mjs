import { withTrailingSlash } from './paths.mjs';
import { listingRoutes } from './routes.mjs';

export function permalinkKey(pathname) {
  return withTrailingSlash(pathname);
}

export function isPublishedData(data) {
  return !data || data.draft !== true;
}

/**
 * Fail if two entries share a path, or if a collection permalink collides
 * with a listing route. Astro can otherwise overwrite or pick a winner silently.
 *
 * @param {Array<{ kind?: string, id?: string, permalink: string }>} entries
 * @param {Array<{ path: string, title?: string }>} listings
 */
export function assertUniquePermalinks(entries, listings = listingRoutes) {
  const seen = new Map();
  const collisions = [];

  function claim(pathname, owner) {
    const key = permalinkKey(pathname);
    const existing = seen.get(key);
    if (existing) {
      collisions.push(`${owner} collides with ${existing} at ${key}`);
      return;
    }
    seen.set(key, owner);
  }

  for (const route of listings) {
    claim(route.path, `listing:${route.path}`);
  }
  for (const entry of entries) {
    claim(entry.permalink, `${entry.kind || 'entry'}:${entry.id || entry.permalink}`);
  }

  if (collisions.length) {
    throw new Error(`Duplicate permalinks:\n${collisions.join('\n')}`);
  }

  return seen;
}
