import { useCallback, useEffect, useRef, useState } from 'react';
import Toolbar from './components/Toolbar';
import ParamsPanel from './components/ParamsPanel';
import SourceEditor from './components/SourceEditor';
import Preview from './components/Preview';
import type { CompileStatus } from './components/Preview';
import { getTemplate } from './data/templates';
import { runtime } from './lib/runtime';
import { downloadBytes, downloadText } from './lib/utils';

type Tab = 'params' | 'source';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [progress, setProgress] = useState('初始化…');

  const [templateId, setTemplateId] = useState('dense');
  const [src, setSrc] = useState('');
  const [tab, setTab] = useState<Tab>('params');
  const [status, setStatus] = useState<CompileStatus>({ status: 'idle', messages: [] });
  const [exporting, setExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const compileSeq = useRef(0);

  // 左侧编辑区宽度（桌面端可拖动分隔栏调整）
  const [leftWidth, setLeftWidth] = useState(440);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const onDividerPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startWidth: leftWidth };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDividerPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const next = Math.min(760, Math.max(300, d.startWidth + (e.clientX - d.startX)));
    setLeftWidth(next);
  };
  const onDividerPointerUp = () => {
    dragRef.current = null;
  };

  const template = getTemplate(templateId);

  // 初始化运行时（字体 + wasm + 模板资源，全部本地）
  useEffect(() => {
    let alive = true;
    runtime
      .init((stage) => setProgress(stage))
      .then(() => {
        if (!alive) return;
        const initial = runtime.getBundleText('resume.typ') ?? '';
        setSrc(initial);
        setBooted(true);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        console.error(err);
        setBootError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      alive = false;
    };
  }, []);

  // 切换模板 → 载入对应源码
  const handleSelectTemplate = useCallback(
    (id: string) => {
      setTemplateId(id);
      const t = getTemplate(id);
      const source = runtime.getBundleText(t.path);
      if (source !== undefined) setSrc(source);
    },
    [],
  );

  // 防抖编译 + 渲染
  useEffect(() => {
    if (!booted || !src) return;
    const seq = ++compileSeq.current;
    setStatus({ status: 'compiling', messages: [] });
    const timer = setTimeout(async () => {
      const container = previewRef.current;
      if (!container) return;
      try {
        const outcome = await runtime.compileAndRender(template.path, src, container);
        if (seq !== compileSeq.current) return; // 已被更新的编译取代
        setStatus(
          outcome.ok
            ? { status: 'ok', messages: outcome.messages }
            : { status: 'error', messages: outcome.messages },
        );
      } catch (err) {
        if (seq !== compileSeq.current) return;
        console.error(err);
        setStatus({
          status: 'error',
          messages: [{ text: err instanceof Error ? err.message : String(err), isError: true }],
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [booted, src, template]);

  const handleExportPdf = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const pdf = await runtime.compilePdf(template.path, src);
      if (pdf) {
        downloadBytes(pdf, 'resume.pdf', 'application/pdf');
      } else {
        alert('导出失败：编译未通过，请先修复预览中的错误。');
      }
    } catch (err) {
      console.error(err);
      alert(`导出失败：${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadSource = () => {
    downloadText(src, 'resume.typ');
  };

  return (
    <div className="relative flex h-full flex-col bg-slate-100">
      <Toolbar
        template={template}
        onSelect={handleSelectTemplate}
        onExportPdf={handleExportPdf}
        onDownloadSource={handleDownloadSource}
        exporting={exporting}
      />

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* 左侧编辑区 */}
        <aside
          style={{ '--left-w': `${leftWidth}px` } as React.CSSProperties}
          className="flex w-full shrink-0 flex-col bg-white md:w-(--left-w)"
        >
          <div className="flex shrink-0 border-b border-slate-200 text-sm">
            {(
              [
                ['params', '参数'],
                ['source', '源码'],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative px-4 py-2.5 text-slate-600 transition-colors ${
                  tab === id ? 'font-medium text-blue-700' : 'hover:text-slate-900'
                }`}
              >
                {label}
                {tab === id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded bg-blue-600" />}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {tab === 'params' ? (
              <ParamsPanel template={template} src={src} onChange={setSrc} />
            ) : (
              <SourceEditor value={src} onChange={setSrc} />
            )}
          </div>
          <div className="shrink-0 border-t border-slate-100 px-4 py-1.5 text-[11px] text-slate-400">
            编辑会同步更新源码与预览，导出 PDF 与预览一致
          </div>
        </aside>

        {/* 可拖动分隔栏（桌面端） */}
        <div
          className="hidden w-1.5 shrink-0 cursor-col-resize touch-none select-none bg-slate-200 transition-colors hover:bg-blue-400 active:bg-blue-500 md:block"
          onPointerDown={onDividerPointerDown}
          onPointerMove={onDividerPointerMove}
          onPointerUp={onDividerPointerUp}
          onPointerCancel={onDividerPointerUp}
          title="拖动调整左右宽度"
        />

        {/* 右侧预览 */}
        <main className="min-h-0 flex-1">
          <Preview status={status} containerRef={previewRef} />
        </main>
      </div>

      {/* 加载遮罩 */}
      {!booted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-slate-900/95 text-white">
          <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm">{bootError ? '初始化失败' : progress}</p>
          {bootError && (
            <div className="max-w-md rounded-lg bg-red-500/20 p-3 text-center text-xs text-red-200">
              {bootError}
              <p className="mt-2">
                首次加载需要下载约 30MB 运行时（字体 + WebAssembly），请检查网络后刷新重试。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
