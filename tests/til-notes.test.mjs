import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { SKIP_TIL_FILES } from '../scripts/lib/scaffold.mjs';

const tilRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '../today-i-learned');

function tilNotes() {
  return fs
    .readdirSync(tilRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_'))
    .flatMap((entry) => {
      const dir = path.join(tilRoot, entry.name);
      return fs
        .readdirSync(dir)
        .filter((name) => name.endsWith('.md') && !SKIP_TIL_FILES.has(name))
        .map((name) => path.join(dir, name));
    });
}

test('TIL notes have YAML titles and do not repeat them as H1', () => {
  const files = tilNotes();
  assert.ok(files.length > 0);
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
    assert.ok(fm, `${path.relative(tilRoot, file)} missing YAML front matter`);
    const title = fm[1].match(/^title:\s*(.+)$/m);
    assert.ok(title, `${path.relative(tilRoot, file)} missing title:`);
    const body = text.slice(fm[0].length).replace(/```[\s\S]*?```/g, '');
    assert.doesNotMatch(
      body,
      /^#\s+/m,
      `${path.relative(tilRoot, file)} still has a body H1; the layout already prints the title`,
    );
    assert.doesNotMatch(text, /\{%\s*(?:end)?raw\s*%\}/, `${path.relative(tilRoot, file)} still has Liquid raw tags`);
  }
});
