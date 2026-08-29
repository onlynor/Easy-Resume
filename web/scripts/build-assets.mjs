// 把仓库里的 Typst 模板、示例源码和图标打成一个 JSON，供浏览器端的虚拟文件系统加载。
// 运行：npm run assets（dev / build 前会自动跑一次）
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..');
const repoRoot = join(webRoot, '..');

const TEXT_EXT = new Set(['.typ', '.svg']);
const BINARY_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

/** 收集目录下所有文件，返回相对仓库根目录的 posix 路径 */
function walk(dir, out = []) {
  for (const name of readdirSync(dir).sort()) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const posix = (p) => relative(repoRoot, p).split(sep).join('/');
const extOf = (p) => {
  const i = p.lastIndexOf('.');
  return i < 0 ? '' : p.slice(i).toLowerCase();
};

const text = {};
const binary = {};

const add = (absPath) => {
  const ext = extOf(absPath);
  const key = posix(absPath);
  if (TEXT_EXT.has(ext)) text[key] = readFileSync(absPath, 'utf8');
  else if (BINARY_EXT.has(ext)) binary[key] = readFileSync(absPath).toString('base64');
};

add(join(repoRoot, 'resume.typ'));
add(join(repoRoot, 'code', 'template.typ'));
for (const f of walk(join(repoRoot, 'code', 'icons'))) add(f);
for (const f of walk(join(repoRoot, 'code', 'src'))) add(f);

const bundle = {
  generatedAt: new Date().toISOString(),
  text,
  binary,
};

mkdirSync(join(webRoot, 'public'), { recursive: true });
const outFile = join(webRoot, 'public', 'typst-bundle.json');
writeFileSync(outFile, JSON.stringify(bundle));

const bytes = statSync(outFile).size;
console.log(
  `[assets] ${Object.keys(text).length} 个文本文件 + ${Object.keys(binary).length} 个二进制文件 → ` +
    `public/typst-bundle.json (${(bytes / 1024 / 1024).toFixed(2)} MB)`,
);
