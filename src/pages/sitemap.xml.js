import { getRenderableEntries, listingRoutes } from '../lib/content';
import { absoluteUrl } from '../lib/site';

export async function GET() {
  const entries = await getRenderableEntries();
  const urls = [
    ...listingRoutes.map((route) => route.path),
    ...entries.map((entry) => entry.permalink),
    '/feed.xml',
  ];
  const unique = [...new Set(urls)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${unique
  .map(
    (path) => `  <url>
    <loc>${absoluteUrl(path)}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
