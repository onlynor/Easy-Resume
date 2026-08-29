// resume.typ 源码的轻量参数读写：
// 在 `#show: doc => resume( ... )` 调用块内，按顶层参数做定位/替换，
// 保证"表单改参数"和"源码手改"始终作用于同一份文本。
//
// 设计约束：解析器不追求完整的 Typst 语法，只处理 resume() 调用的顶层结构，
// 遇到无法解析的 meta 块会返回失败，由 UI 回退到原文编辑。

export interface Param {
  name: string;
  /** 值在源码中的起始偏移（跳过前导空白） */
  from: number;
  /** 值结束偏移（不含结尾逗号） */
  to: number;
}

export interface ResumeCall {
  /** '(' 的偏移 */
  open: number;
  /** ')' 的偏移（不含） */
  close: number;
}

/** 找到 `#show: doc => resume(` 的调用范围 */
export function findResumeCall(src: string): ResumeCall | null {
  const re = /#show\s*:\s*[\w.]+(?:\([^)]*\))?\s*=>\s*resume\s*\(/g;
  let best: ResumeCall | null = null;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const open = m.index + m[0].lastIndexOf('(');
    const close = matchParen(src, open);
    if (close !== -1) best = { open, close };
  }
  return best;
}

function matchParen(src: string, open: number): number {
  let depth = 0;
  let inStr = false;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** 解析 resume() 调用内的顶层参数 */
export function parseParams(src: string, call: ResumeCall): Param[] {
  const params: Param[] = [];
  let cur: { name: string; start: number } | null = null;
  let depth = 0;
  let inStr = false;
  let i = call.open + 1;
  const end = call.close;

  while (i < end) {
    const c = src[i]!;
    if (inStr) {
      if (c === '\\') i += 2;
      else if (c === '"') {
        inStr = false;
        i++;
      } else i++;
      continue;
    }
    if (c === '"') {
      inStr = true;
      i++;
      continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      i = nl === -1 ? end : nl + 1;
      continue;
    }
    if (c === '(' || c === '[' || c === '{') {
      depth++;
      i++;
      continue;
    }
    if (c === ')' || c === ']' || c === '}') {
      if (depth > 0) depth--;
      i++;
      continue;
    }
    if (depth === 0) {
      if (c === ',') {
        if (cur) {
          params.push({ name: cur.name, from: cur.start, to: trimEnd(src, cur.start, i) });
          cur = null;
        }
        i++;
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        const rest = src.slice(i, end);
        const m = /^[A-Za-z_][A-Za-z0-9_]*\s*:/.exec(rest);
        if (m && !cur) {
          const colon = i + m[0].lastIndexOf(':');
          const start = skipWs(src, colon + 1, end);
          cur = { name: m[0].slice(0, m[0].indexOf(':')).trim(), start };
          i = start;
          continue;
        }
      }
    }
    i++;
  }
  if (cur) params.push({ name: cur.name, from: cur.start, to: trimEnd(src, cur.start, end) });
  return params;
}

function skipWs(src: string, from: number, end: number): number {
  let i = from;
  while (i < end && /\s/.test(src[i]!)) i++;
  return i;
}

function trimEnd(src: string, from: number, to: number): number {
  let i = to;
  while (i > from && /\s/.test(src[i - 1]!)) i--;
  return i;
}

export function findParam(src: string, name: string): Param | null {
  const call = findResumeCall(src);
  if (!call) return null;
  return parseParams(src, call).find((p) => p.name === name) ?? null;
}

/** 设置参数值；不存在时插到 resume( 之后 */
export function setParam(src: string, name: string, value: string): string {
  const existing = findParam(src, name);
  if (existing) return src.slice(0, existing.from) + value + src.slice(existing.to);
  const call = findResumeCall(src);
  if (!call) return src;
  const insertAt = call.open + 1;
  return src.slice(0, insertAt) + `\n  ${name}: ${value},` + src.slice(insertAt);
}

/** 删除某个参数（整行） */
export function removeParam(src: string, name: string): string {
  const p = findParam(src, name);
  if (!p) return src;
  const lineStart = src.lastIndexOf('\n', p.from - 1) + 1;
  let lineEnd = src.indexOf('\n', p.to);
  if (lineEnd === -1) lineEnd = src.length;
  return src.slice(0, lineStart) + src.slice(lineEnd + 1);
}

// ---------- meta 结构化编辑 ----------

export interface MetaItem {
  icon: string;
  text: string;
  /** 有值则生成 link(url, text) */
  link?: string;
  strong?: boolean;
}

export type MetaRow = MetaItem[];

export interface MetaParseResult {
  ok: boolean;
  rows?: MetaRow[];
  /** meta 参数的值区间（用于整体替换） */
  from?: number;
  to?: number;
  error?: string;
}

/** 解析 resume() 里的 meta 参数；meta 缺失时返回 { ok: false } */
export function parseMeta(src: string): MetaParseResult {
  const p = findParam(src, 'meta');
  if (!p) return { ok: false, error: '源码中未找到 meta 参数，可先插入默认值' };
  const value = src.slice(p.from, p.to);
  if (!value.trim().startsWith('(')) {
    return { ok: false, error: 'meta 不是数组结构，请在源码中直接编辑', from: p.from, to: p.to };
  }
  try {
    const rows: MetaRow[] = [];
    for (const rowText of splitTopLevel(stripOuterParens(value))) {
      const row: MetaRow = [];
      for (const itemText of splitTopLevel(stripOuterParens(rowText))) {
        const item = parseItem(itemText);
        if (!item) {
          return {
            ok: false,
            error: `meta 中的条目无法解析：${itemText.trim().slice(0, 60)}…（请在源码中直接编辑）`,
            from: p.from,
            to: p.to,
          };
        }
        row.push(item);
      }
      rows.push(row);
    }
    return { ok: true, rows, from: p.from, to: p.to };
  } catch (e) {
    return { ok: false, error: `meta 解析失败：${(e as Error).message}`, from: p.from, to: p.to };
  }
}

/** 去掉最外层一对括号，返回内部内容 */
function stripOuterParens(text: string): string {
  const t = text.trim();
  if (!t.startsWith('(')) return t;
  let depth = 0;
  let inStr = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (c === '\\') i++;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === '(') depth++;
    else if (c === ')') {
      depth--;
      if (depth === 0) return t.slice(1, i);
    }
  }
  return t;
}

/** 按"括号内顶层"逗号切分（用于 meta 的行/条目/字段） */
function splitTopLevel(text: string): string[] {
  let depth = 0;
  let inStr = false;
  const parts: string[] = [];
  let cur = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      cur += c;
      if (c === '\\') {
        cur += text[i + 1] ?? '';
        i++;
      } else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      cur += c;
      continue;
    }
    if (c === '(' || c === '[' || c === '{') {
      depth++;
      cur += c;
      continue;
    }
    if (c === ')' || c === ']' || c === '}') {
      if (depth > 0) depth--;
      cur += c;
      continue;
    }
    if (c === ',' && depth === 0) {
      parts.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  if (cur.trim()) parts.push(cur);
  return parts.filter((p) => p.trim());
}

function parseItem(text: string): MetaItem | null {
  const inner = stripOuterParens(text);
  const item: MetaItem = { icon: 'icons/ui/user.svg', text: '' };
  let foundContent = false;
  for (const field of splitTopLevel(inner)) {
    const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/s.exec(field.trim());
    if (!m) continue;
    const key = m[1]!;
    const raw = m[2]!;
    if (key === 'icon') {
      const s = parseString(raw);
      if (s !== null) item.icon = s;
    } else if (key === 'content') {
      const linkM = /^link\s*\(\s*"([^"]*)"\s*,\s*"([^"]*)"\s*\)$/s.exec(raw.trim());
      if (linkM) {
        item.link = linkM[1]!;
        item.text = linkM[2]!;
      } else {
        const s = parseString(raw);
        if (s !== null) item.text = s;
      }
      foundContent = true;
    } else if (key === 'strong') {
      item.strong = raw.trim() === 'true';
    }
  }
  return foundContent ? item : null;
}

function parseString(raw: string): string | null {
  const m = /^"((?:[^"\\]|\\.)*)"$/s.exec(raw.trim());
  if (!m) return null;
  return m[1]!
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t');
}

function escapeString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
}

function serializeItem(it: MetaItem): string {
  const parts = [`icon: "${it.icon}"`];
  const content = it.link
    ? `link("${escapeString(it.link)}", "${escapeString(it.text)}")`
    : `"${escapeString(it.text)}"`;
  parts.push(`content: ${content}`);
  if (it.strong) parts.push('strong: true');
  return `(${parts.join(', ')})`;
}

/** 由 rows 生成 meta 参数值（不含 "meta:" 前缀） */
export function serializeMeta(rows: MetaRow[]): string {
  const rowTexts = rows.map(
    (row) => `(\n      ${row.map((it) => serializeItem(it)).join(',\n      ')},\n    )`,
  );
  return `(\n    ${rowTexts.join(',\n    ')},\n  )`;
}

/** 替换源码中的 meta 参数 */
export function setMeta(src: string, rows: MetaRow[]): string {
  const cur = parseMeta(src);
  const value = serializeMeta(rows);
  if (cur.ok && cur.from !== undefined && cur.to !== undefined) {
    return src.slice(0, cur.from) + value + src.slice(cur.to);
  }
  return setParam(src, 'meta', value);
}

/** 表单用的默认 meta（对应模板初始内容） */
export function defaultMeta(): MetaRow[] {
  return [
    [
      { icon: 'icons/ui/phone.svg', text: '手机号码' },
      { icon: 'icons/ui/envelope.svg', text: 'you@example.com', link: 'mailto:you@example.com' },
      { icon: 'icons/ui/wechat.svg', text: '微信号' },
    ],
    [{ icon: 'icons/ui/user.svg', text: '身份 · 目标岗位 · 到岗时间', strong: true }],
    [{ icon: 'icons/ui/github.svg', text: 'github.com/yourname' }],
  ];
}

// ---------- 表单读取 ----------

export function parseStringValue(raw: string): string | null {
  return parseString(raw);
}

export interface DenseParams {
  name?: string;
  /** 十六进制（不带 #） */
  accent?: string;
  /** pt */
  size?: number;
  margin?: { top?: number; bottom?: number; left?: number; right?: number };
  photo?: string;
}

/** 从源码读取 resume() 的常用参数（供表单初始化） */
export function readDenseParams(src: string): DenseParams {
  const out: DenseParams = {};
  const name = findParam(src, 'name');
  if (name) {
    const s = parseString(src.slice(name.from, name.to));
    if (s !== null) out.name = s;
  }
  const accent = findParam(src, 'accent');
  if (accent) {
    const m = /#([0-9a-fA-F]{6})/.exec(src.slice(accent.from, accent.to));
    if (m) out.accent = m[1]!;
  }
  const size = findParam(src, 'size');
  if (size) {
    const m = /([0-9.]+)\s*pt/.exec(src.slice(size.from, size.to));
    if (m) out.size = parseFloat(m[1]!);
  }
  const margin = findParam(src, 'margin');
  if (margin) {
    const v = src.slice(margin.from, margin.to);
    const g = (k: string) => {
      const m = new RegExp(`${k}\\s*:\\s*([0-9.]+)\\s*cm`).exec(v);
      return m ? parseFloat(m[1]!) : undefined;
    };
    out.margin = { top: g('top'), bottom: g('bottom'), left: g('left'), right: g('right') };
  }
  const photo = findParam(src, 'photo');
  if (photo) {
    const s = parseString(src.slice(photo.from, photo.to));
    if (s !== null) out.photo = s;
  }
  return out;
}
