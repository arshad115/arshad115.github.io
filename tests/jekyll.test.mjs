import assert from 'node:assert/strict';
import { test } from 'node:test';
import { rewriteJekyllMarkdown } from '../src/lib/jekyll-rewrite.mjs';

test('rewrites Jekyll Liquid URL filters and kramdown class markers', () => {
  const input = [
    '{{ "/assets/images/x.png" | absolute_url }}',
    "{{ '/css/main.css' | relative_url }}",
    "{{ 'app.js' | prepend: 'assets/' | relative_url }}",
    '{% raw %}',
    'plain',
    '{% endraw %}',
    '{: .notice}',
  ].join('\n');

  const out = rewriteJekyllMarkdown(input);
  assert.match(out, /\/assets\/images\/x\.png/);
  assert.match(out, /\/css\/main\.css/);
  assert.match(out, /\/assets\/app\.js/);
  assert.doesNotMatch(out, /absolute_url|relative_url|\{%\s*raw/);
  assert.doesNotMatch(out, /\{:\s*\.notice\}/);
});

test('leaves Angular mustache examples alone', () => {
  const snippets = [
    '<div>{{data | json}}</div>',
    '{{ birthday | date | uppercase}}',
    '<option>{{g}}</option>',
    'Font size is: {{ fontSize }}',
  ];
  for (const snippet of snippets) {
    assert.equal(rewriteJekyllMarkdown(snippet), snippet);
  }
});
