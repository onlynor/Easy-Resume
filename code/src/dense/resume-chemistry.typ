#import "../../template.typ": *

// 单栏高密度风格版本：化学 / 材料科学（科研方向）
#show: doc => resume(
  size: 9.3pt,
  accent: rgb("#6b3fa0"),
  name: "张三",
  meta: (
    (
      (icon: "icons/ui/phone.svg", content: "138-0000-0000"),
      (icon: "icons/ui/envelope.svg", content: link("mailto:zhangsan@example.com", "zhangsan@example.com")),
      (icon: "icons/ui/wechat.svg", content: "zhangsan"),
    ),
    (
      (icon: "icons/ui/user.svg", content: "硕士在读 · 目标岗位：材料研发 / 化学工程师 · 可随时到岗", strong: true),
    ),
  ),
  doc,
)

#section("个人简介")
材料化学硕士在读，主持温敏水凝胶合成路线优化课题，将产率从 62% 提升至 89%；参与国家自然科学基金青年项目单体合成与表征工作，累计完成 30+ 批次实验，以第一作者发表论文 1 篇，熟悉 HPLC / GC-MS / NMR 联用分析与实验室规范操作。

#section("教育经历")
#entry-bar("某某大学", subtitle: "材料化学 · 硕士", meta: "2022.09 - 2025.06")
#entry-bar("某某大学", subtitle: "应用化学 · 本科", meta: "2018.09 - 2022.06")

#section("技能")
#tool-line(
  "有机合成与产物表征", "HPLC / GC-MS / NMR 联用分析", "实验室安全与规范操作",
  (icon: "icons/research/latex.svg", label: "LaTeX", fill: rgb("#008080")),
  "Origin 数据处理", "Excel", "文献检索与论文写作",
  (icon: "icons/certificates/toefl.svg", label: "托福 100", fill: rgb("#9195FF"), box-width: 2.3em),
)

#section("科研经历")

#entry-bar("某某大学高分子材料实验室", subtitle: "硕士研究生 · 课题负责人", meta: "2022.09 - 至今")
#project-title("Thermosensitive Hydrogel Synthesis", "温敏水凝胶合成路线优化")
#bullets(
  [*背景与目标：*课题组前期温敏水凝胶合成产率偏低（62%），批次间重复性差；*目标：*将产率提升至 85% 以上并稳定表征方法。],
  [*我的职责：*课题负责人，独立设计合成路线并完成表征方法搭建。],
  (level: 1, body: [*执行链路：*通过正交实验筛选单体配比与引发剂用量，结合 HPLC / NMR 联用表征反应进程。]),
  (level: 1, body: [*结果：*产率提升至 89%，表征周期从 3 天缩短至 1 天，方法沉淀为课题组标准流程。]),
)

#entry-bar("国家自然科学基金青年项目", subtitle: "核心参与者", meta: "2023.03 - 2024.12")
#project-title("功能单体合成与表征")
#bullets(
  [*背景与目标：*项目需要稳定批量制备高纯度功能单体，用于后续聚合反应验证。],
  [*我的职责：*负责单体合成与结构表征，累计完成 30+ 批次合成实验。],
  (level: 1, body: [*技术实现：*使用 GC-MS 进行产物纯度分析，建立杂质谱库辅助快速定性。]),
  (level: 1, body: [*结果：*协助撰写项目中期报告与结题报告中的实验部分。]),
)

#section("竞赛与荣誉")
#entry-bar("\"挑战杯\"课外学术科技作品竞赛", logo: "icons/competitions/challenge-cup.svg", subtitle: "省级一等奖", meta: "2021.11")
#entry-bar("国家奖学金", meta: "2023.10")
#entry-bar("校级优秀研究生", meta: "2024.06")

#section("学术产出")
#entry-bar("某材料期刊", subtitle: "第一作者", meta: "2024.05")
#bullets(
  [*Thermosensitive Hydrogel Synthesis and Characterization*，报道温敏水凝胶合成方法及性能优化，论文被引 5 次，方法被课题组后续两个项目采用。],
)
