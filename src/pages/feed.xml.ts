import rss from '@astrojs/rss';
import { getPosts } from '../lib/content';
import { SITE } from '../lib/site';

export async function GET() {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.url,
    items: posts.map((post) => ({
      title: post.title,
      description: post.excerpt,
      link: post.permalink,
      pubDate: post.date ?? new Date(),
    })),
    customData: `<language>en-us</language>`,
  });
}
