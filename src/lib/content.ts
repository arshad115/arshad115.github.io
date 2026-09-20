import { getCollection, type CollectionEntry } from 'astro:content';
import { rewriteJekyllMarkdown } from './jekyll';
import {
  asList,
  categorySlug,
  excerptFromBody,
  filenameDate,
  filenameSlug,
  firstHeading,
  readingMinutes,
  tagSlug,
  titleFromSlug,
  withTrailingSlash,
} from './site';

export type EntryKind = 'post' | 'page' | 'til' | 'portfolio';

export type SiteEntry = {
  kind: EntryKind;
  id: string;
  permalink: string;
  title: string;
  excerpt: string;
  category?: string;
  categoryPath?: string;
  tags: string[];
  date?: Date;
  updated?: Date;
  header?: { image?: string; teaser?: string; caption?: string };
  comments: boolean;
  showToc: boolean;
  minutes: number;
  collection:
    | CollectionEntry<'posts'>
    | CollectionEntry<'pages'>
    | CollectionEntry<'til'>
    | CollectionEntry<'portfolio'>;
};

function headerOf(data: { header?: { image?: string; teaser?: string; caption?: string } }) {
  if (!data.header) return undefined;
  return {
    image: data.header.image,
    teaser: data.header.teaser,
    caption: data.header.caption,
  };
}

function bodyOf(entry: { body?: string }): string {
  return rewriteJekyllMarkdown(entry.body ?? '');
}

function categoryOf(data: { category?: unknown; categories?: unknown }): string | undefined {
  const list = [...asList(data.category), ...asList(data.categories)];
  return list[0];
}

export function fromPost(entry: CollectionEntry<'posts'>): SiteEntry {
  const data = entry.data;
  const id = entry.id;
  const category = categoryOf(data) || 'software';
  const slug = filenameSlug(id);
  const dateValue = data.date ?? (filenameDate(id) ? new Date(`${filenameDate(id)}T00:00:00Z`) : undefined);
  const body = bodyOf(entry);
  return {
    kind: 'post',
    id,
    permalink: withTrailingSlash(`/${categorySlug(category)}/${slug}`),
    title: data.title || titleFromSlug(id),
    excerpt: data.excerpt || data.description || excerptFromBody(body),
    category,
    categoryPath: `/categories/#${categorySlug(category)}`,
    tags: asList(data.tags),
    date: dateValue,
    updated: data.last_modified_at,
    header: headerOf(data),
    comments: data.comments !== false,
    showToc: data.toc !== false,
    minutes: readingMinutes(body),
    collection: entry,
  };
}

export function fromPage(entry: CollectionEntry<'pages'>): SiteEntry {
  const data = entry.data;
  const permalink = withTrailingSlash(data.permalink || `/${entry.id}/`);
  const body = bodyOf(entry);
  return {
    kind: 'page',
    id: entry.id,
    permalink,
    title: data.title || titleFromSlug(entry.id),
    excerpt: data.excerpt || data.description || excerptFromBody(body),
    date: data.date ?? data.last_modified_at,
    updated: data.last_modified_at,
    header: headerOf(data),
    comments: false,
    showToc: Boolean(data.toc),
    minutes: readingMinutes(body),
    tags: asList(data.tags),
    collection: entry,
  };
}

export function fromTil(entry: CollectionEntry<'til'>): SiteEntry {
  const data = entry.data;
  const [folder, ...rest] = entry.id.split('/');
  const slug = rest.join('/') || entry.id;
  const body = bodyOf(entry);
  return {
    kind: 'til',
    id: entry.id,
    permalink: withTrailingSlash(`/today-i-learned/${entry.id}`),
    title: data.title || firstHeading(body) || titleFromSlug(slug),
    excerpt: data.excerpt || data.description || excerptFromBody(body),
    category: folder,
    categoryPath: `/today-i-learned/#${categorySlug(folder)}`,
    tags: asList(data.tags),
    date: data.date,
    updated: data.last_modified_at,
    header: headerOf(data),
    comments: false,
    showToc: Boolean(data.toc),
    minutes: readingMinutes(body),
    collection: entry,
  };
}

export function fromPortfolio(entry: CollectionEntry<'portfolio'>): SiteEntry {
  const data = entry.data;
  const body = bodyOf(entry);
  return {
    kind: 'portfolio',
    id: entry.id,
    permalink: withTrailingSlash(`/portfolio/${entry.id}`),
    title: data.title || titleFromSlug(entry.id),
    excerpt: data.excerpt || data.description || excerptFromBody(body),
    date: data.date,
    updated: data.last_modified_at,
    header: headerOf(data),
    comments: false,
    showToc: Boolean(data.toc),
    minutes: readingMinutes(body),
    tags: asList(data.tags),
    collection: entry,
  };
}

export async function getPosts(): Promise<SiteEntry[]> {
  const entries = await getCollection('posts');
  return entries
    .map(fromPost)
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
}

export async function getPages(): Promise<SiteEntry[]> {
  return (await getCollection('pages')).map(fromPage);
}

export async function getTilNotes(): Promise<SiteEntry[]> {
  const entries = await getCollection('til');
  return entries
    .map(fromTil)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getPortfolio(): Promise<SiteEntry[]> {
  return (await getCollection('portfolio')).map(fromPortfolio);
}

export async function getRenderableEntries(): Promise<SiteEntry[]> {
  const [posts, pages, til, portfolio] = await Promise.all([
    getPosts(),
    getPages(),
    getTilNotes(),
    getPortfolio(),
  ]);
  return [...posts, ...pages, ...til, ...portfolio];
}

export function groupByCategory(entries: SiteEntry[]): Array<{ name: string; slug: string; items: SiteEntry[] }> {
  const map = new Map<string, SiteEntry[]>();
  for (const entry of entries) {
    const name = entry.category || 'Other';
    const list = map.get(name) || [];
    list.push(entry);
    map.set(name, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, items]) => ({ name, slug: categorySlug(name), items }));
}

export function groupByTag(entries: SiteEntry[]): Array<{ name: string; slug: string; items: SiteEntry[] }> {
  const map = new Map<string, SiteEntry[]>();
  for (const entry of entries) {
    for (const tag of entry.tags) {
      const list = map.get(tag) || [];
      list.push(entry);
      map.set(tag, list);
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, items]) => ({ name, slug: tagSlug(name), items }));
}

export function relatedPosts(post: SiteEntry, all: SiteEntry[], limit = 3): SiteEntry[] {
  return all
    .filter((item) => item.permalink !== post.permalink && item.category && item.category === post.category)
    .slice(0, limit);
}

export const listingRoutes = [
  { path: '/', title: 'Home' },
  { path: '/posts/', title: 'All Posts' },
  { path: '/today-i-learned/', title: 'Today I Learned' },
  { path: '/portfolio/', title: 'Portfolio' },
  { path: '/categories/', title: 'Categories' },
  { path: '/tags/', title: 'Tags' },
  { path: '/contact/', title: 'Contact' },
  { path: '/newsletter/', title: 'Newsletter' },
  { path: '/search/', title: 'Search' },
  { path: '/sitemap/', title: 'Sitemap' },
];
