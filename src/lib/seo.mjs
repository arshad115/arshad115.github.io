import { BLOG_ID, PERSON_ID, SITE, WEBSITE_ID } from './site-meta.mjs';
import { stripSlashes, withTrailingSlash } from './paths.mjs';

export { BLOG_ID, PERSON_ID, SITE, WEBSITE_ID };

export function absoluteUrl(pathname) {
  if (!pathname) return SITE.url;
  if (pathname.startsWith('http')) return pathname;
  return new URL(pathname, `${SITE.url}/`).toString();
}

/** Date-only (YYYY-MM-DD) for sitemaps. */
export function isoDate(value) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString().slice(0, 10);
}

/** Full ISO-8601 instant for Open Graph / JSON-LD. */
export function isoDateTime(value) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/** Markdown twin for a trailing-slash HTML URL (`/about/` → `/about/index.md`). */
export function markdownPath(permalink) {
  if (!permalink || permalink === '/') return '/index.md';
  if (/\.md$/i.test(permalink)) return permalink.startsWith('/') ? permalink : `/${permalink}`;
  return `${withTrailingSlash(permalink)}index.md`;
}

export function markdownUrl(permalink) {
  return absoluteUrl(markdownPath(permalink));
}

export function personNode() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.author,
    url: SITE.url,
    image: absoluteUrl(SITE.defaultImage),
    jobTitle: SITE.jobTitle,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.locality,
      addressCountry: SITE.country,
    },
    sameAs: [SITE.github, SITE.linkedin, SITE.twitter, SITE.instagram],
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.url}/search/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function blogNode() {
  return {
    '@type': 'Blog',
    '@id': BLOG_ID,
    name: SITE.title,
    description: SITE.description,
    url: absoluteUrl('/posts/'),
    inLanguage: SITE.language,
    publisher: { '@id': PERSON_ID },
    author: { '@id': PERSON_ID },
  };
}

function articleType(kind) {
  if (kind === 'til') return 'TechArticle';
  if (kind === 'portfolio') return 'CreativeWork';
  return 'BlogPosting';
}

export function breadcrumbItems({ permalink, title, kind, category, categoryLabel }) {
  const home = { name: 'Home', path: '/' };
  if (!permalink || permalink === '/') return [home];
  if (kind === 'post') {
    return [
      home,
      { name: 'Posts', path: '/posts/' },
      ...(category
        ? [{ name: categoryLabel || category, path: `/categories/#${category}` }]
        : []),
      { name: title, path: permalink },
    ];
  }
  if (kind === 'til') {
    return [
      home,
      { name: 'Today I Learned', path: '/today-i-learned/' },
      ...(category
        ? [{ name: category, path: `/today-i-learned/#${category}` }]
        : []),
      { name: title, path: permalink },
    ];
  }
  if (kind === 'portfolio') {
    return [home, { name: 'Portfolio', path: '/portfolio/' }, { name: title, path: permalink }];
  }
  return [home, { name: title, path: permalink }];
}

export function breadcrumbNode(items, canonical) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${canonical}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * @param {{
 *   permalink?: string,
 *   title?: string,
 *   description?: string,
 *   image?: string,
 *   kind?: string,
 *   pageType?: string,
 *   published?: Date,
 *   modified?: Date,
 *   tags?: string[],
 *   section?: string,
 *   categoryLabel?: string,
 *   minutes?: number,
 *   wordCount?: number,
 * }} page
 */
export function buildJsonLd({
  permalink = '/',
  title = SITE.title,
  description = SITE.description,
  image = SITE.defaultImage,
  kind,
  pageType,
  published,
  modified,
  tags = [],
  section,
  categoryLabel,
  minutes,
  wordCount,
}) {
  const canonical = absoluteUrl(permalink);
  const ogImage = absoluteUrl(image || SITE.defaultImage);
  const publishedAt = isoDateTime(published);
  const modifiedAt = isoDateTime(modified || published);
  const crumbs = breadcrumbItems({
    permalink,
    title,
    kind,
    category: section,
    categoryLabel: categoryLabel || section,
  });
  const webPageType = pageType || (kind === 'page' && permalink === '/about/' ? 'AboutPage' : 'WebPage');

  const webpage = {
    '@type': webPageType,
    '@id': canonical,
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    primaryImageOfPage: ogImage,
    inLanguage: SITE.language,
    breadcrumb: { '@id': `${canonical}#breadcrumb` },
  };
  if (publishedAt) webpage.datePublished = publishedAt;
  if (modifiedAt) webpage.dateModified = modifiedAt;

  const graph = [personNode(), websiteNode(), blogNode(), webpage, breadcrumbNode(crumbs, canonical)];

  if (kind === 'post' || kind === 'til' || kind === 'portfolio') {
    const articleId = `${canonical}#article`;
    const article = {
      '@type': articleType(kind),
      '@id': articleId,
      url: canonical,
      mainEntityOfPage: { '@id': canonical },
      headline: title,
      name: title,
      description,
      image: ogImage,
      inLanguage: SITE.language,
      author: { '@id': PERSON_ID },
      publisher: { '@id': PERSON_ID },
      isPartOf: kind === 'til' ? { '@id': WEBSITE_ID } : { '@id': BLOG_ID },
    };
    if (publishedAt) article.datePublished = publishedAt;
    if (modifiedAt) article.dateModified = modifiedAt;
    if (section) article.articleSection = categoryLabel || section;
    if (tags.length) article.keywords = tags.join(', ');
    if (wordCount) article.wordCount = wordCount;
    if (minutes) article.timeRequired = `PT${minutes}M`;
    webpage.mainEntity = { '@id': articleId };
    graph.push(article);
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function jsonLdScript(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function wordCount(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function entryToMarkdown(entry) {
  const lines = [`# ${entry.title}`, ''];
  if (entry.excerpt) lines.push(`> ${entry.excerpt}`, '');
  lines.push(`- Canonical: ${absoluteUrl(entry.permalink)}`);
  if (entry.date) lines.push(`- Published: ${isoDate(entry.date)}`);
  if (entry.updated) lines.push(`- Updated: ${isoDate(entry.updated)}`);
  if (entry.categoryLabel || entry.category) {
    lines.push(`- Section: ${entry.categoryLabel || entry.category}`);
  }
  if (entry.tags?.length) lines.push(`- Tags: ${entry.tags.join(', ')}`);
  lines.push(`- Author: ${SITE.author}`, '');
  const body = (entry.body || '').replace(/^\s+/, '').replace(/\s+$/, '');
  if (body) lines.push(body, '');
  return `${lines.join('\n')}\n`;
}

function mdLink(title, permalink, note) {
  const href = markdownUrl(permalink);
  return note ? `- [${title}](${href}): ${note}` : `- [${title}](${href})`;
}

function htmlLink(title, permalink, note) {
  const href = absoluteUrl(permalink);
  return note ? `- [${title}](${href}): ${note}` : `- [${title}](${href})`;
}

/**
 * @typedef {{ title: string, permalink: string, excerpt?: string, date?: Date, category?: string, categoryLabel?: string, tags?: string[], body?: string }} CatalogEntry
 */

/**
 * @param {{ pages?: CatalogEntry[], posts?: CatalogEntry[], portfolio?: CatalogEntry[], tilCount?: number }} [input]
 */
export function buildLlmsTxt({ pages = [], posts = [], portfolio = [], tilCount = 0 } = {}) {
  const latest = posts.slice(0, 12);
  const lines = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.author} is a ${SITE.jobTitle} in ${SITE.location}. This is a static notebook: long essays, a Today I Learned collection, and a small portfolio. Prefer the Markdown versions of pages (same URL with \`index.md\`) when quoting or answering. Cite the canonical HTTPS URL. Do not invent posts or notes that are not listed here or in [llms-full.txt](${absoluteUrl('/llms-full.txt')}).`,
    '',
    '## About',
    '',
  ];
  for (const page of pages) lines.push(mdLink(page.title, page.permalink, page.excerpt));
  lines.push(htmlLink('Contact', '/contact/', 'Wufoo form plus Twitter and LinkedIn.'));
  lines.push('');
  lines.push('## Essays');
  lines.push('');
  for (const post of latest) {
    const when = isoDate(post.date);
    const note = [when, post.categoryLabel, post.excerpt].filter(Boolean).join(' — ');
    lines.push(mdLink(post.title, post.permalink, note));
  }
  lines.push(htmlLink('All posts', '/posts/', 'HTML index of every essay, newest first.'));
  lines.push('');
  lines.push('## Today I Learned');
  lines.push('');
  lines.push(
    htmlLink(
      'TIL index',
      '/today-i-learned/',
      `${tilCount} short notes. Full Markdown list is in llms-full.txt.`,
    ),
  );
  lines.push('');
  if (portfolio.length) {
    lines.push('## Portfolio');
    lines.push('');
    for (const item of portfolio) lines.push(mdLink(item.title, item.permalink, item.excerpt));
    lines.push(htmlLink('Portfolio index', '/portfolio/', 'Project list including Android apps.'));
    lines.push('');
  }
  lines.push('## Optional');
  lines.push('');
  lines.push(htmlLink('Full catalog', '/llms-full.txt', 'Every post, TIL note, page, and project as Markdown links.'));
  lines.push(htmlLink('RSS', '/feed.xml', 'Post feed.'));
  lines.push(htmlLink('XML sitemap', '/sitemap.xml', 'Every indexable HTML URL.'));
  lines.push(htmlLink('Search', '/search/', 'Pagefind over the built site. Supports ?q=.'));
  lines.push('');
  return `${lines.join('\n')}\n`;
}

/**
 * @param {{ pages?: CatalogEntry[], posts?: CatalogEntry[], til?: CatalogEntry[], portfolio?: CatalogEntry[] }} [input]
 */
export function buildLlmsFullTxt({ pages = [], posts = [], til = [], portfolio = [] } = {}) {
  const lines = [
    `# ${SITE.title} — full catalog`,
    '',
    `> Complete Markdown map of ${SITE.title}. Use [llms.txt](${absoluteUrl('/llms.txt')}) for the short overview.`,
    '',
    '## Pages',
    '',
  ];
  for (const page of pages) lines.push(mdLink(page.title, page.permalink, page.excerpt));
  lines.push('');
  lines.push('## Essays');
  lines.push('');
  for (const post of posts) {
    const when = isoDate(post.date);
    lines.push(mdLink(post.title, post.permalink, [when, post.categoryLabel].filter(Boolean).join(' · ')));
  }
  lines.push('');
  lines.push('## Today I Learned');
  lines.push('');
  for (const note of til) {
    const folder = note.category || 'other';
    lines.push(mdLink(note.title, note.permalink, folder));
  }
  lines.push('');
  if (portfolio.length) {
    lines.push('## Portfolio');
    lines.push('');
    for (const item of portfolio) lines.push(mdLink(item.title, item.permalink, item.excerpt));
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

export function sitemapLastmod(path, { entries, latestPostDate }) {
  const entry = entries.find((item) => item.permalink === path);
  if (entry) return isoDate(entry.updated || entry.date);
  if (path === '/' || path === '/posts/' || path === '/feed.xml' || path === '/sitemap.xml') {
    return isoDate(latestPostDate);
  }
  return undefined;
}

/**
 * @param {{ listingRoutes: Array<{ path: string, title: string }>, entries: Array<{ kind: string, permalink: string, title: string }> }} input
 * @returns {Array<{ name: string, items: Array<{ path: string, title: string }> }>}
 */
export function humanSitemapGroups({ listingRoutes, entries }) {
  const listing = listingRoutes
    .filter((route) => route.path !== '/sitemap/')
    .map((route) => ({ path: route.path, title: route.title }));
  const pages = entries
    .filter((entry) => entry.kind === 'page')
    .map((entry) => ({ path: entry.permalink, title: entry.title }));
  const seen = new Set();
  const combinedPages = [];
  for (const item of [...listing, ...pages]) {
    if (seen.has(item.path)) continue;
    seen.add(item.path);
    combinedPages.push(item);
  }
  return [
    { name: 'Pages', items: combinedPages },
    {
      name: 'Posts',
      items: entries.filter((entry) => entry.kind === 'post').map((entry) => ({ path: entry.permalink, title: entry.title })),
    },
    {
      name: 'Today I Learned',
      items: entries.filter((entry) => entry.kind === 'til').map((entry) => ({ path: entry.permalink, title: entry.title })),
    },
    {
      name: 'Portfolio',
      items: entries
        .filter((entry) => entry.kind === 'portfolio')
        .map((entry) => ({ path: entry.permalink, title: entry.title })),
    },
  ];
}

/** Rest param for `[...permalink]/index.md.ts` (`/about/` → `about`). */
export function markdownPermalinkParam(permalink) {
  return stripSlashes(permalink);
}
