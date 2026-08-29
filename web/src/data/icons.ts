// meta 编辑器可选的 ui 图标（对应 code/icons/ui/*.svg）
export interface IconOption {
  path: string;
  label: string;
}

export const UI_ICONS: IconOption[] = [
  { path: 'icons/ui/phone.svg', label: '手机' },
  { path: 'icons/ui/envelope.svg', label: '邮箱' },
  { path: 'icons/ui/wechat.svg', label: '微信' },
  { path: 'icons/ui/qq.svg', label: 'QQ' },
  { path: 'icons/ui/github.svg', label: 'GitHub' },
  { path: 'icons/ui/x.svg', label: 'X / Twitter' },
  { path: 'icons/ui/zhihu.svg', label: '知乎' },
  { path: 'icons/ui/juejin.svg', label: '掘金' },
  { path: 'icons/ui/user.svg', label: '用户 / 身份' },
  { path: 'icons/ui/location.svg', label: '地点' },
  { path: 'icons/ui/work.svg', label: '工作' },
  { path: 'icons/ui/code.svg', label: '代码' },
  { path: 'icons/ui/wrench.svg', label: '技能' },
  { path: 'icons/ui/award.svg', label: '奖项' },
  { path: 'icons/ui/star.svg', label: '星标' },
  { path: 'icons/ui/graduation-cap.svg', label: '学位' },
  { path: 'icons/ui/building-columns.svg', label: '学校' },
];

/** 强调色预设（与模板 palette 风格接近的常用色） */
export const ACCENT_PRESETS = [
  '#2458b8', // 模板默认蓝
  '#1f7a5c', // 电子示例绿
  '#3b4d8f', // 通用示例靛蓝
  '#2455a4', // 侧栏示例蓝
  '#8a2be2',
  '#c0392b',
  '#d97706',
  '#0f766e',
  '#334155',
  '#b91c1c',
  '#111827',
];
