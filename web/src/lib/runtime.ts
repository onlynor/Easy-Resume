// typst.ts 运行时：浏览器内编译器 + 渲染器的单例封装。
// 全部在本地运行：模板源码、字体、wasm 均来自本站静态资源，不上传任何内容。
import { createTypstCompiler, createTypstRenderer, loadFonts } from '@myriaddreamin/typst.ts';
import type { TypstCompiler, TypstRenderer } from '@myriaddreamin/typst.ts';
import { FONT_URLS } from './fonts';
import { loadBundle } from './bundle';
import type { TypstBundle } from './bundle';

// 编译器 wasm 约 28MB，超过 Cloudflare Pages 单文件 25MiB 上限：
// 构建时设置 VITE_TYPST_COMPILER_WASM_URL（如 jsdelivr CDN）则跳过本地打包、运行时从该 URL 加载；
// 未设置时使用 public/wasm/ 下的本地文件（GitHub Pages / 本地开发，全本地运行）。
const CDN_COMPILER_WASM_URL = (import.meta.env.VITE_TYPST_COMPILER_WASM_URL as string | undefined)?.trim();
const localWasmUrl = (name: string) => import.meta.env.BASE_URL + 'wasm/' + name;
const COMPILER_WASM_URL = CDN_COMPILER_WASM_URL ?? localWasmUrl('typst_ts_web_compiler_bg.wasm');
const RENDERER_WASM_URL = localWasmUrl('typst_ts_renderer_bg.wasm');

/** 编译时注入的输入，让模板切换到浏览器版字体候选表 */
export const WEB_INPUTS = { 'easy-resume-web': '1' };

export interface DiagMessage {
  text: string;
  isError: boolean;
}

export interface CompileOutcome {
  ok: boolean;
  /** vector 产物（预览用），失败时为 undefined */
  artifact?: Uint8Array;
  /** pdf 产物（导出用），失败时为 undefined */
  pdf?: Uint8Array;
  /** 诊断信息（错误 / 警告） */
  messages: DiagMessage[];
}

type ProgressFn = (stage: string, done: number, total: number) => void;

class TypstRuntime {
  private compiler: TypstCompiler | null = null;
  private renderer: TypstRenderer | null = null;
  private bundle: TypstBundle | null = null;
  private initPromise: Promise<void> | null = null;

  init(onProgress: ProgressFn) {
    if (!this.initPromise) {
      this.initPromise = this.doInit(onProgress);
    }
    return this.initPromise;
  }

  private async doInit(onProgress: ProgressFn) {
    onProgress('加载模板资源', 0, 3);
    this.bundle = await loadBundle();

    onProgress('初始化 Typst 编译器（约 10MB 运行时）', 1, 3);
    const compiler = createTypstCompiler();
    await compiler.init({
      beforeBuild: [
        // 不使用默认的远程字体资产，全部用本地打包的字体
        loadFonts([], { assets: false }),
        loadFonts(FONT_URLS, {
          fetcher: (url) => {
            onProgress('加载字体 ' + String(url).split('/').pop(), 2, 3);
            return fetch(url);
          },
        }),
      ],
      getWrapper: () => import('@myriaddreamin/typst-ts-web-compiler'),
      getModule: () => COMPILER_WASM_URL,
    });

    onProgress('初始化渲染器', 3, 3);
    const renderer = createTypstRenderer();
    await renderer.init({
      getWrapper: () => import('@myriaddreamin/typst-ts-renderer'),
      getModule: () => RENDERER_WASM_URL,
    });

    // 把打包的模板/图标源码灌进编译器虚拟文件系统
    // 编译器要求路径以 / 开头（root 为 "/"），统一补前缀
    for (const [path, content] of Object.entries(this.bundle.text)) {
      compiler.addSource(vpath(path), content);
    }
    for (const [path, b64] of Object.entries(this.bundle.binary)) {
      compiler.mapShadow(vpath(path), base64ToBytes(b64));
    }

    this.compiler = compiler;
    this.renderer = renderer;
  }

  /** 覆盖某个源文件（主文件在编译前调用） */
  setSource(path: string, source: string) {
    this.compiler?.addSource(vpath(path), source);
  }

  /** 读取打包的模板源文件 */
  getBundleText(path: string): string | undefined {
    return this.bundle?.text[path];
  }

  /** 写入一个二进制文件（如用户上传的照片） */
  setShadow(path: string, bytes: Uint8Array) {
    this.compiler?.mapShadow(vpath(path), bytes);
  }

  clearShadow(path: string) {
    this.compiler?.unmapShadow(vpath(path));
  }

  /** 编译并渲染到容器；返回诊断信息 */
  async compileAndRender(mainPath: string, source: string, container: HTMLElement): Promise<CompileOutcome> {
    if (!this.compiler || !this.renderer) throw new Error('Typst 运行时尚未初始化');
    this.compiler.addSource(vpath(mainPath), source);

    const outcome: CompileOutcome = { ok: false, messages: [] };

    const worldResult = await this.compiler.runWithWorld(
      { mainFilePath: vpath(mainPath), inputs: WEB_INPUTS },
      (world) => world.vector({ diagnostics: 'full' }),
    );
    const messages = extractMessages(worldResult);
    outcome.messages = messages;
    if (worldResult.result) {
      outcome.artifact = worldResult.result;
      outcome.ok = !hasErrors(messages);
      if (outcome.ok) {
        container.innerHTML = '';
        await this.renderer.renderToCanvas({
          container,
          artifactContent: worldResult.result,
          format: 'vector',
          backgroundColor: '#ffffff',
          pixelPerPt: 2.5,
        });
      }
    } else {
      outcome.ok = false;
    }
    return outcome;
  }

  /** 编译 PDF，返回字节；失败返回 null */
  async compilePdf(mainPath: string, source: string): Promise<Uint8Array | null> {
    if (!this.compiler) throw new Error('Typst 运行时尚未初始化');
    this.compiler.addSource(vpath(mainPath), source);
    const res = await this.compiler.runWithWorld(
      { mainFilePath: vpath(mainPath), inputs: WEB_INPUTS },
      (world) => world.pdf({ diagnostics: 'full' }),
    );
    if (!res.result) return null;
    const messages = extractMessages(res);
    if (hasErrors(messages)) return null;
    return res.result;
  }
}

export const runtime = new TypstRuntime();

function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

interface DiagLike {
  severity?: string;
  message?: string;
  range?: string;
}

function extractMessages(res: { diagnostics?: unknown[] }): DiagMessage[] {
  const raw = res.diagnostics ?? [];
  return raw.map((d) => {
    const x = d as DiagLike;
    if (typeof d === 'string') return { text: d, isError: d.startsWith('error') };
    if (x?.message) {
      const isError = x.severity === 'error' || x.message.startsWith('error');
      return { text: x.message, isError };
    }
    return { text: String(d), isError: false };
  });
}

function hasErrors(messages: DiagMessage[]): boolean {
  return messages.some((m) => m.isError);
}

function vpath(path: string): string {
  return path.startsWith('/') ? path : '/' + path;
}
