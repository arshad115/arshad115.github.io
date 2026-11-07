import type { APIRoute } from 'astro';
import { getRenderableEntries, listingRoutes } from '../lib/content';
import { searchableText, searchSummary } from '../lib/search-content.mjs';

export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = await getRenderableEntries();
  const content = entries.map((entry) => {
    const excerpt = entry.collection.data.excerpt
      ? searchableText(entry.collection.data.excerpt)
      : searchSummary(entry.body, entry.excerpt);
    return {
      title: entry.title,
      permalink: entry.permalink,
      excerpt,
      kind: entry.kind,
      searchText: searchableText([
        entry.title,
        entry.excerpt,
        entry.categoryLabel,
        ...entry.tags,
        entry.body,
      ].filter(Boolean).join(' ')).toLocaleLowerCase(),
    };
  });
  const listings = listingRoutes
    .filter((route) => route.path !== '/search/')
    .map((route) => ({
      title: route.title,
      permalink: route.path,
      excerpt: '',
      kind: 'listing',
      searchText: route.title.toLocaleLowerCase(),
    }));

  return new Response(JSON.stringify([...listings, ...content]), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
