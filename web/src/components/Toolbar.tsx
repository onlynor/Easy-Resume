// 顶部工具栏：模板选择 + 导出
import type { TemplateDef } from '../data/templates';
import { STYLES, TEMPLATES } from '../data/templates';

interface Props {
  template: TemplateDef;
  onSelect: (id: string) => void;
  onExportPdf: () => void;
  onDownloadSource: () => void;
  exporting: boolean;
}

export default function Toolbar({ template, onSelect, onExportPdf, onDownloadSource, exporting }: Props) {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white">
          履
        </div>
        <div className="leading-tight">
          <h1 className="text-sm font-semibold text-slate-800">Easy Resume</h1>
          <p className="text-[11px] text-slate-400">浏览器内 Typst 简历编辑 · 本地编译</p>
        </div>
      </div>

      <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

      <label className="flex items-center gap-2 text-sm">
        <span className="text-xs text-slate-500">模板</span>
        <select
          value={template.id}
          onChange={(e) => onSelect(e.target.value)}
          className="max-w-[260px] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
        >
          {STYLES.map((s) => (
            <optgroup key={s.kind} label={s.label}>
              {TEMPLATES.filter((t) => t.style === s.kind).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 md:inline">
        {template.styleLabel}
      </span>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onDownloadSource}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:border-slate-400 hover:text-slate-800"
        >
          下载 .typ
        </button>
        <button
          onClick={onExportPdf}
          disabled={exporting}
          className="rounded-md bg-blue-700 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {exporting ? '导出中…' : '导出 PDF'}
        </button>
        <a
          href="https://github.com/onlynor/Easy-Resume"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-slate-600"
          title="GitHub 仓库"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
