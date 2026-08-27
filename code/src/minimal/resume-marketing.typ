#import "../../template.typ": *

// 极简风格：市场 / 运营
#minimal-resume(
  name: "张三",
  meta: ("138-0000-0000", "zhangsan@example.com", "广州"),
)[
  #minimal-muted[五年品牌与增长运营经验，擅长从 0 到 1 搭建内容矩阵与私域运营体系。]

  #minimal-section("教育背景")
  #minimal-entry("某某大学", subtitle: "市场营销 · 本科", date: "2015 — 2019")

  #minimal-section("技能")
  #minimal-tags("内容策划", "私域运营", "数据分析", "项目管理", "Excel")

  #minimal-section("工作经历")
  #minimal-entry("某某消费品公司（虚构示例）", subtitle: "市场经理", date: "2022 — 至今")
  #minimal-bullets(
    "负责品牌全年营销日历规划与执行，年度曝光量突破 2 亿。",
    "搭建私域用户运营体系，复购率从 18% 提升至 31%。",
    "管理 5 人内容团队，统筹全渠道内容产出与投放预算。",
  )

  #minimal-entry("某某广告公司（虚构示例）", subtitle: "高级运营专员", date: "2019 — 2022")
  #minimal-bullets(
    "负责 3 个品牌客户的社媒代运营，累计涨粉 50 万+。",
    "策划年度大促活动，单场活动 GMV 超 800 万元。",
  )

  #minimal-section("荣誉")
  #minimal-entry("年度最佳营销案例奖", date: "2023")
  #minimal-entry("私域运营创新奖", subtitle: "行业协会颁发", date: "2022")

  #minimal-section("项目经历")
  #minimal-entry("私域会员体系搭建", subtitle: "项目负责人", date: "2023")
  #minimal-bullets(
    "从积分体系、会员权益到自动化触达流程的完整方案设计与落地。",
    "上线半年内会员规模突破 20 万，贡献销售额占比达 25%。",
  )
]
