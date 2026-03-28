import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const root = process.cwd();
const docsRoot = path.join(root, 'src', 'content', 'docs');
const generatedRoot = path.join(docsRoot, 'generated');
const dataRoot = path.join(root, 'src', 'generated');

const pageExcludes = new Set([
  '404.md',
  'category-archive.md',
  'contact.md',
  'newsletter.md',
  'posts.md',
  'projects.html',
  'sitemap.md',
  'support.md',
  'tag-archive.md',
  'today-i-learned.md',
]);

const authoredContentRoot = path.join(root, 'content');
const postsRoot = path.join(authoredContentRoot, 'posts');
const pagesRoot = path.join(authoredContentRoot, 'pages');
const portfolioRoot = path.join(authoredContentRoot, 'portfolio');
const siteOrigin = 'https://arshadmehmood.com';
const syntheticLinkLimits = {
  post: 6,
  portfolio: 4,
  til: 8,
};
const markdownSourcePattern = /\.(md|mdx)$/i;

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function stripSlashes(value = '') {
  return value.replace(/^\/+|\/+$/g, '');
}

function titleize(value = '') {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function uniquePreserveOrder(values) {
  return [...new Set(values.filter(Boolean))];
}

function relativeComponentImport(depth, target) {
  return `${'../'.repeat(depth)}${target}`;
}

function stringifyScalar(value) {
  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }
  return JSON.stringify(value);
}

function toFrontmatter(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      if (!value.length) continue;
      lines.push(`${key}:`);
      for (const item of value) {
        lines.push(`  - ${stringifyScalar(item)}`);
      }
      continue;
    }
    if (value instanceof Date) {
      lines.push(`${key}: ${stringifyScalar(value)}`);
      continue;
    }
    if (typeof value === 'object') {
      lines.push(`${key}:`);
      for (const [childKey, childValue] of Object.entries(value)) {
        if (childValue === undefined || childValue === null) continue;
        if (Array.isArray(childValue)) {
          lines.push(`  ${childKey}:`);
          for (const item of childValue) {
            lines.push(`    - ${stringifyScalar(item)}`);
          }
        } else {
          lines.push(`  ${childKey}: ${stringifyScalar(childValue)}`);
        }
      }
      continue;
    }
    lines.push(`${key}: ${stringifyScalar(value)}`);
  }
  lines.push('---', '');
  return lines.join('\n');
}

function normalizeBody(body) {
  return body
    .replace(/\{\{\s*"([^"]+)"\s*\|\s*absolute_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*"([^"]+)"\s*\|\s*relative_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '$1')
    .replace(/\{\{\s*'([^']+)'\s*\|\s*prepend:\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, '/$2$1')
    .replace(/\{\{\s*base_path\s*\}\}/g, '')
    .replace(/\{\{\s*site\.url\s*\}\}/g, 'https://arshadmehmood.com')
    .replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />')
    .replace(/^\{:\s*[^}]+\}\s*$/gm, '')
    .replace(/\s*\{:\s*[^}]+\}\s*$/gm, '')
    .replace(/---Obsidian/g, '---\n\nObsidian')
    .trim();
}

function transformGallery(body, gallery = []) {
  if (!body.includes('{% include gallery')) return body;
  const galleryMarkdown = gallery
    .map((item) => `![${item.alt || item.caption || 'Gallery image'}](${item.image_path || item.url})`)
    .join('\n\n');
  return body.replace(/\{%\s*include\s+gallery[^%]*%\}/g, galleryMarkdown);
}

function normalizeInternalLink(value, currentSlug = '') {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:')) return null;

  let candidate = raw;
  if (candidate.startsWith(siteOrigin)) {
    candidate = candidate.slice(siteOrigin.length);
  }

  if (/^[a-z]+:\/\//i.test(candidate)) return null;

  candidate = candidate
    .replace(/\\/g, '/')
    .replace(/index\.html?$/i, '')
    .replace(/\.(md|mdx)$/i, '')
    .split('?')[0]
    .split('#')[0];

  if (!candidate) return null;
  if (/\.(png|jpe?g|gif|svg|webp|pdf|xml|ico|txt|css|js)$/i.test(candidate)) return null;

  if (candidate.startsWith('/')) {
    const cleaned = stripSlashes(candidate);
    return cleaned || null;
  }

  if (candidate.startsWith('.')) {
    const baseDir = currentSlug.includes('/') ? currentSlug.split('/').slice(0, -1).join('/') : '';
    const resolved = path.posix.normalize(path.posix.join('/', baseDir, candidate));
    const cleaned = stripSlashes(resolved);
    return cleaned || null;
  }

  const cleaned = stripSlashes(candidate);
  return cleaned || null;
}

function buildLinks(body, currentSlug = '') {
  const links = new Set();
  const markdownLinks = [...body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)];
  for (const match of markdownLinks) {
    const cleaned = normalizeInternalLink(match[1], currentSlug);
    if (cleaned) links.add(cleaned);
  }
  const wikiLinks = [...body.matchAll(/\[\[([^[\]|#]+)(?:[#|][^\]]+)?\]\]/g)];
  for (const match of wikiLinks) {
    const cleaned = slugify(match[1]);
    if (cleaned) links.add(cleaned);
  }
  return [...links];
}

function isGraphContentLink(value) {
  if (!value) return false;
  return !/^assets\//i.test(value) && !/\.(png|jpe?g|gif|svg|webp|pdf|xml|ico|txt|css|js)$/i.test(value);
}

async function resetGenerated() {
  await fs.rm(generatedRoot, { recursive: true, force: true });
  await fs.mkdir(path.join(generatedRoot, 'posts'), { recursive: true });
  await fs.mkdir(path.join(generatedRoot, 'portfolio'), { recursive: true });
  await fs.mkdir(path.join(generatedRoot, 'pages'), { recursive: true });
  await fs.mkdir(path.join(generatedRoot, 'today-i-learned'), { recursive: true });
  await fs.mkdir(dataRoot, { recursive: true });
}

async function readDirFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

function isMarkdownSourceFile(name) {
  return markdownSourcePattern.test(name);
}

function removeMarkdownExtension(name) {
  return name.replace(markdownSourcePattern, '');
}

async function writeDoc(relativeFile, frontmatter, body) {
  const fullPath = path.join(docsRoot, relativeFile);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  const content = [frontmatter, body, ''].join('\n');
  await fs.writeFile(fullPath, content, 'utf8');
}

function createContentEntry(relativeFile, frontmatterData, body, options = {}) {
  return {
    relativeFile,
    frontmatterData,
    body,
    slug: frontmatterData.slug,
    tags: ensureArray(frontmatterData.tags).map(String),
    category: frontmatterData.category || '',
    contentType: frontmatterData.contentType,
    parsedLinks: options.parsedLinks || [],
    explicitLinks: options.explicitLinks || [],
  };
}

function buildSyntheticLinks(entries) {
  const typedEntries = entries.filter((entry) =>
    entry.contentType === 'post' || entry.contentType === 'portfolio' || entry.contentType === 'til'
  );

  for (const entry of typedEntries) {
    const scores = new Map();
    const entryTags = new Set((entry.tags || []).map((tag) => String(tag).toLowerCase()));

    for (const candidate of typedEntries) {
      if (candidate.slug === entry.slug) continue;

      let score = 0;
      const candidateTags = (candidate.tags || []).map((tag) => String(tag).toLowerCase());
      for (const tag of candidateTags) {
        if (entryTags.has(tag)) score += 3;
      }

      if (entry.category && candidate.category && entry.category === candidate.category) {
        score += 2;
      }

      if (entry.contentType === candidate.contentType) {
        score += 1;
      }

      if (score > 0) {
        scores.set(candidate.slug, { score, candidate });
      }
    }

    const cap = syntheticLinkLimits[entry.contentType] || 5;
    entry.syntheticLinks = [...scores.entries()]
      .sort((a, b) => {
        if (b[1].score !== a[1].score) return b[1].score - a[1].score;
        return a[1].candidate.slug.localeCompare(b[1].candidate.slug);
      })
      .slice(0, cap)
      .map(([slug]) => slug);
  }
}

async function writeGeneratedDocs(entries) {
  buildSyntheticLinks(entries);

  for (const entry of entries) {
    const links = uniquePreserveOrder([
      ...entry.parsedLinks,
      ...entry.explicitLinks,
      ...(entry.syntheticLinks || []),
    ]).filter((link) => link !== entry.slug && isGraphContentLink(link));

    const frontmatter = toFrontmatter({
      ...entry.frontmatterData,
      links,
    });

    await writeDoc(entry.relativeFile, frontmatter, entry.body);
  }
}

async function generatePosts(siteData) {
  const entries = [];
  const files = (await readDirFiles(postsRoot)).filter(isMarkdownSourceFile);
  for (const file of files) {
    const source = await fs.readFile(path.join(postsRoot, file), 'utf8');
    const parsed = matter(source);
    const categoryName = parsed.data.category || ensureArray(parsed.data.categories)[0] || 'software';
    const category = slugify(categoryName);
    const slugPart = removeMarkdownExtension(file.replace(/^\d{4}-\d{2}-\d{2}-/, ''));
    const title = parsed.data.title || titleize(slugPart);
    const slug = `${category}/${slugPart}`;
    const url = `/${slug}/`;
    const body = normalizeBody(parsed.content);
    const tags = ensureArray(parsed.data.tags).map(String);
    const parsedLinks = buildLinks(body, slug);
    const explicitLinks = ensureArray(parsed.data.links)
      .map((value) => normalizeInternalLink(value, slug))
      .filter(Boolean);
    const frontmatterData = {
      title,
      description: parsed.data.excerpt || parsed.data.description || '',
      slug,
      contentType: 'post',
      category: categoryName,
      tags,
      pubDate: parsed.data.date || file.slice(0, 10),
      updatedDate: parsed.data.last_modified_at || parsed.data.date || file.slice(0, 10),
      heroImage: parsed.data.header?.image,
      teaser: parsed.data.header?.teaser,
      draft: Boolean(parsed.data.draft),
      sidebar: { hidden: true },
      graph: { visible: true },
    };
    entries.push(
      createContentEntry(path.join('generated', 'posts', `${slugPart}.mdx`), frontmatterData, body, {
        parsedLinks,
        explicitLinks,
      })
    );
    siteData.posts.push({
      title,
      category: categoryName,
      categorySlug: category,
      tags,
      url,
      slug,
      excerpt: parsed.data.excerpt || '',
      pubDate: parsed.data.date || file.slice(0, 10),
      readingTime: Math.ceil(readingTime(body).minutes),
    });
  }
  return entries;
}

async function generatePortfolio(siteData) {
  const entries = [];
  const files = (await readDirFiles(portfolioRoot)).filter(isMarkdownSourceFile);
  for (const file of files) {
    const source = await fs.readFile(path.join(portfolioRoot, file), 'utf8');
    const parsed = matter(source);
    const slugPart = removeMarkdownExtension(file);
    const title = parsed.data.title || titleize(slugPart);
    const slug = `portfolio/${slugPart}`;
    const url = `/${slug}/`;
    const body = transformGallery(normalizeBody(parsed.content), parsed.data.gallery || []);
    const tags = ensureArray(parsed.data.tags).map(String);
    const parsedLinks = buildLinks(body, slug);
    const explicitLinks = ensureArray(parsed.data.links)
      .map((value) => normalizeInternalLink(value, slug))
      .filter(Boolean);
    const frontmatterData = {
      title,
      description: parsed.data.excerpt || parsed.data.description || '',
      slug,
      contentType: 'portfolio',
      tags,
      pubDate: parsed.data.date || '2018-02-21',
      heroImage: parsed.data.header?.image,
      teaser: parsed.data.header?.teaser,
      sidebar: { hidden: true },
      graph: { visible: true },
    };
    entries.push(
      createContentEntry(path.join('generated', 'portfolio', `${slugPart}.mdx`), frontmatterData, body, {
        parsedLinks,
        explicitLinks,
      })
    );
    siteData.portfolio.push({
      title,
      url,
      slug,
      excerpt: parsed.data.excerpt || '',
      image: parsed.data.header?.teaser || parsed.data.header?.image || '',
      tags,
    });
  }
  return entries;
}

async function generatePages(siteData) {
  const entries = [];
  const files = (await readDirFiles(pagesRoot)).filter((name) => !pageExcludes.has(name));
  for (const file of files) {
    const source = await fs.readFile(path.join(pagesRoot, file), 'utf8');
    const parsed = matter(source);
    const permalink = parsed.data.permalink || `/${file.replace(/\.(md|mdx|html)$/, '')}/`;
    const slug = stripSlashes(permalink);
    const url = permalink.endsWith('/') ? permalink : `${permalink}/`;
    const frontmatterData = {
      title: parsed.data.title || slug,
      description: parsed.data.excerpt || '',
      slug,
      contentType: 'page',
      sidebar: { hidden: true },
      sitemap: { include: false },
    };
    const body = normalizeBody(parsed.content);
    entries.push(createContentEntry(path.join('generated', 'pages', `${slugify(slug || 'index')}.mdx`), frontmatterData, body));
    siteData.pages.push({
      title: parsed.data.title || slug,
      url,
      slug,
    });
  }
  return entries;
}

async function generateTil(siteData) {
  const entries = [];
  const tilRoot = path.join(root, 'today-i-learned');
  try {
    await fs.access(tilRoot);
  } catch {
    throw new Error(
      'today-i-learned submodule is missing. Run `git submodule update --init --recursive` before building.'
    );
  }
  const tilEntries = await fs.readdir(tilRoot, { withFileTypes: true });
  for (const dirent of tilEntries) {
    if (!dirent.isDirectory() || dirent.name.startsWith('.')) continue;
    const categoryName = dirent.name;
    const category = slugify(categoryName);
    const categoryDir = path.join(tilRoot, dirent.name);
    const files = (await readDirFiles(categoryDir)).filter(isMarkdownSourceFile);
    for (const file of files) {
      const source = await fs.readFile(path.join(categoryDir, file), 'utf8');
      const parsed = matter(source);
      const firstHeading = parsed.content.match(/^#*\s*(.+)$/m)?.[1]?.trim();
      const title = parsed.data.title || firstHeading || removeMarkdownExtension(file);
      const slugPart = removeMarkdownExtension(file);
      const slug = `today-i-learned/${category}/${slugPart}`;
      const url = `/${slug}/`;
      const body = normalizeBody(parsed.content);
      const parsedLinks = buildLinks(body, slug);
      const explicitLinks = ensureArray(parsed.data.links)
        .map((value) => normalizeInternalLink(value, slug))
        .filter(Boolean);
      const tags = [categoryName];
      const frontmatterData = {
        title,
        description: `${title} - Today I Learned`,
        slug,
        contentType: 'til',
        category: categoryName,
        tags,
        sidebar: { hidden: true },
        graph: { visible: true },
      };
      entries.push(
        createContentEntry(
          path.join('generated', 'today-i-learned', `${category}-${slugPart}.mdx`),
          frontmatterData,
          body,
          { parsedLinks, explicitLinks }
        )
      );
      siteData.til.push({
        title,
        url,
        slug,
        category: categoryName,
        categorySlug: category,
        tags,
      });
    }
  }
  return entries;
}

function groupBy(items, key) {
  const map = new Map();
  for (const item of items) {
    const value = item[key];
    if (!value) continue;
    if (!map.has(value)) map.set(value, []);
    map.get(value).push(item);
  }
  return [...map.entries()].map(([name, groupedItems]) => ({
    name,
    slug: slugify(name),
    count: groupedItems.length,
    items: groupedItems.sort((a, b) => (a.title > b.title ? 1 : -1)),
  }));
}

async function writeData(siteData) {
  const allTagItems = [...siteData.posts, ...siteData.portfolio, ...siteData.til].flatMap((item) =>
    (item.tags || []).map((tag) => ({ ...item, tag }))
  );
  siteData.categories = groupBy(siteData.posts, 'category');
  siteData.tags = groupBy(allTagItems, 'tag');
  siteData.tilCategories = groupBy(siteData.til, 'category');
  siteData.recentPosts = [...siteData.posts]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 6);
  await fs.writeFile(path.join(dataRoot, 'site-data.json'), JSON.stringify(siteData, null, 2), 'utf8');
}

async function main() {
  const siteData = { posts: [], portfolio: [], pages: [], til: [] };
  await resetGenerated();
  const generatedDocs = [
    ...(await generatePosts(siteData)),
    ...(await generatePortfolio(siteData)),
    ...(await generatePages(siteData)),
    ...(await generateTil(siteData)),
  ];
  await writeGeneratedDocs(generatedDocs);
  await writeData(siteData);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
