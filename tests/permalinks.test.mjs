import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertUniquePermalinks, isPublishedData } from '../src/lib/permalinks.mjs';
import { listingRoutes } from '../src/lib/routes.mjs';

test('isPublishedData treats draft: true as unpublished', () => {
  assert.equal(isPublishedData({}), true);
  assert.equal(isPublishedData({ draft: false }), true);
  assert.equal(isPublishedData({ draft: true }), false);
});

test('assertUniquePermalinks allows distinct collection paths', () => {
  assertUniquePermalinks([
    { kind: 'post', id: 'a', permalink: '/personal/hello-world/' },
    { kind: 'page', id: 'about', permalink: '/about/' },
  ]);
});

test('assertUniquePermalinks fails when two entries share a path', () => {
  assert.throws(
    () =>
      assertUniquePermalinks([
        { kind: 'post', id: 'one', permalink: '/personal/hello/' },
        { kind: 'til', id: 'two', permalink: '/personal/hello/' },
      ]),
    /Duplicate permalinks/,
  );
});

test('assertUniquePermalinks fails when a page collides with a listing route', () => {
  assert.throws(
    () =>
      assertUniquePermalinks([{ kind: 'page', id: 'posts', permalink: '/posts/' }], listingRoutes),
    /listing:\/posts\//,
  );
});
