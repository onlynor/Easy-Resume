# Easy Resume

用 [Typst](https://typst.app) 写的中文简历模板，引用**阿酥高密度技术履历风格**：单栏排版、蓝色分区标题、浅灰经历条和 STAR 式项目要点。

排版与信息组织风格参考 [ASu-skills](https://github.com/Hisn00w/ASu-skills) 及相关高密度简历生成思路，本项目为独立的 Typst 模板实现。

## 快速开始

1. 安装 Typst：`cargo install typst-cli`，或参考 [Typst 官方文档](https://typst.app)。
2. 编辑根目录的 `resume.typ`，替换为自己的信息。
3. 在项目根目录执行：

```bash
typst compile resume.typ resume.pdf
```

生成的 `resume.pdf` 即为成品。

推荐使用 VS Code + [Tinymist](https://marketplace.visualstudio.com/items?itemName=myriad-dreamin.tinymist) 实时预览。

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
