#!/usr/bin/env node
/**
 * Scaffold a blog post under content/posts/ (or content/drafts/ with --draft).
 *
 *   ./scripts/new-post.sh "Title"
 *   ./scripts/new-post.sh "Title" --category development --tags "go,cli"
 *   ./scripts/new-post.sh "Title" --draft
 *   npm run new:post -- "Title"
 */

import path from 'node:path';
import { spawn } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as stdinStream, stdout as stdoutStream } from 'node:process';
import {
  assertSafeSegment,
  buildPostMarkdown,
  parseArgs,
  parseTags,
  repoRoot,
  slugify,
  todayLocal,
  writeNewFile,
} from './lib/scaffold.mjs';
import { categorySlug } from '../src/lib/paths.mjs';
import { CATEGORY_SLUGS, isKnownCategory } from '../src/lib/taxonomy.mjs';

const USAGE = `Create a post as content/posts/YYYY-MM-DD-slug.md.

Usage:
  ./scripts/new-post.sh "Title" [options]
  npm run new:post -- "Title" [options]
  npm run new:post

Options:
  --category NAME     Frontmatter slug (default: development). Must be a known slug; Title Case is stored lowercase.
  --tags a,b,c        Comma-separated tags
  --excerpt TEXT      One-line listing excerpt
  --header PATH       header.image, e.g. /assets/images/posts/foo.jpg
  --alt TEXT          header.alt (required when --header is set; defaults to the title)
  --slug SLUG         Filename slug after the date (default: from title)
  --date YYYY-MM-DD   Filename and date: (default: today, local)
  --draft             Write under content/drafts/ instead of content/posts/
  --force             Overwrite if the file exists
  --open              Open the file after creating it
  -h, --help          Show this help

With no title and a TTY, prompts interactively. The slug after the date is the
public URL path: /{category}/{slug}/`;

async function promptMissing(flags) {
  if (!stdinStream.isTTY) return flags;
  const rl = readline.createInterface({ input: stdinStream, output: stdoutStream });
  try {
    stdoutStream.write(`Categories: ${CATEGORY_SLUGS.join(', ')}\n`);
    const title = flags._[0] || (await rl.question('Post title: ')).trim();
    const category =
      flags.category ||
      (await rl.question('Category [development]: ')).trim() ||
      'development';
    const tags = flags.tags ?? (await rl.question('Tags (comma-separated, optional): ')).trim();
    const excerpt = flags.excerpt ?? (await rl.question('Excerpt (optional): ')).trim();
    const header = flags.header ?? (await rl.question('Header image path (optional): ')).trim();
    const alt =
      flags.alt ||
      (header ? (await rl.question(`Header alt [${title}]: `)).trim() : '');
    const draftAnswer = flags.draft
      ? 'y'
      : (await rl.question('Save as draft? [y/N]: ')).trim().toLowerCase();
    return {
      ...flags,
      _: title ? [title] : [],
      category,
      tags,
      excerpt,
      header,
      alt,
      draft: flags.draft || draftAnswer === 'y' || draftAnswer === 'yes',
    };
  } finally {
    rl.close();
  }
}

function openFile(filepath) {
  const bin = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  spawn(bin, [filepath], { detached: true, stdio: 'ignore' }).unref();
}

async function main() {
  let flags = parseArgs(process.argv.slice(2));
  if (flags.help || flags.h) {
    stdoutStream.write(`${USAGE}\n`);
    return;
  }

  if (!flags._[0]) {
    if (!stdinStream.isTTY) {
      stdoutStream.write(`${USAGE}\n`);
      process.exit(1);
    }
    flags = await promptMissing(flags);
  }

  const title = flags._[0]?.trim();
  if (!title) {
    console.error('Title is required.');
    process.exit(1);
  }

  const date = flags.date ? String(flags.date) : todayLocal();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`--date must be YYYY-MM-DD, got ${date}`);
    process.exit(1);
  }

  const root = repoRoot();
  const requested = String(flags.category || 'development').trim() || 'development';
  const category = categorySlug(requested) || 'development';
  if (!isKnownCategory(category)) {
    console.error(`Unknown category ${JSON.stringify(requested)}. Use one of: ${CATEGORY_SLUGS.join(', ')}`);
    process.exit(1);
  }
  const slug = String(flags.slug || slugify(title));
  if (!slug) {
    console.error('Could not build a slug from the title. Pass --slug.');
    process.exit(1);
  }
  assertSafeSegment(slug, 'slug');

  const filename = `${date}-${slug}.md`;
  const destDir = flags.draft ? path.join(root, 'content/drafts') : path.join(root, 'content/posts');
  const filepath = path.join(destDir, filename);
  const markdown = buildPostMarkdown({
    title,
    excerpt: flags.excerpt ? String(flags.excerpt).trim() : '',
    date,
    category,
    tags: parseTags(flags.tags),
    headerImage: flags.header ? String(flags.header).trim() : '',
    headerAlt: flags.alt ? String(flags.alt).trim() : title,
  });

  writeNewFile(filepath, markdown, { force: Boolean(flags.force) });

  const categoryPath = category.toLowerCase();
  const rel = path.relative(root, filepath);
  stdoutStream.write(`Created ${rel}\n`);
  if (flags.draft) {
    stdoutStream.write('Drafts are not published. Move the file to content/posts/ when ready.\n');
  } else {
    stdoutStream.write(`URL: /${categoryPath}/${slug}/\n`);
  }

  if (flags.open) openFile(filepath);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
