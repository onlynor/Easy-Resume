// 模板注册表：对应 typst-bundle.json 里的虚拟文件路径
export type StyleKind = 'dense' | 'sidebar' | 'minimal';

export interface TemplateDef {
  id: string;
  /** 模板文件在虚拟文件系统中的路径 */
  path: string;
  label: string;
  style: StyleKind;
  styleLabel: string;
  desc: string;
  /** 是否为默认 resume.typ（支持参数表单） */
  formEnabled: boolean;
}

export const STYLES: { kind: StyleKind; label: string; desc: string }[] = [
  { kind: 'dense', label: '单栏高密度', desc: '蓝色分区标题 + 灰条经历 + STAR 要点，信息密度最高' },
  { kind: 'sidebar', label: '侧栏卡片', desc: '两栏布局，侧栏放技能条 / 教育 / 奖项' },
  { kind: 'minimal', label: '极简黑白', desc: '纯黑白灰，不用图标 / 照片，靠字重留白' },
];

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'dense',
    path: 'resume.typ',
    label: '默认模板（空内容）',
    style: 'dense',
    styleLabel: '单栏高密度',
    desc: '根目录 resume.typ，最通用，右侧表单可直接改参数与联系方式。',
    formEnabled: true,
  },
  {
    id: 'dense-general',
    path: 'code/src/dense/resume-general.typ',
    label: '通用岗位示例',
    style: 'dense',
    styleLabel: '单栏高密度',
    desc: '不预设行业，适合任何专业直接改内容。',
    formEnabled: true,
  },
  {
    id: 'dense-electronics',
    path: 'code/src/dense/resume-electronics.typ',
    label: '电子信息 · 硬件工程师',
    style: 'dense',
    styleLabel: '单栏高密度',
    desc: '硬件结构方向示例，带 AutoCAD / 仿真工具图标。',
    formEnabled: true,
  },
  {
    id: 'dense-chemistry',
    path: 'code/src/dense/resume-chemistry.typ',
    label: '化学 / 材料方向',
    style: 'dense',
    styleLabel: '单栏高密度',
    desc: '化学材料方向示例。',
    formEnabled: true,
  },
  {
    id: 'dense-education',
    path: 'code/src/dense/resume-education.typ',
    label: '教育 / 师范方向',
    style: 'dense',
    styleLabel: '单栏高密度',
    desc: '教育师范方向示例。',
    formEnabled: true,
  },
  {
    id: 'dense-civil',
    path: 'code/src/dense/resume-civil-engineering.typ',
    label: '土木工程方向',
    style: 'dense',
    styleLabel: '单栏高密度',
    desc: '土木工程方向示例。',
    formEnabled: true,
  },
  {
    id: 'sidebar-frontend',
    path: 'code/src/sidebar/resume-frontend.typ',
    label: '前端工程师示例',
    style: 'sidebar',
    styleLabel: '侧栏卡片',
    desc: '侧栏技能条 + 时间线，适合技术岗。',
    formEnabled: false,
  },
  {
    id: 'sidebar-hardware',
    path: 'code/src/sidebar/resume-hardware.typ',
    label: '硬件工程师示例',
    style: 'sidebar',
    styleLabel: '侧栏卡片',
    desc: '硬件方向侧栏示例。',
    formEnabled: false,
  },
  {
    id: 'minimal-marketing',
    path: 'code/src/minimal/resume-marketing.typ',
    label: '市场 / 运营示例',
    style: 'minimal',
    styleLabel: '极简黑白',
    desc: '市场运营方向极简示例。',
    formEnabled: false,
  },
  {
    id: 'minimal-designer',
    path: 'code/src/minimal/resume-designer.typ',
    label: '设计师示例',
    style: 'minimal',
    styleLabel: '极简黑白',
    desc: '设计师方向极简示例。',
    formEnabled: false,
  },
];

export function getTemplate(id: string): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0]!;
}
