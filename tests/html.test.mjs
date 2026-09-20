/**
 * Built-site contracts. Requires `npm run build` (CI runs this after the build).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { isRedirectHtml, readDist, distPathFor, root } from './helpers/dist.mjs';

async function sameDistFile(left, right) {
  try {
    const [a, b] = await Promise.all([fs.stat(distPathFor(left)), fs.stat(distPathFor(right))]);
    return a.dev === b.dev && a.ino === b.ino;
  } catch {
    return false;
  }
}

const CLEAN_POST = '/personal/the-most-fulfilling-2-i-made-and-my-android-developer-journey/';
const LEGACY_POST = '/personal/the-most-fulfilling-$2-I-made-and-my-android-developer-journey/';
const CLEAN_2FA = '/tutorial/how-to-use-gitlab-after-enabling-two-factor-authentication-2fa/';
const LEGACY_2FA =
  '/tutorial/how-to-use-gitlab-after-enabling-Two-Factor-Authentication-(2FA)/';
const CLEAN_LEARNT = '/personal/what-i-learnt-from-my-failed-incubator/';
const LEGACY_LEARNT = '/personal/what-I-learnt-from-my-failed-incubator/';
const TIL_ANGULAR = '/today-i-learned/angular2/pretty-print-json-object-in-template/';
const TIL_GIT = '/today-i-learned/git/delete-local-branch/';

const PUBLIC_PAGES = [
  '/',
  '/posts/',
  '/today-i-learned/',
  '/portfolio/',
  '/categories/',
  '/tags/',
  '/about/',
  '/contact/',
  '/resources/',
  '/resume/',
  '/support/',
  '/terms/',
  '/newsletter/',
  '/search/',
  '/sitemap/',
  '/404.html',
];

async function exists(urlPath) {
  try {
    await fs.access(distPathFor(urlPath));
    return true;
  } catch {
    return false;
  }
}

test('core pages are real HTML with the site wordmark', async () => {
  for (const route of PUBLIC_PAGES) {
    const html = await readDist(route);
    assert.equal(isRedirectHtml(html), false, `${route} is a redirect page`);
    assert.match(html, /Arshad Mehmood/, `${route} missing site name`);
  }
});

test('home is the notebook, not a theme landing page', async () => {
  const html = await readDist('/');
  assert.match(html, /<h1>Arshad Mehmood<\/h1>/);
  assert.match(html, /\/assets\/images\/bio-photo\.jpg/);
  assert.doesNotMatch(html, /starlight|pelagornis/i);
});

test('cleaned post slugs are the canonical pages', async () => {
  const dollar = await readDist(CLEAN_POST);
  assert.equal(isRedirectHtml(dollar), false);
  assert.match(dollar, /The Most Fulfilling \$2/);
  assert.match(dollar, /href="\/categories\/#personal">Personal</);
  assert.match(dollar, /data-pagefind-body/);

  const twoFa = await readDist(CLEAN_2FA);
  assert.equal(isRedirectHtml(twoFa), false);
  assert.match(twoFa, /Two-Factor Authentication/);

  const learnt = await readDist(CLEAN_LEARNT);
  assert.equal(isRedirectHtml(learnt), false);
  assert.match(learnt, /What I learnt from my failed incubator/);
});

test('old Jekyll punctuation URLs are redirects only', async () => {
  for (const route of [LEGACY_POST, LEGACY_2FA]) {
    const html = await readDist(route);
    assert.equal(isRedirectHtml(html), true, `${route} should redirect, not be canonical`);
  }
  if (await sameDistFile(CLEAN_LEARNT, LEGACY_LEARNT)) return;
  const html = await readDist(LEGACY_LEARNT);
  assert.equal(isRedirectHtml(html), true, `${LEGACY_LEARNT} should redirect, not be canonical`);
});

test('/projects/ is an alias redirect, not a canonical page', async () => {
  const html = await readDist('/projects/');
  assert.equal(isRedirectHtml(html), true);
});

test('RSS and XML sitemap list the live site', async () => {
  const rss = await readDist('/feed.xml');
  assert.match(rss, /<rss[\s>]/);
  assert.match(rss, /https:\/\/arshadmehmood\.com/);
  assert.match(rss, /<item>/);
  assert.doesNotMatch(rss, /YOUR_USER_ID|UA-114855578/);

  const sitemap = await readDist('/sitemap.xml');
  assert.match(sitemap, /<urlset[\s>]/);
  assert.match(sitemap, /https:\/\/arshadmehmood\.com/);
  assert.match(sitemap, /the-most-fulfilling-2-i-made-and-my-android-developer-journey/);
  assert.match(sitemap, /what-i-learnt-from-my-failed-incubator/);
  assert.doesNotMatch(sitemap, /the-most-fulfilling-\$2/);
  assert.doesNotMatch(sitemap, /Two-Factor-Authentication-\(2FA\)/);
});

test('contact uses Wufoo; newsletter is RSS-only', async () => {
  const contact = await readDist('/contact/');
  assert.match(contact, /arshadmehmood\.wufoo\.com/);

  const newsletter = await readDist('/newsletter/');
  assert.match(newsletter, /\/feed\.xml/);
  assert.doesNotMatch(newsletter, /YOUR_USER_ID|mailchimp/i);
});

test('Giscus is never on TIL notes', async () => {
  const til = await readDist(TIL_GIT);
  assert.match(til, /Today I Learned/);
  assert.doesNotMatch(til, /giscus\.app/);
  assert.equal([...til.matchAll(/<h1[\s>]/g)].length, 1);
});

test('header captions are plain text or links, not Markdown YAML leftovers', async () => {
  const html = await readDist('/personal/whats-your-developer-identity/');
  assert.match(html, /<img[^>]+alt="Ariana Grande in the Side to Side music video"/);
  assert.match(html, /<figcaption><a href="https:\/\/www\.youtube\.com\/watch\?v=ffxKSjUwKdU">Photo credit: Vevo\/Ariana Grande<\/a><\/figcaption>/);
  assert.doesNotMatch(html, /<figcaption>\[[*]*Vevo/);
});

test('Angular mustache in TIL notes is not treated as Liquid', async () => {
  const html = await readDist(TIL_ANGULAR);
  assert.match(html, /\{\{\s*data\s*\|\s*json\s*\}\}/);
});

test('Pagefind, CNAME, and robots are in the build', async () => {
  await fs.access(path.join(root, 'dist/pagefind/pagefind-ui.js'));
  const cname = await fs.readFile(path.join(root, 'dist/CNAME'), 'utf8');
  assert.match(cname, /arshadmehmood\.com/);
  const robots = await fs.readFile(path.join(root, 'dist/robots.txt'), 'utf8');
  assert.match(robots, /Sitemap:/);
});

test('drafts are not published', async () => {
  const html = await readDist('/');
  assert.doesNotMatch(html, /Your post title/);
  assert.equal(await exists('/drafts/'), false);
  assert.equal(await exists('/posts/post-template/'), false);
});

test('no leftover Universal Analytics default', async () => {
  const samples = ['/', '/posts/', '/newsletter/', CLEAN_POST];
  for (const route of samples) {
    const html = await readDist(route);
    assert.doesNotMatch(html, /UA-114855578|googletagmanager|www\.google-analytics\.com\/analytics\.js/);
  }
});

test('post pages render category labels, not YAML slugs', async () => {
  const html = await readDist('/devops/devops-journey/');
  assert.match(html, /href="\/categories\/#devops">DevOps</);
});

test('categories page uses one Title Case bucket per slug', async () => {
  const html = await readDist('/categories/');
  const ids = [...html.matchAll(/<section class="taxonomy" id="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(ids.includes('development'));
  assert.equal(new Set(ids).size, ids.length, `duplicate category ids: ${ids.join(', ')}`);
  assert.match(html, /<h2>Development /);
  assert.match(html, /<h2>DevOps /);
  assert.doesNotMatch(html, /<h2>development /);
  assert.doesNotMatch(html, /<h2>devops /);
});
