import rss from '@astrojs/rss';
import siteData from '../generated/site-data.json';

export function GET(context) {
  const items = [...siteData.posts]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .map((post) => ({
      title: post.title,
      description: post.excerpt,
      link: post.url,
      pubDate: new Date(post.pubDate),
    }));

  return rss({
    title: 'Arshad Mehmood',
    description: 'Software engineering notes, tutorials, and learning in public.',
    site: context.site,
    items,
  });
}
