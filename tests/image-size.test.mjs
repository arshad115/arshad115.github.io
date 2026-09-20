import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { imageSize, sizeFromBuffer } from '../src/lib/image-size.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

test('sizeFromBuffer reads PNG IHDR dimensions', () => {
  const png = Buffer.from(
    '89504e470d0a1a0a0000000d494844520000000a00000014080100000000',
    'hex',
  );
  assert.deepEqual(sizeFromBuffer(png), { width: 10, height: 20 });
});

test('imageSize reads a real public asset', () => {
  const file = path.join(root, 'public/assets/images/bio-photo.jpg');
  assert.equal(fs.existsSync(file), true);
  const size = imageSize('/assets/images/bio-photo.jpg');
  assert.ok(size?.width && size.width > 0);
  assert.ok(size?.height && size.height > 0);
});
