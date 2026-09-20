import assert from 'node:assert/strict';
import { test } from 'node:test';
import { astroRedirects, caseAliasRedirects, legacyUrlRedirects } from '../scripts/legacy-url-redirects.mjs';
import {
  categorySlug,
  filenameSlug,
  postPermalink,
  tilPermalink,
  withTrailingSlash,
} from '../src/lib/paths.mjs';

test('post permalinks follow the filename slug and lowercased category', () => {
  assert.equal(
    postPermalink('Personal', '2018-06-11-the-most-fulfilling-2-i-made-and-my-android-developer-journey'),
    '/personal/the-most-fulfilling-2-i-made-and-my-android-developer-journey/',
  );
  assert.equal(
    postPermalink(
      'Tutorial',
      '2018-07-12-how-to-use-gitlab-after-enabling-two-factor-authentication-2fa',
    ),
    '/tutorial/how-to-use-gitlab-after-enabling-two-factor-authentication-2fa/',
  );
});

test('filenameSlug does not auto-pretty punctuation; that is a file rename plus redirect', () => {
  assert.equal(
    filenameSlug('2018-06-11-the-most-fulfilling-$2-I-made-and-my-android-developer-journey'),
    'the-most-fulfilling-$2-I-made-and-my-android-developer-journey',
  );
});

test('filenameSlug strips only the date prefix', () => {
  assert.equal(filenameSlug('2026-09-17-introducing-vault-linker'), 'introducing-vault-linker');
  assert.equal(filenameSlug('git/delete-local-branch'), 'git/delete-local-branch');
});

test('categorySlug lowercases without pretty-slugging punctuation', () => {
  assert.equal(categorySlug('DevOps'), 'devops');
  assert.equal(categorySlug('Development'), 'development');
});

test('TIL permalinks are category/slug under /today-i-learned/', () => {
  assert.equal(tilPermalink('git/delete-local-branch'), '/today-i-learned/git/delete-local-branch/');
  assert.equal(withTrailingSlash('/feed.xml'), '/feed.xml');
});

test('live Jekyll garbage URLs redirect to cleaned slugs, which are not themselves aliases', () => {
  assert.equal(
    legacyUrlRedirects['/personal/the-most-fulfilling-$2-I-made-and-my-android-developer-journey/'],
    '/personal/the-most-fulfilling-2-i-made-and-my-android-developer-journey/',
  );
  assert.equal(
    legacyUrlRedirects['/tutorial/how-to-use-gitlab-after-enabling-Two-Factor-Authentication-(2FA)/'],
    '/tutorial/how-to-use-gitlab-after-enabling-two-factor-authentication-2fa/',
  );
  assert.equal(
    legacyUrlRedirects['/personal/the-most-fulfilling-2-i-made-and-my-android-developer-journey/'],
    undefined,
  );
  assert.equal(
    legacyUrlRedirects['/personal/what-I-learnt-from-my-failed-incubator/'],
    '/personal/what-i-learnt-from-my-failed-incubator/',
  );
  assert.equal(legacyUrlRedirects['/personal/what-i-learnt-from-my-failed-incubator/'], undefined);
});

test('case-only aliases stay out of Astro redirects so they cannot overwrite the page', () => {
  assert.equal(astroRedirects['/personal/what-I-learnt-from-my-failed-incubator/'], undefined);
  assert.equal(
    caseAliasRedirects['/personal/what-I-learnt-from-my-failed-incubator/'],
    '/personal/what-i-learnt-from-my-failed-incubator/',
  );
});
