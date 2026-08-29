// 预览区：容纳 typst 渲染出的画布，并展示编译状态/诊断
import { forwardRef } from 'react';
import type { DiagMessage } from '../lib/runtime';

export interface CompileStatus {
  status: 'idle' | 'compiling' | 'ok' | 'error';
  messages: DiagMessage[];
}

interface Props {
  status: CompileStatus;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const Preview = forwardRef<HTMLDivElement, Props>(function Preview({ status, containerRef }, _ref) {
  const errors = status.messages.filter((m) => m.isError);
  const warnings = status.messages.filter((m) => !m.isError);

  return (
    <div className="relative h-full w-full bg-slate-200/70">
      <div className="absolute inset-0 overflow-auto">
        <div className="mx-auto flex min-h-full w-fit flex-col items-center gap-4 p-6">
          <div
            ref={containerRef}
            className="shadow-[0_4px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
          />
          <p className="pb-4 text-xs text-slate-400">A4 · 预览与实际 PDF 一致</p>
        </div>
      </div>

      {status.status === 'compiling' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm text-slate-600 shadow">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            编译中…
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 max-h-[40%] overflow-auto border-t border-red-200 bg-red-50/95 p-4">
          <p className="mb-2 text-sm font-semibold text-red-700">
            编译错误（{errors.length}）
          </p>
          <ul className="space-y-1.5 font-mono text-xs text-red-800">
            {errors.map((e, i) => (
              <li key={i} className="whitespace-pre-wrap break-all">{e.text}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="absolute inset-x-0 top-0 border-b border-amber-200 bg-amber-50/90 p-2 text-xs text-amber-800">
          {warnings.map((w, i) => (
            <p key={i} className="whitespace-pre-wrap break-all">{w.text}</p>
          ))}
        </div>
      )}
    </div>
  );
});

export default Preview;
