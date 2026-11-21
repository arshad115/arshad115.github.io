import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import { getPosts } from '../lib/content';
import { SITE } from '../lib/site';

export async function GET() {
  const container = await AstroContainer.create();
  const items = [];
  for (const post of await getPosts()) {
    const link = new URL(post.permalink, SITE.url).href;
    const { Content } = await render(post.collection);
    const content = sanitizeHtml(await container.renderToString(Content), {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
      allowedAttributes: { a: ['href'], img: ['src', 'alt', 'width', 'height'] },
      transformTags: {
        '*': (tagName, attribs) => {
          for (const key of ['href', 'src']) {
            if (attribs[key]) {
              try { attribs[key] = new URL(attribs[key], link).href; }
              catch { delete attribs[key]; }
            }
          }
          return { tagName, attribs };
        },
      },
    });
    items.push({
      title: post.title,
      description: post.excerpt,
      link,
      pubDate: post.date,
      content,
      customData: `<guid isPermaLink="false">${link.replace(/\/$/, '')}</guid>`,
    });
  }
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: SITE.url,
    items,
    customData: `<language>${SITE.language}</language>`,
  });
}
