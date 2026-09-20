import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dirs = ['content/posts', 'content/pages', 'content/portfolio', 'content/drafts'];

function markdownFiles(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((name) => name.endsWith('.md'))
    .map((name) => path.join(abs, name));
}

test('header images use alt text and plain-text captions', () => {
  const files = dirs.flatMap(markdownFiles);
  assert.ok(files.length > 0);
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const fm = text.match(/^---\n([\s\S]*?)\n---/);
    assert.ok(fm, `${file} missing front matter`);
    const matter = fm[1];
    if (!/^header:/m.test(matter)) continue;
    const image = matter.match(/^  image:\s*(.+)$/m);
    if (!image) continue;
    const alt = matter.match(/^  alt:\s*(.+)$/m);
    assert.ok(alt && alt[1].trim(), `${path.basename(file)} header.image needs header.alt`);
    const caption = matter.match(/^  caption:\s*(.+)$/m);
    if (caption) {
      assert.doesNotMatch(
        caption[1],
        /\[.+\]\(.+\)/,
        `${path.basename(file)} caption must be plain text, not Markdown`,
      );
    }
    const captionHref = matter.match(/^  captionHref:\s*(.+)$/m);
    if (captionHref) {
      assert.match(
        captionHref[1].trim(),
        /^https?:\/\//,
        `${path.basename(file)} captionHref must be an absolute URL`,
      );
      assert.ok(caption, `${path.basename(file)} captionHref requires caption`);
    }
  }
});
