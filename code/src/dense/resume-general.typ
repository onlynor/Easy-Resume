#import "../../template.typ": *

// 单栏高密度风格版本：通用版，不预设行业，适合任何专业背景直接改内容使用
#show: doc => resume(
  size: 9.3pt,
  accent: rgb("#3b4d8f"),
  name: "张三",
  meta: (
    (
      (icon: "icons/ui/phone.svg", content: "138-0000-0000"),
      (icon: "icons/ui/envelope.svg", content: link("mailto:zhangsan@example.com", "zhangsan@example.com")),
      (icon: "icons/ui/wechat.svg", content: "zhangsan"),
    ),
    (
      (icon: "icons/ui/user.svg", content: "本科应届 · 目标岗位：xx 岗位 / xx 方向 · 可随时到岗", strong: true),
    ),
  ),
  doc,
)

#section("个人简介")
本科应届毕业生，有 2 段相关实习经历与 1 项校级创新创业获奖项目，做事细致、执行力强，擅长跨部门协调与资料 / 数据整理，适应新环境快，能快速上手并独立推进任务。

#section("教育经历")
#entry-bar("某某大学", subtitle: "某某专业 · 本科", meta: "2019.09 - 2023.06")

#section("技能")
#tool-line(
  "Excel（数据透视表 / 函数）", "Word", "PPT", "WPS 表格 / 文档",
  "沟通表达与跨部门协作", "项目进度管理", "计算机二级", "英语 CET-6",
  (icon: "icons/certificates/ielts.svg", label: "雅思 7.0", fill: rgb("#C7002B"), box-width: 2.3em),
)

#section("实习经历")

#entry-bar("某某公司", subtitle: "xx 部门实习生", meta: "2022.07 - 2022.09")
#bullets(
  [*背景与目标：*协助负责人推进某某项目，原有资料整理与进度跟踪缺少统一流程。],
  [*我的职责：*负责资料整理、进度跟踪与周报输出，保障项目按期推进。],
  (level: 1, body: [*执行链路：*独立完成某某专题的数据统计与图表制作，用 Excel 搭建周度数据看板为团队决策提供参考。]),
  (level: 1, body: [*成果：*协调 3 个相关部门配合完成某项跨部门任务，获得带教导师认可。]),
)

#entry-bar("某某公司", subtitle: "xx 部门实习生", meta: "2021.07 - 2021.09")
#bullets(
  [负责某模块日常事务处理与文档归档，梳理并优化原有工作流程，效率提升约 20%；参与新人入职培训材料编写，获部门负责人表扬。],
)

#section("荣誉证书")
#entry-bar("校级优秀学生干部", meta: "2022.10")
#entry-bar("某某创新创业大赛", subtitle: "校级二等奖", meta: "2021.11")
#entry-bar("国家励志奖学金", meta: "2021.10")

#section("项目 / 实践经历")

#project-title("某某创新创业大赛项目", "项目负责人")
#bullets(
  [*背景与目标：*面向某某场景设计服务方案并验证可行性。],
  [*我的职责：*带领 5 人团队完成市场调研、方案设计与路演，统筹分工与进度安排。],
  (level: 1, body: [*结果：*项目按计划节点全部完成交付，最终获校级二等奖。]),
)

#project-title("某某志愿服务项目", "核心成员")
#bullets(
  [面向社区的公益服务项目，参与组织策划 10+ 场志愿活动，累计服务时长 200+ 小时，负责活动物料准备与现场协调。],
)

#section("校园经历")
#entry-bar("学生会 / 某某社团", subtitle: "部长", meta: "2020.09 - 2022.06")
#bullets(
  [统筹部门日常工作与年度活动策划，带领团队完成多场校级活动。],
)
