import { categorySlug, tagSlug } from './paths.mjs';

/**
 * Closed post taxonomy. YAML `category:` and the URL segment must be one of these.
 * Display is Title Case of the slug unless listed in CATEGORY_LABEL_EXCEPTIONS.
 */
export const CATEGORY_SLUGS = [
  'android',
  'cryptocurrency',
  'development',
  'devops',
  'hardware',
  'personal',
  'security',
  'software',
  'tutorial',
];

/** Irregular English only. Do not list names that Title Case already gets right. */
const CATEGORY_LABEL_EXCEPTIONS = {
  devops: 'DevOps',
};

export function titleCaseSlug(slug) {
  return String(slug)
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isKnownCategory(value) {
  return CATEGORY_SLUGS.includes(categorySlug(value));
}

export function categoryLabel(value) {
  const slug = categorySlug(value);
  if (!slug) return 'Other';
  return CATEGORY_LABEL_EXCEPTIONS[slug] || titleCaseSlug(slug);
}

export function sameCategory(a, b) {
  return categorySlug(a || '') === categorySlug(b || '');
}

export function groupByCategoryName(entries) {
  const map = new Map();
  for (const entry of entries) {
    const raw = entry.category || 'other';
    const slug = categorySlug(raw) || 'other';
    const name = entry.kind === 'til' ? slug : categoryLabel(slug);
    const current = map.get(slug);
    if (current) {
      current.items.push(entry);
    } else {
      map.set(slug, { name, slug, items: [entry] });
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function preferredTagName(names) {
  return [...names.entries()].sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    const aLower = a[0] === a[0].toLowerCase();
    const bLower = b[0] === b[0].toLowerCase();
    if (aLower !== bLower) return aLower ? -1 : 1;
    return a[0].localeCompare(b[0]);
  })[0][0];
}

export function groupByTagName(entries) {
  const map = new Map();
  for (const entry of entries) {
    for (const tag of entry.tags || []) {
      const raw = String(tag).trim();
      if (!raw) continue;
      const slug = tagSlug(raw) || raw;
      const current = map.get(slug);
      if (current) {
        current.items.push(entry);
        current.names.set(raw, (current.names.get(raw) || 0) + 1);
      } else {
        map.set(slug, { slug, items: [entry], names: new Map([[raw, 1]]) });
      }
    }
  }
  return [...map.values()]
    .map((group) => ({
      name: preferredTagName(group.names),
      slug: group.slug,
      items: group.items,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
