import { getPages, getPortfolio, getPosts, getTilNotes } from '../lib/content';
import { buildLlmsFullTxt } from '../lib/seo.mjs';

export async function GET() {
  const [pages, posts, til, portfolio] = await Promise.all([
    getPages(),
    getPosts(),
    getTilNotes(),
    getPortfolio(),
  ]);
  const body = buildLlmsFullTxt({ pages, posts, til, portfolio });
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
