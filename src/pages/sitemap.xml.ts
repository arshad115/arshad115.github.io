import { getPosts, getRenderableEntries, listingRoutes } from '../lib/content';
import { absoluteUrl, sitemapLastmod } from '../lib/seo.mjs';

export async function GET() {
  const [entries, posts] = await Promise.all([getRenderableEntries(), getPosts()]);
  const latestPostDate = posts[0]?.date;
  const urls = [
    ...listingRoutes.map((route) => route.path),
    ...entries.map((entry) => entry.permalink),
    '/feed.xml',
    '/llms.txt',
    '/llms-full.txt',
  ];
  const unique = [...new Set(urls)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map((path) => {
    const lastmod = sitemapLastmod(path, { entries, latestPostDate });
    const lastmodXml = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${absoluteUrl(path)}</loc>${lastmodXml}
  </url>`;
  })
  .join('\n')}
</urlset>
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
