// 浏览器端 typst 使用的字体清单（web/public/fonts/ 下，均已提交）
// 与 code/template.typ 中 web-only 字体候选表对应：
//   正文拉丁 Libertinus Serif / 正文中文 Noto Serif CJK SC
//   标题中文 Noto Sans CJK SC / 侧栏拉丁 Noto Sans / 等宽 DejaVu Sans Mono

export const FONT_FILES = [
  'LibertinusSerif-Regular.otf',
  'LibertinusSerif-Bold.otf',
  'LibertinusSerif-Italic.otf',
  'LibertinusSerif-BoldItalic.otf',
  'LibertinusSerif-Semibold.otf',
  'LibertinusSerif-SemiboldItalic.otf',
  'DejaVuSansMono.ttf',
  'DejaVuSansMono-Bold.ttf',
  'NotoSans-Regular.ttf',
  'NotoSans-Bold.ttf',
  'NotoSansCJKsc-Regular.otf',
  'NotoSansCJKsc-Bold.otf',
  'NotoSerifCJKsc-Regular.otf',
  'NotoSerifCJKsc-Bold.otf',
];

export const FONT_URLS = FONT_FILES.map((f) => import.meta.env.BASE_URL + 'fonts/' + f);
