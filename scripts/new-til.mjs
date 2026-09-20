#!/usr/bin/env node
/**
 * Scaffold a TIL note in the today-i-learned submodule.
 *
 *   ./scripts/new-til.sh "Title" git
 *   ./scripts/new-til.sh "Title" git --template --readme
 *   npm run new:til -- "Title" git
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as stdinStream, stdout as stdoutStream } from 'node:process';
import {
  assertSafeSegment,
  buildTilMarkdown,
  existingTilCategories,
  parseArgs,
  repoRoot,
  slugify,
  writeNewFile,
} from './lib/scaffold.mjs';

const USAGE = `Create a TIL note as today-i-learned/<category>/<slug>.md (YAML title; no body H1).

Usage:
  ./scripts/new-til.sh "Title" category [options]
  npm run new:til -- "Title" category [options]
  npm run new:til

Options:
  --body TEXT       Initial markdown body (otherwise YAML title and a blank note)
  --template        Include Summary / Details / Example / References stubs
  --slug SLUG       Filename without .md (default: from title)
  --readme          Run today-i-learned/update_readme.py after creating the note
  --force           Overwrite if the file exists
  --open            Open the file after creating it
  -h, --help        Show this help

With no title/category and a TTY, prompts interactively. Commit inside the
submodule, then bump the pointer with npm run update:til.`;

function ensureTil(tilRoot) {
  const populated =
    fs.existsSync(path.join(tilRoot, 'git')) || fs.existsSync(path.join(tilRoot, 'python'));
  if (!fs.existsSync(tilRoot) || !populated) {
    throw new Error(
      'today-i-learned submodule is missing or empty.\nRun: git submodule update --init --recursive',
    );
  }
}

function openFile(filepath) {
  const bin = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  spawn(bin, [filepath], { detached: true, stdio: 'ignore' }).unref();
}

async function promptMissing(flags, tilRoot) {
  if (!stdinStream.isTTY) return flags;
  const rl = readline.createInterface({ input: stdinStream, output: stdoutStream });
  try {
    const categories = existingTilCategories(tilRoot);
    if (categories.length) {
      stdoutStream.write(`Existing categories: ${categories.join(', ')}\n`);
    }
    const title = flags._[0] || (await rl.question('TIL title: ')).trim();
    const category = flags._[1] || (await rl.question('Category: ')).trim();
    const templateAnswer = flags.template
      ? 'y'
      : (await rl.question('Use section template? [y/N]: ')).trim().toLowerCase();
    return {
      ...flags,
      _: [title, category].filter(Boolean),
      template: flags.template || templateAnswer === 'y' || templateAnswer === 'yes',
    };
  } finally {
    rl.close();
  }
}

function updateReadme(tilRoot) {
  const script = path.join(tilRoot, 'update_readme.py');
  if (!fs.existsSync(script)) {
    console.error('update_readme.py not found in the submodule; skipped --readme.');
    return;
  }
  const result = spawnSync('python3', [script], { cwd: tilRoot, stdio: 'inherit' });
  if (result.error || result.status !== 0) {
    throw new Error('update_readme.py failed. Create the note succeeded; fix README separately.');
  }
}

async function main() {
  let flags = parseArgs(process.argv.slice(2));
  if (flags.help || flags.h) {
    stdoutStream.write(`${USAGE}\n`);
    return;
  }

  const root = repoRoot();
  const tilRoot = path.join(root, 'today-i-learned');
  ensureTil(tilRoot);

  if (!flags._[0] || !flags._[1]) {
    if (!stdinStream.isTTY) {
      stdoutStream.write(`${USAGE}\n`);
      process.exit(1);
    }
    flags = await promptMissing(flags, tilRoot);
  }

  const title = flags._[0]?.trim();
  const category = flags._[1]?.trim();
  if (!title || !category) {
    console.error('Title and category are required.');
    process.exit(1);
  }

  const slug = String(flags.slug || slugify(title));
  if (!slug) {
    console.error('Could not build a slug from the title. Pass --slug.');
    process.exit(1);
  }
  assertSafeSegment(slug, 'slug');
  assertSafeSegment(category, 'category');

  const filepath = path.join(tilRoot, category, `${slug}.md`);
  const markdown = buildTilMarkdown({
    title,
    body: flags.body ? String(flags.body) : '',
    template: Boolean(flags.template),
  });

  writeNewFile(filepath, markdown, { force: Boolean(flags.force) });

  const rel = path.relative(root, filepath);
  stdoutStream.write(`Created ${rel}\n`);
  stdoutStream.write(`URL: /today-i-learned/${category}/${slug}/\n`);
  stdoutStream.write('Commit the note in the submodule, then npm run update:til.\n');

  if (flags.readme) updateReadme(tilRoot);
  if (flags.open) openFile(filepath);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
