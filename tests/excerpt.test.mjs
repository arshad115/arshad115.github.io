import assert from 'node:assert/strict';
import { test } from 'node:test';
import { excerptFromBody } from '../src/lib/site.ts';

test('excerpts skip a leading series note and do not keep link targets', () => {
  const body = [
    '_**Note** This post is part of the [DevOps Journey](/software/devops-journey/)_',
    '',
    'To monitor Jenkins with Prometheus, we need to expose Jenkins metrics.',
  ].join('\n');
  const excerpt = excerptFromBody(body);
  assert.match(excerpt, /^To monitor Jenkins with Prometheus/);
  assert.doesNotMatch(excerpt, /\/software\/|\[|\]/);
});

test('excerpts drop markdown destinations that contain parentheses', () => {
  const body =
    'You may be familiar with the [onUpgrade(SQLiteDatabase, int, int)](<https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper.html#onUpgrade(android.database.sqlite.SQLiteDatabase, int, int)>) method.';
  const excerpt = excerptFromBody(body);
  assert.match(excerpt, /onUpgrade\(SQLiteDatabase, int, int\) method/);
  assert.doesNotMatch(excerpt, /https?:/);
});
