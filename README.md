# Easy Resume

用 [Typst](https://typst.app) 写的中文简历模板，单栏高密度风格（蓝色分区标题、浅灰经历条、STAR 式要点）。

## 快速开始

1. 安装 Typst：`cargo install typst-cli`（或参考 [typst.app](https://typst.app) 官方文档）。
2. 编辑根目录的 **`resume.typ`**，把里面的占位内容换成你自己的信息。
3. 在项目根目录执行：

   ```bash
   typst compile resume.typ resume.pdf
   ```

   生成的 `resume.pdf` 就是成品。用 VS Code + [Tinymist](https://marketplace.visualstudio.com/items?itemName=myriad-dreamin.tinymist) 插件打开可以实时预览（`Ctrl+K V`）。

> `.typ` 是源码，不是 PDF，双击打不开、必须编译。`resume.typ` 只有函数调用没有 PDF 效果是正常的，编译后看 `resume.pdf`。

## 还有别的风格 / 示例

`code/` 目录下是完整的设计系统 + 更多示例：

- `code/template.typ`：三套风格的组件库（根目录 `resume.typ` 用的是其中"单栏高密度"这一套，无前缀函数）。侧栏卡片风格用 `sidebar-` 前缀，极简风格用 `minimal-` 前缀。
- `code/src/<风格>/*.typ`：10 份分行业 / 分风格的示例简历源码，`code/examples/` 是对应编译产物。想看某个风格长什么样、或者想复制一份改，去这里找。

编译 `code/` 下的文件时要在项目根目录加 `--root .`，例如：

```bash
typst compile --root . code/src/dense/resume-electronics.typ code/examples/dense/resume-electronics.pdf
```

图标在 `code/icons/` 下按用途分类（`ui/` 界面图标、`tech/` 技术栈 Logo、`engineering/` 工程工具 Logo、`companies/` 企业 Logo、`school/` 高校校徽、`competitions/` 竞赛 Logo、`certificates/` 雅思 / 托福等证书 Logo 等），没有可靠对应品牌 Logo 时用纯文字（比如计算机二级 / 英语四六级 / 普通话证书这类没有专属 Logo 的证书），不要拿相近品牌图标顶替。
