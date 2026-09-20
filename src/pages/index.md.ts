import { getPosts } from '../lib/content';
import { SITE } from '../lib/site';
import { absoluteUrl, isoDate, markdownUrl } from '../lib/seo.mjs';

export async function GET() {
  const posts = await getPosts();
  const latest = posts.slice(0, 12);
  const lines = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.author} is a ${SITE.jobTitle} in ${SITE.location}. Canonical HTML: ${absoluteUrl('/')}.`,
    '',
    '## Latest essays',
    '',
    ...latest.map((post) => {
      const when = isoDate(post.date);
      const note = [when, post.categoryLabel].filter(Boolean).join(' · ');
      return `- [${post.title}](${markdownUrl(post.permalink)})${note ? `: ${note}` : ''}`;
    }),
    '',
    `- [All posts](${absoluteUrl('/posts/')})`,
    `- [Today I Learned](${absoluteUrl('/today-i-learned/')})`,
    `- [About](${markdownUrl('/about/')})`,
    `- [LLM map](${absoluteUrl('/llms.txt')})`,
    '',
  ];
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
