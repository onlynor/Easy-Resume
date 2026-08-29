// typst-bundle.json 的类型定义（由 scripts/build-assets.mjs 生成）
export interface TypstBundle {
  generatedAt: string;
  text: Record<string, string>;
  binary: Record<string, string>; // base64
}

import { fetchMaybeGz } from './utils';

export async function loadBundle(): Promise<TypstBundle> {
  const url = import.meta.env.BASE_URL + 'typst-bundle.json';
  const bytes = await fetchMaybeGz(url);
  return JSON.parse(new TextDecoder().decode(bytes)) as TypstBundle;
}
