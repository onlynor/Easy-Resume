// 通用工具：下载、防抖

/**
 * 获取可能带 gzip 预压缩的资源：先试 url + '.gz'，再回退原始 url。
 * 兼容两类服务器：
 *  - 原样下发 .gz（GitHub Pages 等）→ 检测 gzip 魔数（1f 8b）后手动 DecompressionStream 解压
 *  - 自动解压（vite preview 会加 Content-Encoding: gzip）→ 拿到的已是解压后的字节，直接使用
 */
export async function fetchMaybeGz(url: string): Promise<Uint8Array> {
  const gzRes = await fetch(url + '.gz');
  if (gzRes.ok) {
    const buf = new Uint8Array(await gzRes.arrayBuffer());
    if (buf.length >= 2 && buf[0] === 0x1f && buf[1] === 0x8b) {
      return decompressGzip(buf);
    }
    return buf;
  }
  const raw = await fetch(url);
  if (!raw.ok) throw new Error(`HTTP ${raw.status}: ${url}`);
  return new Uint8Array(await raw.arrayBuffer());
}

async function decompressGzip(buf: Uint8Array): Promise<Uint8Array> {
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  const stream = new Blob([ab]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export function downloadBytes(bytes: Uint8Array, filename: string, mime: string) {
  const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], {
    type: mime,
  });
  downloadBlob(blob, filename);
}

export function downloadText(text: string, filename: string, mime = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([text], { type: mime }), filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const wrapped = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  wrapped.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  return wrapped;
}

/** 把任意图片文件转成 PNG dataURL（用于照片上传，统一格式） */
export function fileToPngDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('无法创建画布'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片解析失败'));
    };
    img.src = url;
  });
}

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? '';
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** 去掉 hex 颜色前的 # */
export function normalizeHex(hex: string): string {
  return hex.replace(/^#/, '').toUpperCase();
}
