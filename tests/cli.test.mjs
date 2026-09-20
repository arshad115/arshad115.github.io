import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const newPost = path.join(root, 'scripts/new-post.sh');
const newTil = path.join(root, 'scripts/new-til.sh');

function makeBlogRoot() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-scaffold-'));
  fs.mkdirSync(path.join(dir, 'content/posts'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'content/drafts'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'today-i-learned/git'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'today-i-learned/git/.keep'), '');
  return dir;
}

function run(script, args, blogRoot, cwd = os.tmpdir()) {
  return spawnSync('bash', [script, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, BLOG_ROOT: blogRoot },
  });
}

test('new-post.sh is executable and scaffolds a dated post from any cwd', () => {
  const mode = fs.statSync(newPost).mode;
  assert.ok(mode & 0o111, 'scripts/new-post.sh should be executable');

  const blogRoot = makeBlogRoot();
  const result = run(
    newPost,
    ['CLI smoke post', '--category', 'Development', '--tags', 'go,cli', '--date', '2026-09-20'],
    blogRoot,
  );
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const file = path.join(blogRoot, 'content/posts/2026-09-20-cli-smoke-post.md');
  const body = fs.readFileSync(file, 'utf8');
  assert.match(body, /title: CLI smoke post/);
  assert.match(body, /category: development/);
  assert.match(body, /  - go/);
  assert.match(result.stdout, /\/development\/cli-smoke-post\//);
});

test('new-post.sh rejects unknown categories', () => {
  const blogRoot = makeBlogRoot();
  const result = run(newPost, ['Nope', '--category', 'not-a-bucket', '--date', '2026-09-20'], blogRoot);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown category/);
});

test('new-post.sh --draft writes under content/drafts', () => {
  const blogRoot = makeBlogRoot();
  const result = run(newPost, ['Draft smoke', '--draft', '--date', '2026-09-20'], blogRoot);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.ok(fs.existsSync(path.join(blogRoot, 'content/drafts/2026-09-20-draft-smoke.md')));
  assert.equal(fs.existsSync(path.join(blogRoot, 'content/posts/2026-09-20-draft-smoke.md')), false);
});

test('new-til.sh scaffolds a YAML title and no body H1', () => {
  const mode = fs.statSync(newTil).mode;
  assert.ok(mode & 0o111, 'scripts/new-til.sh should be executable');

  const blogRoot = makeBlogRoot();
  const result = run(newTil, ['Rebase vs merge', 'git', '--body', 'Prefer merge for shared branches.'], blogRoot);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const file = path.join(blogRoot, 'today-i-learned/git/rebase-vs-merge.md');
  const body = fs.readFileSync(file, 'utf8');
  assert.match(body, /^---\ntitle: Rebase vs merge\n---\n/);
  assert.doesNotMatch(body, /^# /m);
  assert.match(body, /Prefer merge for shared branches/);
  assert.match(result.stdout, /\/today-i-learned\/git\/rebase-vs-merge\//);
});

test('update-submodule.sh stays on the pin unless --remote is passed', () => {
  const script = fs.readFileSync(path.join(root, 'scripts/update-submodule.sh'), 'utf8');
  assert.match(script, /Usage:.*\[--remote\]/);
  assert.match(script, /if \[\[ "\$remote" -eq 1 \]\]/);
  assert.match(script, /git submodule update --remote today-i-learned/);
  const defaultBody = script.replace(/if \[\[ "\$remote" -eq 1 \]\][\s\S]*?fi/g, '');
  assert.doesNotMatch(defaultBody, /--remote today-i-learned/);
});

test('verify runs astro check between unit tests and the build', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.verify, 'npm test && npm run check && npm run build && npm run test:site');
});
