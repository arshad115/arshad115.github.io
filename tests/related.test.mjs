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

test('relatedPosts prefers markdown links and fills remaining slots from the same category', () => {
  const catalog = [
    { permalink: '/tutorial/sibling/', category: 'tutorial', kind: 'post', tags: ['ssh'] },
    { permalink: '/personal/a/', category: 'personal', kind: 'post', tags: ['ssh'] },
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
  assert.deepEqual(related.map((item) => item.permalink), [
    '/today-i-learned/ssh/ssh-connection-basics/',
    '/tutorial/sibling/',
  ]);
});

test('relatedPosts provides deterministic same-category fallback without tag matching', () => {
  const catalog = [
    { permalink: '/devops/newer/', category: 'devops', kind: 'post', tags: [] },
    { permalink: '/devops/current/', category: 'devops', kind: 'post', tags: [] },
    { permalink: '/devops/older/', category: 'devops', kind: 'post', tags: [] },
    { permalink: '/personal/tag-match/', category: 'personal', kind: 'post', tags: ['ssh'] },
  ];
  const post = {
    permalink: '/devops/current/',
    category: 'devops',
    kind: 'post',
    tags: ['ssh'],
    body: '',
  };

  assert.deepEqual(
    relatedPosts(post, catalog, 2).map((item) => item.permalink),
    ['/devops/newer/', '/devops/older/'],
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
