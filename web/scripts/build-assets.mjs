// 把仓库里的 Typst 模板、示例源码和图标打成一个 JSON，供浏览器端的虚拟文件系统加载。
// 运行：npm run assets（dev / build 前会自动跑一次）
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync, rmSync } from 'node:fs';
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

// ---- wasm 运行时资产：从 node_modules 复制到 public/wasm/ ----
// Cloudflare Pages 单文件上限 25 MiB，编译器 wasm 约 28MB 超限；
// 构建时设置 VITE_TYPST_COMPILER_WASM_URL 后跳过复制，运行时从该 URL（如 jsdelivr）加载。
const wasmOutDir = join(webRoot, 'public', 'wasm');
mkdirSync(wasmOutDir, { recursive: true });
const wasmFiles = [
  ['@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm', 'typst_ts_web_compiler_bg.wasm'],
  ['@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm', 'typst_ts_renderer_bg.wasm'],
];
for (const [rel, name] of wasmFiles) {
  const dest = join(wasmOutDir, name);
  if (name === 'typst_ts_web_compiler_bg.wasm' && process.env.VITE_TYPST_COMPILER_WASM_URL) {
    if (existsSync(dest)) rmSync(dest);
    console.log('[assets] 跳过编译器 wasm（VITE_TYPST_COMPILER_WASM_URL 已设置，运行时从 CDN 加载）');
    continue;
  }
  const src = join(webRoot, 'node_modules', rel);
  if (!existsSync(src)) throw new Error(`缺少 wasm 资源：${src}（请先 npm install）`);
  writeFileSync(dest, readFileSync(src));
  console.log(`[assets] wasm → public/wasm/${name}`);
}

const bytes = statSync(outFile).size;
console.log(
  `[assets] ${Object.keys(text).length} 个文本文件 + ${Object.keys(binary).length} 个二进制文件 → ` +
    `public/typst-bundle.json (${(bytes / 1024 / 1024).toFixed(2)} MB)`,
);
