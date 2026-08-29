import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

const prune = [
  'typst-bundle.json',
  ...readdirSync(join(dist, 'wasm'))
    .filter((f) => f.endsWith('.wasm'))
    .map((f) => join('wasm', f)),
  ...readdirSync(join(dist, 'fonts'))
    .filter((f) => /\.(otf|ttf)$/.test(f))
    .map((f) => join('fonts', f)),
];

let removed = 0;
let pruned = 0;
for (const rel of prune) {
  const p = join(dist, rel);
  const gz = p + '.gz';
  if (!existsSync(gz)) {
    console.warn(`[prune] 警告：${rel} 没有对应的 .gz，跳过（构建可能不完整）`);
    continue;
  }
  if (existsSync(p)) {
    removed += statSync(p).size;
    rmSync(p);
    pruned++;
  }
}
console.log(`[prune] dist 清理 ${pruned} 个未压缩文件，省 ${(removed / 1048576).toFixed(1)} MB`);
