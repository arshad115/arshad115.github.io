import { withTrailingSlash } from './paths.mjs';
import { sameCategory } from './taxonomy.mjs';

const SITE_ORIGIN = 'https://arshadmehmood.com';

/**
 * In-site destinations from markdown links. Images (`![ ]()`) are ignored.
 * Do not invent neighbors from shared tags.
 *
 * @param {string} markdown
 * @param {string} [origin]
 * @returns {string[]}
 */
export function linkedPermalinks(markdown, origin = SITE_ORIGIN) {
  if (!markdown) return [];
  const found = [];
  const pattern = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = pattern.exec(markdown))) {
    let href = String(match[2] || '')
      .trim()
      .split(/\s+/)[0]
      .replace(/^<|>$/g, '');
    if (!href || href.startsWith('#')) continue;
    if (href.startsWith(origin)) href = href.slice(origin.length) || '/';
    if (!href.startsWith('/')) continue;
    href = href.split('#')[0].split('?')[0];
    if (!href || href.startsWith('/assets/')) continue;
    found.push(withTrailingSlash(href));
  }
  return found;
}

/**
 * Real markdown links first, then same-category posts. Never tag-overlap.
 *
 * @param {{ permalink: string, category?: string, body?: string }} post
 * @param {Array<{ permalink: string, category?: string, kind?: string }>} catalog
 * @param {number} [limit]
 */
export function relatedPosts(post, catalog, limit = 3) {
  const picked = [];
  const seen = new Set([post.permalink]);

  function take(item) {
    if (!item || seen.has(item.permalink)) return;
    seen.add(item.permalink);
    picked.push(item);
  }

  const byPermalink = new Map(catalog.map((item) => [item.permalink, item]));
  for (const href of linkedPermalinks(post.body || '')) {
    if (picked.length >= limit) return picked;
    take(byPermalink.get(href));
  }

  for (const item of catalog) {
    if (picked.length >= limit) break;
    if (!item.category || !sameCategory(item.category, post.category)) continue;
    take(item);
  }

  return picked;
}

export function relatedHeading(entry, related) {
  const mixed = related.some(
    (item) => item.kind !== entry.kind || item.category !== entry.category,
  );
  if (mixed) return 'Related';
  return `More in ${entry.categoryLabel || entry.category || 'this section'}`;
}
