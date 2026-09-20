import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  assertSafeSegment,
  buildPostMarkdown,
  buildTilMarkdown,
  parseArgs,
  parseTags,
  slugify,
  todayLocal,
  writeNewFile,
  yamlScalar,
} from '../scripts/lib/scaffold.mjs';

test('slugify lowercases and strips punctuation', () => {
  assert.equal(slugify('Git Rebase vs Merge'), 'git-rebase-vs-merge');
  assert.equal(slugify('  Hello, World!  '), 'hello-world');
  assert.equal(slugify('Two-Factor Authentication (2FA)'), 'two-factor-authentication-2fa');
});

test('todayLocal is YYYY-MM-DD in local time', () => {
  assert.match(todayLocal(new Date(2026, 8, 20)), /^2026-09-20$/);
});

test('yamlScalar quotes values that would break YAML', () => {
  assert.equal(yamlScalar('Development'), 'Development');
  assert.equal(yamlScalar('Hello: world'), '"Hello: world"');
  assert.equal(yamlScalar('yes'), '"yes"');
});

test('parseArgs collects positionals and flags', () => {
  const flags = parseArgs(['Title', 'git', '--template', '--body', 'note', '--force']);
  assert.deepEqual(flags._, ['Title', 'git']);
  assert.equal(flags.template, true);
  assert.equal(flags.body, 'note');
  assert.equal(flags.force, true);
});

test('parseTags splits on commas', () => {
  assert.deepEqual(parseTags('go, cli,  '), ['go', 'cli']);
});

test('buildPostMarkdown writes the collection schema', () => {
  const md = buildPostMarkdown({
    title: 'Hello',
    excerpt: 'A note',
    date: '2026-09-20',
    category: 'development',
    tags: ['go'],
    headerImage: '/assets/images/posts/x.jpg',
  });
  assert.match(md, /^---\n/);
  assert.match(md, /title: Hello\n/);
  assert.match(md, /category: development\n/);
  assert.match(md, /  - go\n/);
  assert.match(md, /image: \/assets\/images\/posts\/x.jpg\n/);
  assert.match(md, /alt: Hello\n/);
});

test('buildTilMarkdown writes a YAML title and no body H1', () => {
  assert.equal(buildTilMarkdown({ title: 'Rebase' }), '---\ntitle: Rebase\n---\n\n');
  assert.match(buildTilMarkdown({ title: 'Rebase', template: true }), /^---\ntitle: Rebase\n---\n/);
  assert.doesNotMatch(buildTilMarkdown({ title: 'Rebase', template: true }), /^# /m);
  assert.equal(
    buildTilMarkdown({ title: 'Rebase', body: 'Use -i carefully.' }),
    '---\ntitle: Rebase\n---\n\nUse -i carefully.\n',
  );
});

test('writeNewFile refuses to clobber unless forced', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-'));
  const file = path.join(dir, 'note.md');
  writeNewFile(file, 'one\n');
  assert.throws(() => writeNewFile(file, 'two\n'), /already exists/);
  writeNewFile(file, 'two\n', { force: true });
  assert.equal(fs.readFileSync(file, 'utf8'), 'two\n');
});

test('assertSafeSegment rejects path traversal', () => {
  assert.throws(() => assertSafeSegment('../x', 'category'), /single path segment/);
  assert.doesNotThrow(() => assertSafeSegment('git', 'category'));
});
