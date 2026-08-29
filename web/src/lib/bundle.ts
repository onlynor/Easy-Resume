// typst-bundle.json 的类型定义（由 scripts/build-assets.mjs 生成）
export interface TypstBundle {
  generatedAt: string;
  text: Record<string, string>;
  binary: Record<string, string>; // base64
}

export async function loadBundle(): Promise<TypstBundle> {
  const url = import.meta.env.BASE_URL + 'typst-bundle.json';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`加载 typst-bundle.json 失败：HTTP ${res.status}`);
  return (await res.json()) as TypstBundle;
}
