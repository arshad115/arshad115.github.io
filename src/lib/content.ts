import { getCollection, type CollectionEntry } from 'astro:content';
import { rewriteJekyllMarkdown } from './jekyll';
import { assertUniquePermalinks, isPublishedData } from './permalinks.mjs';
import { listingRoutes } from './routes.mjs';
import { relatedPosts } from './related.mjs';
import {
  asList,
  categorySlug,
  excerptFromBody,
  filenameSlug,
  readingMinutes,
  withTrailingSlash,
} from './site';
import { groupByCategoryName, groupByTagName, categoryLabel } from './taxonomy.mjs';

export { listingRoutes, relatedPosts };

export type EntryKind = 'post' | 'page' | 'til' | 'portfolio';

export type SiteEntry = {
  kind: EntryKind;
  id: string;
  permalink: string;
  title: string;
  excerpt: string;
  category?: string;
  categoryLabel?: string;
  categoryPath?: string;
  tags: string[];
  date?: Date;
  updated?: Date;
  header?: { image?: string; alt?: string; caption?: string; captionHref?: string; teaser?: string };
  comments: boolean;
  showToc: boolean;
  minutes: number;
  wordCount: number;
  body: string;
  collection:
    | CollectionEntry<'posts'>
    | CollectionEntry<'pages'>
    | CollectionEntry<'til'>
    | CollectionEntry<'portfolio'>;
};

function headerOf(data: {
  header?: { image?: string; alt?: string; caption?: string; captionHref?: string; teaser?: string };
}) {
  if (!data.header) return undefined;
  return {
    image: data.header.image,
    alt: data.header.alt,
    caption: data.header.caption,
    captionHref: data.header.captionHref,
    teaser: data.header.teaser,
  };
}

function bodyOf(entry: { body?: string }): string {
  return rewriteJekyllMarkdown(entry.body ?? '');
}

export function fromPost(entry: CollectionEntry<'posts'>): SiteEntry {
  const data = entry.data;
  const id = entry.id;
  const category = categorySlug(data.category);
  const slug = filenameSlug(id);
  const body = bodyOf(entry);
  return {
    kind: 'post',
    id,
    permalink: withTrailingSlash(`/${category}/${slug}`),
    title: data.title,
    excerpt: data.excerpt || excerptFromBody(body),
    category,
    categoryLabel: categoryLabel(category),
    categoryPath: `/categories/#${category}`,
    tags: asList(data.tags),
    date: data.date,
    updated: data.last_modified_at,
    header: headerOf(data),
    comments: true,
    showToc: data.toc !== false,
    minutes: readingMinutes(body),
    wordCount: body.trim().split(/\s+/).filter(Boolean).length,
    body,
    collection: entry,
  };
}

export function fromPage(entry: CollectionEntry<'pages'>): SiteEntry {
  const data = entry.data;
  const permalink = withTrailingSlash(data.permalink);
  const body = bodyOf(entry);
  return {
    kind: 'page',
    id: entry.id,
    permalink,
    title: data.title,
    excerpt: data.excerpt || excerptFromBody(body),
    header: headerOf(data),
    comments: false,
    showToc: Boolean(data.toc),
    minutes: readingMinutes(body),
    wordCount: body.trim().split(/\s+/).filter(Boolean).length,
    body,
    tags: [],
    collection: entry,
  };
}

export function fromTil(entry: CollectionEntry<'til'>): SiteEntry {
  const data = entry.data;
  const [folder] = entry.id.split('/');
  const body = bodyOf(entry);
  return {
    kind: 'til',
    id: entry.id,
    permalink: withTrailingSlash(`/today-i-learned/${entry.id}`),
    title: data.title,
    excerpt: data.excerpt || excerptFromBody(body),
    category: folder,
    categoryLabel: folder,
    categoryPath: `/today-i-learned/#${categorySlug(folder)}`,
    tags: asList(data.tags),
    date: data.date,
    comments: false,
    showToc: false,
    minutes: readingMinutes(body),
    wordCount: body.trim().split(/\s+/).filter(Boolean).length,
    body,
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
    title: data.title,
    excerpt: data.excerpt || excerptFromBody(body),
    date: data.date,
    header: headerOf(data),
    comments: false,
    showToc: false,
    minutes: readingMinutes(body),
    wordCount: body.trim().split(/\s+/).filter(Boolean).length,
    body,
    tags: asList(data.tags),
    collection: entry,
  };
}

export async function getPosts(): Promise<SiteEntry[]> {
  const entries = await getCollection('posts', ({ data }) => isPublishedData(data));
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
  const entries = [...posts, ...pages, ...til, ...portfolio];
  assertUniquePermalinks(entries);
  return entries;
}

export function groupByCategory(entries: SiteEntry[]): Array<{ name: string; slug: string; items: SiteEntry[] }> {
  return groupByCategoryName(entries);
}

export function groupByTag(entries: SiteEntry[]): Array<{ name: string; slug: string; items: SiteEntry[] }> {
  return groupByTagName(entries);
}

