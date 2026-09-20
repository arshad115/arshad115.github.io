import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const SKIP_TIL_FILES = new Set([
  'README.md',
  'SCRIPT_README.md',
  'TIL_SCRIPTS_README.md',
]);

export function repoRoot() {
  if (process.env.BLOG_ROOT) return path.resolve(process.env.BLOG_ROOT);
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
}

export function todayLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Lowercase kebab slug for new files. */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function yamlScalar(value) {
  const text = String(value);
  if (
    text === '' ||
    /[:#,[\]{}&*!|>'"%@`]/.test(text) ||
    /^\s|\s$/.test(text) ||
    /^(true|false|null|yes|no|on|off|-)$/i.test(text) ||
    /^-?\d/.test(text)
  ) {
    return JSON.stringify(text);
  }
  return text;
}

export function parseArgs(argv) {
  const flags = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') continue;
    if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      const key = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
      if (eq !== -1) {
        flags[key] = arg.slice(eq + 1);
        continue;
      }
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = true;
      }
    } else if (arg.startsWith('-') && arg !== '-') {
      flags[arg.slice(1)] = true;
    } else {
      flags._.push(arg);
    }
  }
  return flags;
}

export function parseTags(input) {
  if (!input) return [];
  return String(input)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function assertSafeSegment(name, label) {
  if (!name || name === '.' || name === '..' || /[\\/]/.test(name)) {
    throw new Error(`${label} must be a single path segment, got: ${JSON.stringify(name)}`);
  }
}

export function existingTilCategories(tilRoot) {
  if (!fs.existsSync(tilRoot)) return [];
  return fs
    .readdirSync(tilRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.startsWith('_'))
    .filter((entry) => {
      const dir = path.join(tilRoot, entry.name);
      return fs.readdirSync(dir).some((file) => file.endsWith('.md') && !SKIP_TIL_FILES.has(file));
    })
    .map((entry) => entry.name)
    .sort();
}

export function buildPostMarkdown({ title, excerpt, date, category, tags, headerImage, headerAlt }) {
  const lines = ['---', `title: ${yamlScalar(title)}`];
  if (excerpt) lines.push(`excerpt: ${yamlScalar(excerpt)}`);
  lines.push(`date: ${date}`, `category: ${yamlScalar(category)}`);
  if (tags.length) {
    lines.push('tags:');
    for (const tag of tags) lines.push(`  - ${yamlScalar(tag)}`);
  }
  if (headerImage) {
    lines.push('header:', `  image: ${headerImage}`, `  alt: ${yamlScalar(headerAlt || title)}`);
  }
  lines.push('---', '', 'Opening paragraph.', '', '## Section', '', 'Body.', '');
  return lines.join('\n');
}

export function buildTilMarkdown({ title, body, template }) {
  const front = `---\ntitle: ${yamlScalar(title)}\n---\n\n`;
  if (body) return `${front}${body.replace(/^\s+/, '').replace(/\s+$/, '')}\n`;
  if (template) {
    return [
      `---`,
      `title: ${yamlScalar(title)}`,
      `---`,
      '',
      '## Summary',
      '',
      '',
      '## Details',
      '',
      '',
      '## Example',
      '',
      '```',
      '',
      '```',
      '',
      '## References',
      '',
      '- ',
      '',
    ].join('\n');
  }
  return `${front}`;
}

export function writeNewFile(filepath, contents, { force = false } = {}) {
  if (fs.existsSync(filepath) && !force) {
    throw new Error(`already exists: ${filepath}\nPass --force to overwrite.`);
  }
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, contents, 'utf8');
}
