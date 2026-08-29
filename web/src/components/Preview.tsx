// 预览区：容纳 typst 渲染出的画布，并展示编译状态/诊断
import { forwardRef, useEffect } from 'react';
import type { DiagMessage } from '../lib/runtime';

export interface CompileStatus {
  status: 'idle' | 'compiling' | 'ok' | 'error';
  messages: DiagMessage[];
}

interface Props {
  status: CompileStatus;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 与 typst 渲染器 RenderView.resetLayout 相同的适配算法：
 * 把每页 canvas（固有尺寸 = 页面pt × pixelPerPt）缩放铺满容器宽度。
 * 容器宽度变化（拖分隔栏 / 窗口缩放 / 滚动条出现）时调用。
 */
function fitContainer(container: HTMLElement) {
  const width = container.offsetWidth;
  if (!width) return;
  const pages = container.querySelectorAll<HTMLElement>('.typst-page');
  pages.forEach((page) => {
    const canvas = page.querySelector<HTMLCanvasElement>('canvas');
    const canvasDiv = canvas?.parentElement;
    const textLayer = page.querySelector<HTMLElement>('.typst-html-semantics');
    if (!canvas || !canvasDiv) return;
    const scale = width / canvas.width;
    canvasDiv.style.transformOrigin = '0px 0px';
    canvasDiv.style.transform = `scale(${scale})`;
    page.style.width = `${width}px`;
    page.style.height = `${canvas.height * scale}px`;
    if (textLayer) {
      textLayer.style.width = `${width}px`;
      textLayer.style.height = `${canvas.height * scale}px`;
    }
  });
}

const Preview = forwardRef<HTMLDivElement, Props>(function Preview({ status, containerRef }, _ref) {
  // 容器尺寸变化 → 重新适配 PDF（渲染器只在渲染时适配一次，尺寸变化后需我们自己处理）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => fitContainer(el));
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  // 每次编译渲染完成后，再补一次适配，确保与容器宽度一致
  useEffect(() => {
    if (status.status !== 'ok') return;
    const el = containerRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => fitContainer(el));
    return () => cancelAnimationFrame(id);
  }, [status.status, containerRef]);

  const errors = status.messages.filter((m) => m.isError);
  const warnings = status.messages.filter((m) => !m.isError);

  return (
    <div className="relative h-full w-full bg-slate-200/70">
      <div className="absolute inset-0 overflow-auto">
        {/* 容器必须有确定宽度（max-w 上限 + w-full），typst 渲染器按容器宽度适配页面；
            之前在 w-fit 上，容器 width:100% 与 fit-content 循环依赖，被量成极小宽度 */}
        <div className="mx-auto flex min-h-full w-full max-w-[1100px] flex-col items-center gap-4 p-6">
          <div
            ref={containerRef}
            className="w-full shadow-[0_4px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
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
