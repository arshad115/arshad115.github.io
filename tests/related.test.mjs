import assert from 'node:assert/strict';
import { test } from 'node:test';
import { linkedPermalinks, relatedHeading, relatedPosts } from '../src/lib/related.mjs';

test('linkedPermalinks keeps on-site markdown targets and skips images', () => {
  const hrefs = linkedPermalinks(`
![teaser](/assets/images/foo.png)
See [basics](/today-i-learned/ssh/ssh-connection-basics/) and
[this post](https://arshadmehmood.com/devops/devops-journey/).
External [Medium](https://medium.com/x) stays out.
`);
  assert.deepEqual(hrefs, [
    '/today-i-learned/ssh/ssh-connection-basics/',
    '/devops/devops-journey/',
  ]);
});

test('relatedPosts prefers markdown links, then same category, never tags', () => {
  const catalog = [
    { permalink: '/personal/a/', category: 'personal', kind: 'post', tags: ['ssh'] },
    { permalink: '/personal/b/', category: 'personal', kind: 'post', tags: ['ssh'] },
    { permalink: '/today-i-learned/ssh/ssh-connection-basics/', category: 'ssh', kind: 'til', tags: ['ssh'] },
    { permalink: '/devops/unrelated/', category: 'devops', kind: 'post', tags: ['ssh'] },
  ];
  const post = {
    permalink: '/tutorial/ssh-guide/',
    category: 'tutorial',
    kind: 'post',
    body: 'See [basics](/today-i-learned/ssh/ssh-connection-basics/).',
  };
  const related = relatedPosts(post, catalog, 3);
  assert.equal(related[0].permalink, '/today-i-learned/ssh/ssh-connection-basics/');
  assert.equal(
    related.some((item) => item.permalink === '/devops/unrelated/'),
    false,
  );
});

test('relatedHeading switches to Related when neighbors leave the category', () => {
  assert.equal(
    relatedHeading(
      { kind: 'post', category: 'tutorial', categoryLabel: 'Tutorial' },
      [{ kind: 'til', category: 'ssh' }],
    ),
    'Related',
  );
  assert.equal(
    relatedHeading(
      { kind: 'post', category: 'personal', categoryLabel: 'Personal' },
      [{ kind: 'post', category: 'personal' }],
    ),
    'More in Personal',
  );
});
