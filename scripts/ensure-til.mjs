import path from 'node:path';
import { ensureTil } from './lib/scaffold.mjs';

try {
  ensureTil(path.resolve('today-i-learned'));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
