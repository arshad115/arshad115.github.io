import { getPages, getPortfolio, getPosts, getTilNotes } from '../lib/content';
import { buildLlmsTxt } from '../lib/seo.mjs';

export async function GET() {
  const [pages, posts, til, portfolio] = await Promise.all([
    getPages(),
    getPosts(),
    getTilNotes(),
    getPortfolio(),
  ]);
  const body = buildLlmsTxt({
    pages,
    posts,
    portfolio,
    tilCount: til.length,
  });
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
