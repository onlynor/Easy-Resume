# Easy Resume

用 [Typst](https://typst.app) 写的中文简历模板 + 在线编辑器，引用**阿酥高密度技术履历风格**：单栏排版、蓝色分区标题、浅灰经历条和 STAR 式项目要点。

排版与信息组织风格参考 [ASu-skills](https://github.com/Hisn00w/ASu-skills) 及相关高密度简历生成思路，本项目为独立的 Typst 模板实现。

## 快速开始（命令行）

1. 安装 Typst：`cargo install typst-cli`，或参考 [Typst 官方文档](https://typst.app)。
2. 编辑根目录的 `resume.typ`，替换为自己的信息。
3. 在项目根目录执行：

```bash
typst compile resume.typ resume.pdf
```

生成的 `resume.pdf` 即为成品。

推荐使用 VS Code + [Tinymist](https://marketplace.visualstudio.com/items?itemName=myriad-dreamin.tinymist) 实时预览。

## 在线编辑器（web/）

`web/` 是一个 Vite + React + Tailwind CSS 前端项目，**在浏览器里完整跑 Typst**：

- 模板（三套风格 + 示例）左侧切换，右侧实时预览（与 PDF 一致）
- 「参数」标签：改姓名 / 主题色 / 字号 / 页边距 / 照片 / 联系方式（meta 结构化编辑）
- 「源码」标签：直接改 Typst 源码，带语法高亮
- 一键导出 PDF、下载 .typ 源码
- **全程本地运行**：模板、字体、WebAssembly 都来自静态资源，简历内容不上传任何服务器

### 本地开发

```bash
cd web
npm install
npm run dev        # 会自动重新生成 public/typst-bundle.json
```

生产构建：

```bash
cd web
npm run build      # 输出到 web/dist
```

### 部署到 GitHub Pages

仓库已配置 GitHub Actions（`.github/workflows/deploy.yml`）：推送到 `main` 分支自动构建并部署到
`https://onlynor.github.io/easy-resume/`（在仓库 Settings → Pages 里把 Source 选为
「GitHub Actions」即可，无需手动开 gh-pages 分支）。

构建产物全部使用相对路径，同一份 `web/dist` 也可以直接放进 VPS 上任意子路径的 Nginx / Docker，
不需要重新构建。

> 字体说明：浏览器版需要的字体已子集化打包在 `web/public/fonts/`（CJK 按 GB2312 常用字
> 子集化，每字重 ~3–4MB），无需联网下载。想重新生成可执行 `cd web && npm run fonts`
> （需要 `uv` 和网络）。

## 其他风格与示例

`code/` 目录包含完整设计系统和更多示例：

* `code/template.typ`：三套风格组件库
* `code/src/<风格>/`：不同岗位 / 风格的示例源码
* `code/examples/`：对应编译产物

编译 `code/` 下的文件时需指定项目根目录：

```bash
typst compile --root . code/src/dense/resume-electronics.typ code/examples/dense/resume-electronics.pdf
```

图标位于 `code/icons/`，按 `ui`、`tech`、`engineering`、`companies`、`school`、`competitions`、`certificates` 等分类；没有可靠官方 Logo 时使用纯文字，不使用相近品牌图标替代。
