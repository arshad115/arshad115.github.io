import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildJsonLd,
  buildLlmsFullTxt,
  buildLlmsTxt,
  entryToMarkdown,
  humanSitemapGroups,
  markdownPath,
  markdownUrl,
} from '../src/lib/seo.mjs';

test('markdownPath colocates index.md with trailing-slash HTML', () => {
  assert.equal(markdownPath('/'), '/index.md');
  assert.equal(markdownPath('/about/'), '/about/index.md');
  assert.equal(
    markdownPath('/personal/whats-your-developer-identity/'),
    '/personal/whats-your-developer-identity/index.md',
  );
  assert.equal(
    markdownUrl('/about/'),
    'https://arshadmehmood.com/about/index.md',
  );
});

test('JSON-LD graph has Person, WebSite, Blog, and BlogPosting', () => {
  const data = buildJsonLd({
    permalink: '/devops/devops-journey/',
    title: 'DevOps Journey',
    description: 'A pipeline notebook.',
    kind: 'post',
    published: new Date('2024-09-23T00:00:00.000Z'),
    section: 'devops',
    categoryLabel: 'DevOps',
    tags: ['jenkins'],
    minutes: 8,
    wordCount: 1200,
  });
  const types = data['@graph'].map((node) => node['@type']);
  assert.deepEqual(
    types.filter((type) => type === 'Person' || type === 'WebSite' || type === 'Blog' || type === 'BlogPosting'),
    ['Person', 'WebSite', 'Blog', 'BlogPosting'],
  );
  const article = data['@graph'].find((node) => node['@type'] === 'BlogPosting');
  assert.equal(article.articleSection, 'DevOps');
  assert.match(article.datePublished, /^2024-09-23/);
  assert.equal(article.timeRequired, 'PT8M');
  const crumbs = data['@graph'].find((node) => node['@type'] === 'BreadcrumbList');
  assert.equal(crumbs.itemListElement.at(-1).name, 'DevOps Journey');
});

test('TIL JSON-LD uses TechArticle', () => {
  const data = buildJsonLd({
    permalink: '/today-i-learned/git/delete-local-branch/',
    title: 'Delete a local branch',
    kind: 'til',
    section: 'git',
  });
  assert.ok(data['@graph'].some((node) => node['@type'] === 'TechArticle'));
});

test('llms.txt is the v2 file-list format', () => {
  const text = buildLlmsTxt({
    pages: [{ title: 'About', permalink: '/about/', excerpt: 'Bio.' }],
    posts: [
      {
        title: 'Hello World',
        permalink: '/personal/hello-world/',
        excerpt: 'First post.',
        date: new Date('2018-01-27T00:00:00.000Z'),
        categoryLabel: 'Personal',
      },
    ],
    portfolio: [{ title: 'Langur', permalink: '/portfolio/langur-language-translation-bot/', excerpt: 'Bot.' }],
    tilCount: 140,
  });
  assert.match(text, /^# Arshad Mehmood\n/);
  assert.match(text, /^> Personal blog/m);
  assert.match(text, /^## About\n/m);
  assert.match(text, /\[About\]\(https:\/\/arshadmehmood\.com\/about\/index\.md\): Bio\./);
  assert.match(text, /\[Hello World\]\(https:\/\/arshadmehmood\.com\/personal\/hello-world\/index\.md\)/);
  assert.match(text, /llms-full\.txt/);
  assert.doesNotMatch(text, /^### /m);
});

test('llms-full.txt lists every given note as a Markdown link', () => {
  const text = buildLlmsFullTxt({
    pages: [],
    posts: [],
    til: [{ title: 'Delete a local branch', permalink: '/today-i-learned/git/delete-local-branch/', category: 'git' }],
    portfolio: [],
  });
  assert.match(text, /delete-local-branch\/index\.md/);
});

test('entryToMarkdown leads with the title and canonical URL', () => {
  const md = entryToMarkdown({
    title: 'Hello World',
    excerpt: 'First post.',
    permalink: '/personal/hello-world/',
    date: new Date('2018-01-27T00:00:00.000Z'),
    categoryLabel: 'Personal',
    tags: ['intro'],
    body: 'I started a blog.\n',
  });
  assert.match(md, /^# Hello World\n/);
  assert.match(md, /Canonical: https:\/\/arshadmehmood\.com\/personal\/hello-world\//);
  assert.match(md, /I started a blog\./);
});

test('human sitemap Pages group includes collection pages plus listings', () => {
  const groups = humanSitemapGroups({
    listingRoutes: [
      { path: '/', title: 'Home' },
      { path: '/posts/', title: 'All Posts' },
      { path: '/sitemap/', title: 'Sitemap' },
    ],
    entries: [
      { kind: 'page', permalink: '/about/', title: 'About' },
      { kind: 'page', permalink: '/resume/', title: 'Resume' },
      { kind: 'post', permalink: '/personal/hello-world/', title: 'Hello World' },
    ],
  });
  const pages = groups.find((group) => group.name === 'Pages').items.map((item) => item.path);
  assert.ok(pages.includes('/'));
  assert.ok(pages.includes('/about/'));
  assert.ok(pages.includes('/resume/'));
  assert.equal(pages.includes('/sitemap/'), false);
});
