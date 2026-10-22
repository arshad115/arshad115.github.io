/**
 * Built-site contracts. Requires `npm run build` (CI runs this after the build).
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import {
  collectHtmlFiles,
  distDir,
  isRedirectHtml,
  readDist,
  distPathFor,
  root,
} from './helpers/dist.mjs';

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
  assert.match(html, /<title>Arshad Mehmood – Software Engineer at SAP \(Germany\) \| Tech Blog<\/title>/);
  assert.match(html, /<h1>A working notebook on cloud-native backends\.<\/h1>/);
  assert.match(html, /\/assets\/images\/arshad-mehmood-software-engineer-germany\.jpg/);
  assert.match(html, /alt="Arshad Mehmood - Software Engineer at SAP in Germany"/);
  assert.match(html, /width="640"/);
  assert.match(html, /height="640"/);
  assert.match(html, /Arshad Mehmood is a Software Engineer at SAP SE in Germany/);
  assert.match(html, /"@type":"ProfilePage"/);
  assert.match(html, /"disambiguatingDescription":"Software Engineer at SAP SE/);
  assert.doesNotMatch(html, /starlight|pelagornis/i);
});

test('homepage critical assets are optimized for first paint', async () => {
  const html = await readDist('/');
  assert.match(
    html,
    /<source[^>]+arshad-mehmood-software-engineer-germany\.webp[^>]+type="image\/webp"/,
  );
  assert.match(html, /<img[^>]+loading="eager"[^>]+fetchpriority="high"/);
  assert.match(html, /<link rel="preload"[^>]+source-sans-3-latin-wght-normal[^>]+as="font"/);
  assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"[^>]+Base\.[^>]+\.css/);
  assert.doesNotMatch(html, /<link rel="icon"[^>]+favicon\.ico/);

  const [profile, favicon] = await Promise.all([
    fs.stat(path.join(root, 'dist/assets/images/arshad-mehmood-software-engineer-germany.webp')),
    fs.stat(path.join(root, 'dist/assets/images/favicon.svg')),
  ]);
  assert.ok(profile.size < 32 * 1024, `optimized profile image is ${profile.size} bytes`);
  assert.ok(favicon.size < 1024, `favicon is ${favicon.size} bytes`);
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
  assert.doesNotMatch(sitemap, /\/llms(?:-full)?\.txt/);
  assert.doesNotMatch(sitemap, /\/search\//);
  assert.doesNotMatch(sitemap, /\/feed\.xml/);
  assert.doesNotMatch(sitemap, /the-most-fulfilling-\$2/);
  assert.doesNotMatch(sitemap, /Two-Factor-Authentication-\(2FA\)/);
});

test('contact uses Web3Forms; newsletter is RSS-only', async () => {
  const contact = await readDist('/contact/');
  assert.match(contact, /action="\/api\/contact"/);
  assert.doesNotMatch(contact, /name="access_key"|w3f_/);
  assert.doesNotMatch(contact, /wufoo/i);

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
  assert.match(html, /href="\/tags\/#devops"><span class="visually-hidden">Posts tagged <\/span>devops/);
});

test('post lists show the category line without every tag', async () => {
  for (const route of ['/', '/posts/']) {
    const html = await readDist(route);
    assert.doesNotMatch(html, /Posts tagged/, `${route} lists individual tags`);
    assert.match(html, /min read/);
    assert.match(html, /href="\/categories\/#devops">DevOps</);
  }
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
  assert.match(llms, /^## Posts\n/m);
  assert.match(llms, /index\.md/);
  const full = await readDist('/llms-full.txt');
  assert.match(full, /delete-local-branch\/index\.md/);
});

test('404 is noindex; robots allow AI crawlers', async () => {
  const notFound = await readDist('/404.html');
  assert.match(notFound, /content="noindex, follow"/);
  assert.match(notFound, /<a class="text-button" href="\/search\/" data-search-open>search<\/a>/);
  const robots = await fs.readFile(path.join(root, 'dist/robots.txt'), 'utf8');
  assert.match(robots, /GPTBot/);
  assert.match(robots, /ClaudeBot/);
  assert.match(robots, /Sitemap:/);
});

test('About and Resources headings are plain text, not emoji', async () => {
  const about = await readDist('/about/');
  assert.match(about, /id="software-engineering-infrastructure-and-practical-documentation"/);
  assert.match(about, /Arshad Mehmood is a Software Engineer at SAP SE in Germany/);
  assert.match(about, /"@type":"ProfilePage"/);
  assert.match(about, /"@id":"https:\/\/arshadmehmood\.com\/about\/#profilepage"/);
  assert.doesNotMatch(about, /<h[1-6][^>]*>\s*[\u{1F300}-\u{1FAFF}]/u);
  const resources = await readDist('/resources/');
  assert.match(resources, /id="development-tools"/);
  assert.doesNotMatch(resources, /<h[1-6][^>]*>\s*[\u{1F300}-\u{1FAFF}]/u);
});

test('header figures expose alt, dimensions, and a caption association', async () => {
  const html = await readDist('/personal/whats-your-developer-identity/');
  assert.match(html, /<figure class="post-hero"/);
  assert.match(html, /<img[^>]+alt="Ariana Grande in the Side to Side music video"/);
  assert.match(html, /<img[^>]+width="\d+"[^>]+height="\d+"/);
  assert.match(html, /aria-describedby="header-caption"/);
});

test('SSH article related list prefers markdown TIL links', async () => {
  const html = await readDist('/devops/complete-guide-to-ssh-from-basics-to-advanced/');
  assert.match(html, />DevOps<\/p>/);
  assert.doesNotMatch(html, />Essay<\/p>/);
  assert.match(html, /class="post-content-grid has-sidebar"/);
  assert.match(html, /<aside class="related" aria-labelledby="related-heading"/);
  assert.match(html, /<h2 id="related-heading">Related<\/h2>/);
  assert.match(html, /href="\/today-i-learned\/ssh\/ssh-connection-basics\/"/);
  assert.match(html, /class="related-excerpt"/);
  assert.match(html, /Read article/);
});

test('mobile nav can close from the keyboard; theme toggle exposes pressed state', async () => {
  const html = await readDist('/');
  assert.match(html, /class="nav-toggle"[^>]*aria-controls="site-nav"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /data-theme-toggle[^>]*aria-pressed=/);
  assert.match(html, /class="theme-icon theme-icon-moon"/);
  assert.match(html, /class="theme-icon theme-icon-sun"/);
  assert.doesNotMatch(html, />Dark<\/button>/);
  assert.match(html, /<kbd class="search-key"[^>]*>Esc<\/kbd>/);
});

test('collection pages expose practical browsing controls', async () => {
  const posts = await readDist('/posts/');
  assert.match(posts, /class="collection-links"/);
  assert.match(posts, /href="\/categories\/"/);
  assert.match(posts, /href="\/tags\/"/);
  assert.match(posts, /class="featured-post-grid"/);
  assert.match(posts, />Archive<\/h2>/);
  assert.match(posts, /class="year-group"/);

  const til = await readDist('/today-i-learned/');
  assert.match(til, /id="til-filter"[^>]*type="search"/);
  assert.match(til, /class="til-browser"/);
  assert.match(til, /class="category-jump"/);
  assert.match(til, /data-til-item/);
  assert.match(til, />JavaScript <span>9<\/span>/);
});

test('article navigation and theme controls adapt to the reader', async () => {
  const post = await readDist('/devops/complete-guide-to-ssh-from-basics-to-advanced/');
  assert.match(post, /<details class="toc" open/);
  assert.match(post, /12 sections/);
  assert.match(post, /data-reading-progress/);
  assert.match(post, /class="expressive-code/);
  assert.match(post, /title="Copy to clipboard"/);
  assert.doesNotMatch(post, /className=.?copy-code/);

  const search = await readDist('/search/');
  assert.doesNotMatch(search, /Best after a production build/);
  assert.match(search, /<meta name="robots" content="noindex, follow"/);

  const home = await readDist('/');
  assert.match(home, /data-search-open[^>]+aria-haspopup="dialog"/);
  assert.match(home, /aria-keyshortcuts="Meta\+K Control\+K"/);
  assert.match(home, /<dialog class="search-dialog"/);
  assert.match(home, /role="combobox"[^>]+aria-controls="site-search-results"/);
  assert.match(home, /data-search-query="DevOps"/);
  assert.match(home, /property="og:image" content="https:\/\/arshadmehmood\.com\/assets\/images\/social-default\.png"/);
  assert.match(home, /prefers-color-scheme: dark/);
  assert.match(home, /meta name="theme-color" content="#ffffff"/);
});

test('interactive search index includes posts and TIL notes', async () => {
  const index = JSON.parse(await fs.readFile(path.join(root, 'dist/search-index.json'), 'utf8'));
  assert.ok(index.some((entry) => entry.kind === 'post' && entry.permalink.includes('complete-guide-to-ssh')));
  assert.ok(index.some((entry) => entry.kind === 'til' && entry.permalink.includes('/today-i-learned/')));
  assert.ok(index.every((entry) => entry.title && entry.permalink && entry.searchText));
});

test('search dialog suggestions are useful before JavaScript runs', async () => {
  const html = await readDist('/');
  assert.match(html, /<nav class="search-suggestions" aria-label="Suggested searches">/);
  for (const [query, label] of [
    ['DevOps', 'DevOps'],
    ['SSH', 'SSH'],
    ['Android', 'Android'],
    ['Self-hosting', 'Self-hosting'],
  ]) {
    assert.match(
      html,
      new RegExp(`<a href="/search/\\?q=${query}" data-search-query="${query}">${label}</a>`),
    );
  }
});

test('contact form uses native validation and labels optional fields', async () => {
  const contact = await readDist('/contact/');
  assert.doesNotMatch(contact, /<form[^>]+novalidate/);
  assert.match(contact, /Website <small>\(optional\)<\/small>/);
  assert.match(contact, /type="email"[^>]+required/);
  assert.match(contact, /name="botcheck"/);
  assert.match(contact, /role="status" aria-live="polite"/);
  assert.match(contact, /href="\/terms\/#contact-form"/);
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
  assert.match(html, /Creator and maintainer/);
  assert.match(html, /Python · TypeScript · Obsidian/);
  const langur = [...html.matchAll(/href="\/portfolio\/langur-language-translation-bot\/"/g)];
  assert.equal(langur.length, 2, 'one project row plus the write-ups index');
});

test('older posts show a visible archive warning', async () => {
  const oldPost = await readDist('/tutorial/deploy-angular-app-to-firebase-hosting/');
  const currentPost = await readDist('/devops/complete-guide-to-ssh-from-basics-to-advanced/');
  assert.match(oldPost, /class="archive-note"/);
  assert.match(oldPost, /may reference outdated software or practices/);
  assert.doesNotMatch(currentPost, /class="archive-note"/);
});

test('migrated cross-links use published routes and valid fragments', async () => {
  const contact = await readDist('/contact/');
  const support = await readDist('/support/');
  assert.match(contact, /href="\/support\/#follow"/);
  assert.match(support, /id="follow"/);

  const langur = await readDist('/development/my-first-open-source-repository-langur-translation-chat-bot/');
  assert.doesNotMatch(langur, /href="License\.md"/);
  assert.match(langur, /github\.com\/arshad115\/langur-translation-bot\/blob\/master\/LICENSE/);

  const rsync = await readDist('/today-i-learned/ssh/using-rsync-for-file-transfers/');
  assert.match(rsync, /href="\/today-i-learned\/ssh\/using-scp-for-file-transfers\/"/);
});

test('article headings do not skip levels below the layout H1', async () => {
  const files = await collectHtmlFiles(distDir);
  for (const [route, file] of files) {
    const html = await fs.readFile(file, 'utf8');
    if (isRedirectHtml(html)) continue;
    const prose = html.match(/<div class="prose">([\s\S]*?)<\/div>/)?.[1];
    if (!prose) continue;
    const levels = [...prose.matchAll(/<h([2-6])\b/gi)].map((match) => Number(match[1]));
    let previous = 1;
    for (const level of levels) {
      assert.ok(level <= previous + 1, `${route} skips from H${previous} to H${level}`);
      previous = level;
    }
  }
});

test('rendered images reserve their intrinsic layout space', async () => {
  const files = await collectHtmlFiles(distDir);
  for (const [route, file] of files) {
    const html = await fs.readFile(file, 'utf8');
    if (isRedirectHtml(html)) continue;
    for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
      assert.match(match[0], /\bwidth="\d+"/, `${route} image missing width: ${match[0]}`);
      assert.match(match[0], /\bheight="\d+"/, `${route} image missing height: ${match[0]}`);
    }
  }
});

test('indexable pages have unique metadata and locally controlled social images', async () => {
  const files = await collectHtmlFiles(distDir);
  const titles = new Map();
  for (const [route, file] of files) {
    const html = await fs.readFile(file, 'utf8');
    if (isRedirectHtml(html) || /<meta name="robots" content="[^"]*noindex/i.test(html)) continue;

    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
    const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1]?.trim();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    const socialImage = html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1];

    assert.ok(title, `${route} missing title`);
    assert.ok(description, `${route} missing meta description`);
    assert.ok(canonical, `${route} missing canonical URL`);
    assert.match(socialImage || '', /^https:\/\/arshadmehmood\.com\//, `${route} uses an external social image`);
    assert.equal(titles.has(title), false, `${route} duplicates the title from ${titles.get(title)}`);
    titles.set(title, route);
  }
});
