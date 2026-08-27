#import "../../template.typ": *

// 单栏高密度风格版本：土木建筑 / 工程造价
#show: doc => resume(
  accent: rgb("#a05a2c"),
  name: "张三",
  meta: (
    (
      (icon: "icons/ui/phone.svg", content: "138-0000-0000"),
      (icon: "icons/ui/envelope.svg", content: link("mailto:zhangsan@example.com", "zhangsan@example.com")),
      (icon: "icons/ui/wechat.svg", content: "zhangsan"),
    ),
    (
      (icon: "icons/ui/user.svg", content: "本科 · 目标岗位：土木工程师 / 工程造价 · 可随时到岗", strong: true),
    ),
  ),
  doc,
)

#section("个人简介")
土木工程本科毕业，持有二级建造师（建筑工程）资质，3 年住宅与商业地产项目经验，主导过 12 万平方米住宅项目的施工图深化与工程量清单编制，为公司节约结算成本约 180 万元；熟悉 BIM 多专业碰撞检测与钢结构吊装方案编制。

#section("教育经历")
#entry-bar("某某理工大学", subtitle: "土木工程 · 本科", meta: "2017.09 - 2021.06")

#section("技能")
#tool-line(
  (icon: "icons/engineering/autocad.svg", label: "AutoCAD", fill: rgb("#E51050")),
  (icon: "icons/engineering/revit.svg", label: "Revit", fill: rgb("#186BFF")),
  (icon: "icons/engineering/ansys.svg", label: "Ansys", fill: rgb("#FFB71B")),
  "工程量清单编制与预算", "Excel（造价核算）", "施工现场管理", "计算机二级", "英语 CET-4",
)

#section("工作经历")

#entry-bar("某某建筑工程有限公司", subtitle: "工程师", meta: "2021.07 - 至今")
#project-title("某住宅小区项目", "施工图深化与工程造价")
#bullets(
  [*背景与目标：*总建面 12 万平方米住宅项目，原施工图存在多处专业冲突，需在保证工期前提下完成深化。],
  [*我的职责：*负责施工图深化、现场技术交底与工程量清单编制。],
  (level: 1, body: [*执行链路：*用 AutoCAD 完成施工图深化，累计处理设计变更 80+ 项；主导工程量清单编制与成本核算。]),
  (level: 1, body: [*成果：*项目结算阶段为公司节约成本约 180 万元，工期较原计划提前 20 天完成。]),
)

#entry-bar("某某建筑设计院", subtitle: "结构设计实习生", meta: "2020.06 - 2021.03")
#bullets(
  [协助完成 3 个多层住宅项目的结构施工图绘制与校对，参与图纸会审并累计发现反馈图纸问题 40+ 处。],
)

#section("资质证书")
#entry-bar("二级建造师（建筑工程）", meta: "2022.10")
#entry-bar("全国大学生结构设计竞赛", subtitle: "省级二等奖", meta: "2020.09")

#section("项目经历")

#project-title("某商业综合体 BIM 应用项目", "BIM 工程师")
#bullets(
  [*背景与目标：*总建面 8 万平方米商业综合体项目，需在施工前完成多专业碰撞检测以减少返工。],
  [*我的职责：*负责建筑、结构、机电三专业 BIM 模型搭建与碰撞检测。],
  (level: 1, body: [*技术实现：*使用 Revit 建模，累计发现管线碰撞点位 200+ 处，通过可视化交底与各专业对齐修改方案。]),
  (level: 1, body: [*结果：*现场返工率较同类项目降低约 30%。]),
)

#project-title("装配式钢结构厂房项目", "现场技术员")
#bullets(
  [*背景与目标：*厂房主体钢结构吊装项目，需确认关键节点吊装方案的结构安全性。],
  [*我的职责：*配合设计单位完成关键节点有限元验算，编制吊装专项施工方案。],
  (level: 1, body: [*技术实现：*使用 Ansys 完成节点有限元验算，方案通过专家论证后实施。]),
)
