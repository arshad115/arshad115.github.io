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
  assert.match(sitemap, /<lastmod>/);
  assert.match(sitemap, /\/llms\.txt/);
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

test('Giscus is on posts when configured, explained when not, and never on TIL', async () => {
  const post = await readDist(CLEAN_POST);
  const til = await readDist(TIL_GIT);
  assert.match(post, /data-comments="(giscus|off)"/);
  if (post.includes('data-comments="giscus"')) {
    assert.match(post, /giscus\.app/);
  } else {
    assert.match(post, /Comments are not enabled on this build/);
    assert.doesNotMatch(post, /giscus\.app/);
  }
  assert.match(til, /Today I Learned/);
  assert.doesNotMatch(til, /giscus\.app/);
  assert.doesNotMatch(til, /data-comments=/);
  assert.equal([...til.matchAll(/<h1[\s>]/g)].length, 1);
});

test('header captions are plain text or links, not Markdown YAML leftovers', async () => {
  const html = await readDist('/personal/whats-your-developer-identity/');
  assert.match(html, /<img[^>]+alt="Ariana Grande in the Side to Side music video"/);
  assert.match(html, /<figcaption id="header-caption"><a href="https:\/\/www\.youtube\.com\/watch\?v=ffxKSjUwKdU">Photo credit: Vevo\/Ariana Grande<\/a><\/figcaption>/);
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

test('human sitemap lists prose pages, not only listings', async () => {
  const html = await readDist('/sitemap/');
  assert.match(html, /href="\/about\/">About</);
  assert.match(html, /href="\/resume\/">Resume/);
  assert.match(html, /href="\/resources\/">/);
  assert.match(html, /href="\/llms\.txt"/);
});

test('articles expose published time, JSON-LD, and Markdown discovery', async () => {
  const html = await readDist('/personal/whats-your-developer-identity/');
  assert.match(html, /property="article:published_time"/);
  assert.match(html, /"@type":"BlogPosting"/);
  assert.match(html, /rel="describedby"[^>]*llms\.txt/);
  assert.match(html, /rel="alternate"[^>]*type="text\/markdown"[^>]*whats-your-developer-identity\/index\.md/);
  const md = await readDist('/personal/whats-your-developer-identity/index.md');
  assert.match(md, /^# What's your developer identity\?/);
  assert.match(md, /Canonical: https:\/\/arshadmehmood\.com\/personal\/whats-your-developer-identity\//);
});

test('llms.txt is a root Markdown map for agents', async () => {
  const llms = await readDist('/llms.txt');
  assert.match(llms, /^# Arshad Mehmood\n/);
  assert.match(llms, /^> /m);
  assert.match(llms, /^## Essays\n/m);
  assert.match(llms, /index\.md/);
  const full = await readDist('/llms-full.txt');
  assert.match(full, /delete-local-branch\/index\.md/);
});

test('404 is noindex; robots allow AI crawlers', async () => {
  const notFound = await readDist('/404.html');
  assert.match(notFound, /content="noindex, follow"/);
  const robots = await fs.readFile(path.join(root, 'dist/robots.txt'), 'utf8');
  assert.match(robots, /GPTBot/);
  assert.match(robots, /ClaudeBot/);
  assert.match(robots, /Sitemap:/);
});

test('About and Resources headings are plain text, not emoji', async () => {
  const about = await readDist('/about/');
  assert.match(about, /id="hello-im-arshad-mehmood"/);
  assert.match(about, /Hello, I.m Arshad Mehmood/);
  assert.doesNotMatch(about, /<h[1-6][^>]*>\s*[\u{1F300}-\u{1FAFF}]/u);
  const resources = await readDist('/resources/');
  assert.match(resources, /id="development-tools"/);
  assert.doesNotMatch(resources, /<h[1-6][^>]*>\s*[\u{1F300}-\u{1FAFF}]/u);
});

test('header figures expose alt, dimensions, and a caption association', async () => {
  const html = await readDist('/personal/whats-your-developer-identity/');
  assert.match(html, /<img[^>]+alt="Ariana Grande in the Side to Side music video"/);
  assert.match(html, /<img[^>]+width="\d+"[^>]+height="\d+"/);
  assert.match(html, /aria-describedby="header-caption"/);
});

test('SSH essay related list prefers markdown TIL links', async () => {
  const html = await readDist('/devops/complete-guide-to-ssh-from-basics-to-advanced/');
  assert.match(html, /<h2>Related<\/h2>/);
  assert.match(html, /href="\/today-i-learned\/ssh\/ssh-connection-basics\/"/);
});

test('mobile nav can close from the keyboard; theme toggle exposes pressed state', async () => {
  const html = await readDist('/');
  assert.match(html, /class="nav-toggle"[^>]*aria-controls="site-nav"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /data-theme-toggle[^>]*aria-pressed=/);
  assert.match(html, /Escape/);
});

test('home does not load IBM Plex Mono; posts do', async () => {
  const home = await readDist('/');
  assert.doesNotMatch(home, /ibm-plex-mono/i);
  const post = await readDist(CLEAN_POST);
  assert.match(post, /ibm-plex-mono/i);
});

test('portfolio uses HTTPS Play URLs, not bit.ly, and lists Langur once', async () => {
  const html = await readDist('/portfolio/');
  assert.doesNotMatch(html, /bit\.ly/i);
  assert.doesNotMatch(html, /http:\/\/play\.google/);
  assert.match(html, /https:\/\/play\.google\.com\/store\/apps\/details\?id=com\.kookydroidapps\.mosquesnearme/);
  assert.match(html, /https:\/\/www\.kentech\.ie\//);
  const langur = [...html.matchAll(/href="\/portfolio\/langur-language-translation-bot\/"/g)];
  assert.equal(langur.length, 2, 'one project row plus the write-ups index');
});
