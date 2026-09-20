import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { categorySlug } from '../src/lib/paths.mjs';
import {
  CATEGORY_SLUGS,
  categoryLabel,
  groupByCategoryName,
  isKnownCategory,
  sameCategory,
} from '../src/lib/taxonomy.mjs';

const postsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../content/posts');

test('YAML category is a lowercase slug; URLs already match', () => {
  const files = fs.readdirSync(postsDir).filter((name) => name.endsWith('.md'));
  assert.ok(files.length > 0);
  for (const name of files) {
    const text = fs.readFileSync(path.join(postsDir, name), 'utf8');
    const match = text.match(/^category:\s*(.+)$/m);
    assert.ok(match, `${name} missing category`);
    const raw = match[1].trim().replace(/^['"]|['"]$/g, '');
    assert.ok(CATEGORY_SLUGS.includes(raw), `${name} uses unknown category ${raw}`);
    assert.equal(categorySlug(raw), raw);
    const slug = name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    assert.equal(slug, slug.toLowerCase(), `${name} slug must be lowercase`);
  }
});

test('groupByCategoryName uses one slug and a display label', () => {
  const groups = groupByCategoryName([
    { kind: 'post', category: 'development', permalink: '/a/', tags: [] },
    { kind: 'post', category: 'Development', permalink: '/b/', tags: [] },
    { kind: 'post', category: 'devops', permalink: '/c/', tags: [] },
  ]);
  const development = groups.find((group) => group.slug === 'development');
  assert.equal(groups.filter((group) => group.slug === 'development').length, 1);
  assert.equal(development.name, 'Development');
  assert.equal(development.items.length, 2);
  assert.equal(groups.find((group) => group.slug === 'devops').name, 'DevOps');
});

test('TIL folders keep their directory names as labels', () => {
  const groups = groupByCategoryName([{ kind: 'til', category: 'git', permalink: '/t/', tags: [] }]);
  assert.equal(groups[0].name, 'git');
});

test('sameCategory compares slugs; only irregular labels are special-cased', () => {
  assert.equal(sameCategory('Development', 'development'), true);
  assert.equal(sameCategory('DevOps', 'Personal'), false);
  assert.equal(categoryLabel('devops'), 'DevOps');
  assert.equal(categoryLabel('development'), 'Development');
  assert.equal(categoryLabel('machine-learning'), 'Machine Learning');
  assert.equal(isKnownCategory('devops'), true);
  assert.equal(isKnownCategory('machine-learning'), false);
});
