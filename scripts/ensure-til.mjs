import fs from 'node:fs';
import path from 'node:path';

const tilRoot = path.resolve('today-i-learned');
const populated = fs.existsSync(path.join(tilRoot, 'git')) || fs.existsSync(path.join(tilRoot, 'python'));

if (!fs.existsSync(tilRoot) || !populated) {
  console.error(
    'today-i-learned submodule is missing or empty.\nRun: git submodule update --init --recursive',
  );
  process.exit(1);
}
