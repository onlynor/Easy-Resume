// 参数表单：直接改写 resume.typ 源码中 resume() 调用的参数
import { useEffect, useMemo, useRef, useState } from 'react';
import type { TemplateDef } from '../data/templates';
import { ACCENT_PRESETS } from '../data/icons';
import {
  parseMeta,
  readDenseParams,
  removeParam,
  setMeta,
  setParam,
  defaultMeta,
  type MetaRow,
} from '../lib/params';
import { dataUrlToBytes, fileToPngDataUrl } from '../lib/utils';
import { runtime } from '../lib/runtime';
import MetaEditor from './MetaEditor';

interface Props {
  template: TemplateDef;
  src: string;
  onChange: (next: string) => void;
}

export default function ParamsPanel({ template, src, onChange }: Props) {
  const params = useMemo(() => readDenseParams(src), [src]);
  const meta = useMemo(() => parseMeta(src), [src]);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // 切换模板时清掉本地照片预览
  useEffect(() => setPhoto(null), [template.id]);

  const set = (name: string, value: string) => onChange(setParam(src, name, value));

  if (!template.formEnabled) {
    return (
      <div className="p-4 text-sm text-slate-500">
        <p className="mb-2">
          该模板（<span className="font-medium text-slate-700">{template.label}</span>）不是默认的
          <code className="mx-1 rounded bg-slate-100 px-1">resume.typ</code>
          结构，参数请在「源码」标签里直接修改。
        </p>
        <p className="text-xs text-slate-400">
          切换回「默认模板」即可使用参数表单 + 联系方式编辑器。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-4">
      {/* 基本参数 */}
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">基本参数</h3>
        <div className="space-y-3">
          <Field label="姓名">
            <input
              value={params.name ?? ''}
              onChange={(e) => set('name', JSON.stringify(e.target.value))}
              placeholder="你的姓名"
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </Field>

          <Field label="主题色">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={'#' + (params.accent ?? '2458b8')}
                onChange={(e) => set('accent', `rgb("#${e.target.value.slice(1)}")`)}
                className="h-8 w-12 cursor-pointer rounded border border-slate-300 bg-white"
              />
              <span className="font-mono text-xs text-slate-500">
                #{params.accent ?? '2458b8'}
              </span>
              <div className="flex flex-wrap gap-1">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    onClick={() => set('accent', `rgb("#${c.slice(1)}")`)}
                    style={{ background: c }}
                    className={`h-6 w-6 rounded-full border ${
                      (params.accent ?? '').toLowerCase() === c.slice(1)
                        ? 'border-slate-800 ring-2 ring-blue-300'
                        : 'border-slate-200'
                    }`}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </Field>

          <Field label="正文字号（pt）">
            <input
              type="number"
              min={7}
              max={14}
              step={0.1}
              value={params.size ?? 10}
              onChange={(e) => set('size', `${parseFloat(e.target.value) || 10}pt`)}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm"
            />
          </Field>

          <Field label="页边距（cm）">
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  ['top', '上'],
                  ['bottom', '下'],
                  ['left', '左'],
                  ['right', '右'],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="flex flex-col gap-1 text-xs text-slate-400">
                  {label}
                  <input
                    type="number"
                    min={0}
                    max={3}
                    step={0.05}
                    value={params.margin?.[k] ?? ''}
                    placeholder={k === 'top' || k === 'bottom' ? '0.65' : '1.1'}
                    onChange={(e) => {
                      const cur = params.margin ?? { top: 0.65, bottom: 0.65, left: 1.1, right: 1.1 };
                      const next = { ...cur, [k]: parseFloat(e.target.value) || 0 };
                      set(
                        'margin',
                        `(top: ${next.top}cm, bottom: ${next.bottom}cm, left: ${next.left}cm, right: ${next.right}cm)`,
                      );
                    }}
                    className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                  />
                </label>
              ))}
            </div>
          </Field>
        </div>
      </section>

      {/* 照片 */}
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">照片（可选）</h3>
        <div className="flex items-center gap-3">
          {photo ? (
            <img src={photo} alt="照片预览" className="h-16 w-12 rounded border border-slate-200 object-cover" />
          ) : (
            <div className="flex h-16 w-12 items-center justify-center rounded border border-dashed border-slate-300 text-[10px] text-slate-300">
              无照片
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (!f) return;
                try {
                  const dataUrl = await fileToPngDataUrl(f);
                  setPhoto(dataUrl);
                  // image(photo) 在 code/template.typ 的 resume() 内执行，
                  // 相对路径按 template.typ 所在目录 /code/ 解析，shadow 必须存到 /code/photo.png
                  runtime.setShadow('code/photo.png', dataUrlToBytes(dataUrl));
                  onChange(setParam(src, 'photo', '"photo.png"'));
                } catch (err) {
                  alert(`照片解析失败：${(err as Error).message}`);
                }
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:border-blue-400 hover:text-blue-600"
            >
              上传照片
            </button>
            {params.photo && (
              <button
                onClick={() => {
                  runtime.clearShadow('code/photo.png');
                  setPhoto(null);
                  onChange(removeParam(src, 'photo'));
                }}
                className="rounded-md px-3 py-1 text-xs text-slate-400 hover:text-red-500"
              >
                移除照片
              </button>
            )}
          </div>
          <p className="flex-1 text-xs leading-relaxed text-slate-400">
            会统一转成 PNG 写入虚拟文件系统并设置
            <code className="mx-0.5 rounded bg-slate-100 px-1">photo: "photo.png"</code>；不设照片则使用占位图。
          </p>
        </div>
      </section>

      {/* 联系方式 */}
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">联系方式</h3>
        {meta.ok && meta.rows ? (
          <>
            <MetaEditor
              rows={meta.rows}
              onChange={(rows: MetaRow[]) => onChange(setMeta(src, rows))}
            />
            {meta.rows.length === 0 && (
              <button
                onClick={() => onChange(setMeta(src, defaultMeta()))}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                插入默认联系方式
              </button>
            )}
          </>
        ) : (
          <RawMetaFallback src={src} meta={meta} onChange={onChange} />
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-500">{label}</span>
      {children}
    </label>
  );
}

/** meta 无法结构化解析时的原文编辑回退 */
function RawMetaFallback({
  src,
  meta,
  onChange,
}: {
  src: string;
  meta: { ok: boolean; from?: number; to?: number; error?: string };
  onChange: (next: string) => void;
}) {
  const [raw, setRaw] = useState<string>(() =>
    meta.from !== undefined && meta.to !== undefined ? src.slice(meta.from, meta.to) : '',
  );
  useEffect(() => {
    if (meta.from !== undefined && meta.to !== undefined) setRaw(src.slice(meta.from, meta.to));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <p className="mb-2 text-xs text-amber-600">{meta.error ?? 'meta 无法解析'}</p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={8}
        spellCheck={false}
        className="w-full rounded-md border border-slate-300 p-2 font-mono text-xs"
        placeholder="meta: ( ... )"
      />
      {meta.from !== undefined && meta.to !== undefined && (
        <button
          onClick={() => onChange(src.slice(0, meta.from) + raw + src.slice(meta.to))}
          className="mt-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
        >
          应用修改
        </button>
      )}
    </div>
  );
}
