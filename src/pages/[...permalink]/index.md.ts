import { getRenderableEntries } from '../../lib/content';
import { entryToMarkdown, markdownPermalinkParam } from '../../lib/seo.mjs';

export async function getStaticPaths() {
  const entries = await getRenderableEntries();
  return entries.map((entry) => ({
    params: { permalink: markdownPermalinkParam(entry.permalink) },
    props: { markdown: entryToMarkdown(entry) },
  }));
}

export function GET({ props }: { props: { markdown: string } }) {
  return new Response(props.markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
