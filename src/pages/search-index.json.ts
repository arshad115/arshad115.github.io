import type { APIRoute } from 'astro';
import { getRenderableEntries, listingRoutes } from '../lib/content';

export const prerender = true;

const plainText = (value = '') => value
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/`([^`]+)`/g, '$1')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[#>*_~|{}[\]]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const GET: APIRoute = async () => {
  const entries = await getRenderableEntries();
  const content = entries.map((entry) => {
    const excerpt = plainText(entry.excerpt).slice(0, 220);
    return {
      title: entry.title,
      permalink: entry.permalink,
      excerpt,
      kind: entry.kind,
      searchText: plainText([
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
