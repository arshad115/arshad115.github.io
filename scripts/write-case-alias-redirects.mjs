#!/usr/bin/env node
/**
 * Write HTML redirects for live URLs that differ from the canonical path only
 * by case. Skip when the filesystem cannot hold both paths (typical macOS).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { caseAliasRedirects } from './legacy-url-redirects.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

function distIndex(urlPath) {
  const parts = urlPath.replace(/\/+$/, '').split('/').filter(Boolean);
  return path.join(distDir, ...parts, 'index.html');
}

function redirectHtml(to) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Redirecting to: ${to}</title>
    <meta http-equiv="refresh" content="0;url=${to}">
    <link rel="canonical" href="${to}">
  </head>
  <body>
    <a href="${to}">Redirecting to ${to}</a>
  </body>
</html>
`;
}

function sameFile(a, b) {
  try {
    const left = fs.statSync(a);
    const right = fs.statSync(b);
    return left.dev === right.dev && left.ino === right.ino;
  } catch {
    return false;
  }
}

let written = 0;
let skipped = 0;

for (const [from, to] of Object.entries(caseAliasRedirects)) {
  const canonical = distIndex(to);
  const alias = distIndex(from);
  if (!fs.existsSync(canonical)) {
    console.warn(`skip ${from}: missing canonical ${to}`);
    skipped += 1;
    continue;
  }

  fs.mkdirSync(path.dirname(alias), { recursive: true });
  if (sameFile(canonical, alias) || sameFile(path.dirname(canonical), path.dirname(alias))) {
    console.warn(`skip ${from}: filesystem cannot store a case-only alias`);
    skipped += 1;
    continue;
  }

  fs.writeFileSync(alias, redirectHtml(to));
  written += 1;
}

console.log(`case-alias redirects: wrote ${written}, skipped ${skipped}`);
