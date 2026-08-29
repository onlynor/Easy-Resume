// 生成 web/public/fonts/ 下的字体资产（已提交到仓库，日常构建不需要重跑）。
//
// 运行：npm run fonts
// 依赖：
//   - uv（用于临时拉取 fonttools 做 pyftsubset 子集化，只处理 CJK 字体）
//   - 网络（下载 Noto CJK / Google Fonts / typst-assets 字体）
//
// 说明：
//   - 浏览器内 typst（fontdb）只支持 ttf/otf（sfnt），不支持 woff/woff2，因此全部用原始格式。
//   - Noto CJK 是 CID-keyed CFF，harfbuzz 子集会丢掉轮廓，必须用 fonttools 的 pyftsubset。
//   - CJK 子集化到 GB2312（一级+二级 ≈ 7445 字）+ ASCII/Latin-1/常用符号，覆盖简历实际用字，
//     体积从 ~16MB/24MB 压缩到 ~3MB/~4MB 每字重。
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..');
const outDir = join(webRoot, 'public', 'fonts');
mkdirSync(outDir, { recursive: true });

const TMP = '/tmp/easy-resume-fonts';
mkdirSync(TMP, { recursive: true });

// ---------- 下载 ----------

const TYPST_ASSETS = 'https://cdn.jsdelivr.net/gh/typst/typst-assets@v0.13.1/files/fonts';
const NOTO_CJK = (kind, name) =>
  `https://github.com/notofonts/noto-cjk/raw/main/${kind}/OTF/SimplifiedChinese/${name}`;

const downloads = [
  // 拉丁正文（Libertinus Serif，Times New Roman 免费替代）
  ...[
    'LibertinusSerif-Regular.otf',
    'LibertinusSerif-Bold.otf',
    'LibertinusSerif-Italic.otf',
    'LibertinusSerif-BoldItalic.otf',
    'LibertinusSerif-Semibold.otf',
    'LibertinusSerif-SemiboldItalic.otf',
  ].map((f) => ({ url: `${TYPST_ASSETS}/${f}`, out: f })),
  // 等宽
  { url: `${TYPST_ASSETS}/DejaVuSansMono.ttf`, out: 'DejaVuSansMono.ttf' },
  { url: `${TYPST_ASSETS}/DejaVuSansMono-Bold.ttf`, out: 'DejaVuSansMono-Bold.ttf' },
  // 侧栏风格拉丁无衬线（Noto Sans）
  {
    url: 'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf',
    out: 'NotoSans-Regular.ttf',
  },
  {
    url: 'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAaBN9d.ttf',
    out: 'NotoSans-Bold.ttf',
  },
  // CJK 全量（用于子集化）
  { url: NOTO_CJK('Sans', 'NotoSansCJKsc-Regular.otf'), out: 'src-NotoSansCJKsc-Regular.otf' },
  { url: NOTO_CJK('Sans', 'NotoSansCJKsc-Bold.otf'), out: 'src-NotoSansCJKsc-Bold.otf' },
  { url: NOTO_CJK('Serif', 'NotoSerifCJKsc-Regular.otf'), out: 'src-NotoSerifCJKsc-Regular.otf' },
  { url: NOTO_CJK('Serif', 'NotoSerifCJKsc-Bold.otf'), out: 'src-NotoSerifCJKsc-Bold.otf' },
];

function download(url, dest) {
  if (existsSync(dest) && readFileSync(dest).length > 0) {
    console.log(`  [skip] ${dest}（已存在）`);
    return;
  }
  console.log(`  [get]  ${url}`);
  // 用 curl 而不是 fetch：有 --retry 且能处理大文件
  execFileSync('curl', ['-fsSL', '--retry', '3', '-o', dest, url], { stdio: 'inherit' });
}

for (const d of downloads) download(d.url, join(TMP, d.out));

// ---------- 生成 GB2312 + 常用符号子集 ----------

function gb2312Chars() {
  const out = [];
  for (let hi = 0xa1; hi <= 0xf7; hi++) {
    for (let lo = 0xa1; lo <= 0xfe; lo++) {
      try {
        out.push(new TextDecoder('gb2312').decode(new Uint8Array([hi, lo])));
      } catch {
        /* 非法码位跳过 */
      }
    }
  }
  return out.join('');
}

function rangesToChars(ranges) {
  let s = '';
  for (const [a, b] of ranges) for (let c = a; c <= b; c++) s += String.fromCodePoint(c);
  return s;
}

const charset =
  rangesToChars([
    [0x20, 0x7e], // ASCII
    [0xa0, 0xff], // Latin-1
    [0x2000, 0x206f], // 通用标点
    [0x3000, 0x303f], // CJK 标点
    [0xff00, 0xffef], // 全角
  ]) +
  gb2312Chars() +
  '·—…《》【】“”‘’〈〉￥';

const charsetFile = join(TMP, 'charset.txt');
writeFileSync(charsetFile, charset);
console.log(`子集字符数：${[...charset].length}`);

// ---------- pyftsubset ----------

function pyftsubset(src, dest) {
  execFileSync(
    'uvx',
    [
      '--from',
      'fonttools',
      'pyftsubset',
      src,
      `--text-file=${charsetFile}`,
      `--output-file=${dest}`,
      '--no-hinting',
      '--drop-tables+=DSIG',
    ],
    { stdio: 'inherit' },
  );
}

const cjk = [
  ['src-NotoSansCJKsc-Regular.otf', 'NotoSansCJKsc-Regular.otf'],
  ['src-NotoSansCJKsc-Bold.otf', 'NotoSansCJKsc-Bold.otf'],
  ['src-NotoSerifCJKsc-Regular.otf', 'NotoSerifCJKsc-Regular.otf'],
  ['src-NotoSerifCJKsc-Bold.otf', 'NotoSerifCJKsc-Bold.otf'],
];

for (const [srcName, outName] of cjk) {
  const src = join(TMP, srcName);
  const dest = join(outDir, outName);
  console.log(`[subset] ${outName}`);
  pyftsubset(src, dest);
}

// ---------- 拷贝非子集字体 ----------

for (const d of downloads) {
  if (d.out.startsWith('src-')) continue;
  const src = join(TMP, d.out);
  const dest = join(outDir, d.out);
  if (existsSync(dest) && readFileSync(src).equals(readFileSync(dest))) continue; // 已是最新
  writeFileSync(dest, readFileSync(src));
}

// ---------- 汇总 ----------

const files = readdirSync(outDir).filter((f) => statSync(join(outDir, f)).isFile());
const total = files.reduce((s, f) => s + statSync(join(outDir, f)).size, 0);
console.log(`\n[fonts] ${files.length} 个文件 → public/fonts/（共 ${(total / 1e6).toFixed(1)} MB）`);
