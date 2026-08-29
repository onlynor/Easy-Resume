// 联系方式（meta）结构化编辑器：多行 × 每行多个条目
import type { MetaItem, MetaRow } from '../lib/params';
import { UI_ICONS } from '../data/icons';

interface Props {
  rows: MetaRow[];
  onChange: (rows: MetaRow[]) => void;
}

function updateItem(rows: MetaRow[], ri: number, ii: number, patch: Partial<MetaItem>): MetaRow[] {
  return rows.map((row, r) =>
    r !== ri ? row : row.map((it, i) => (i !== ii ? it : { ...it, ...patch })),
  );
}

export default function MetaEditor({ rows, onChange }: Props) {
  const updateRow = (ri: number, row: MetaRow) =>
    onChange(rows.map((r, i) => (i === ri ? row : r)));

  return (
    <div className="space-y-3">
      {rows.map((row, ri) => (
        <div key={ri} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">第 {ri + 1} 行（同一行用「|」分隔）</span>
            <button
              onClick={() => onChange(rows.filter((_, i) => i !== ri))}
              className="text-xs text-slate-400 hover:text-red-500"
            >
              删除此行
            </button>
          </div>
          <div className="space-y-2">
            {row.map((item, ii) => (
              <div key={ii} className="rounded-md border border-slate-200 bg-white p-2">
                <div className="flex items-center gap-2">
                  <select
                    value={item.icon}
                    onChange={(e) => onChange(updateItem(rows, ri, ii, { icon: e.target.value }))}
                    className="rounded border border-slate-300 px-1.5 py-1 text-xs"
                    title="图标"
                  >
                    {UI_ICONS.map((ic) => (
                      <option key={ic.path} value={ic.path}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={item.text}
                    onChange={(e) => onChange(updateItem(rows, ri, ii, { text: e.target.value }))}
                    placeholder="内容"
                    className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                  />
                  <label className="flex shrink-0 items-center gap-1 text-xs text-slate-500" title="加粗">
                    <input
                      type="checkbox"
                      checked={!!item.strong}
                      onChange={(e) => onChange(updateItem(rows, ri, ii, { strong: e.target.checked }))}
                    />
                    加粗
                  </label>
                  <button
                    onClick={() =>
                      updateRow(
                        ri,
                        row.filter((_, i) => i !== ii),
                      )
                    }
                    className="shrink-0 text-slate-400 hover:text-red-500"
                    title="删除条目"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <label className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={!!item.link}
                      onChange={(e) =>
                        onChange(updateItem(rows, ri, ii, { link: e.target.checked ? 'https://' : undefined }))
                      }
                    />
                    链接
                  </label>
                  {item.link !== undefined && (
                    <input
                      value={item.link}
                      onChange={(e) => onChange(updateItem(rows, ri, ii, { link: e.target.value }))}
                      placeholder="https://… 或 mailto:…"
                      className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1 text-xs"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() =>
              updateRow(ri, [...row, { icon: 'icons/ui/user.svg', text: '' }])
            }
            className="mt-2 text-xs text-blue-600 hover:text-blue-800"
          >
            + 添加条目
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...rows, [{ icon: 'icons/ui/user.svg', text: '' }]])}
        className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs text-slate-500 hover:border-blue-400 hover:text-blue-600"
      >
        + 添加一行
      </button>
    </div>
  );
}
