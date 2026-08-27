#import "../../template.typ": *

// 极简风格：产品设计师
#minimal-resume(
  name: "张三",
  meta: ("138-0000-0000", "zhangsan@example.com", "杭州"),
)[
  #minimal-muted[六年 To B 产品设计经验，专注企业级软件的体验设计与设计系统建设。]

  #minimal-section("教育背景")
  #minimal-entry("某某大学", subtitle: "工业设计 · 本科", date: "2014 — 2018")

  #minimal-section("技能")
  #minimal-tags("Figma", "Sketch", "Principle", "用户研究", "可用性测试")

  #minimal-section("工作经历")
  #minimal-entry("某某科技有限公司（虚构示例）", subtitle: "高级产品设计师", date: "2021 — 至今")
  #minimal-bullets(
    "主导核心产品设计系统从 0 到 1 建设，组件覆盖公司内 12 条业务线。",
    "推动设计走查流程标准化，需求返工率下降 35%。",
    "带领 2 名初级设计师完成 3 条主要业务线的体验重构。",
  )

  #minimal-entry("某某互联网公司（虚构示例）", subtitle: "产品设计师", date: "2018 — 2021")
  #minimal-bullets(
    "负责核心工作台产品的交互与视觉设计，日活跃用户超过 10 万。",
    "参与移动端适配项目，跨端组件复用率提升至 70%。",
  )

  #minimal-section("荣誉")
  #minimal-entry("公司年度最佳设计奖", date: "2023")
  #minimal-entry("部门创新提案大赛", subtitle: "一等奖", date: "2022")

  #minimal-section("项目经历")
  #minimal-entry("企业级设计系统", subtitle: "项目负责人", date: "2022 — 2023")
  #minimal-bullets(
    "从设计规范到组件库、图标库的完整体系搭建，产出设计文档 60+ 页。",
    "推动前端工程师协同落地，组件复用率从 40% 提升至 85%。",
  )
]
