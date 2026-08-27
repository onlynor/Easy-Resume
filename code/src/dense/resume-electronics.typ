#import "../../template.typ": *

// 单栏高密度风格版本：电子信息 · 硬件结构工程师，AutoCAD / 结构仿真 + 电子协同工具
#show: doc => resume(
  size: 9pt,
  accent: rgb("#1f7a5c"),
  name: "张三",
  meta: (
    (
      (icon: "icons/ui/phone.svg", content: "138-0000-0000"),
      (icon: "icons/ui/envelope.svg", content: link("mailto:zhangsan@example.com", "zhangsan@example.com")),
      (icon: "icons/ui/wechat.svg", content: "zhangsan"),
    ),
    (
      (icon: "icons/ui/user.svg", content: "本科应届 · 目标岗位：硬件结构工程师 · 电子信息方向 · 可随时到岗", strong: true),
    ),
  ),
  doc,
)

#section("个人简介")
机械设计制造及其自动化专业应届本科生，有华为、小米两段结构工程师实习经历，熟悉产品结构设计全流程（建模 - 公差分析 - 仿真验证 - 试产跟进），主导过跌落测试通过率从 72% 提升至 96% 的结构优化项目，具备扎实的公差链分析与有限元仿真能力。

#section("教育经历")
#entry-bar("某某理工大学", subtitle: "机械设计制造及其自动化 · 本科", meta: "2020.09 - 2024.06")

#section("技能")
#tool-line(
  (icon: "icons/engineering/autocad.svg", label: "AutoCAD", fill: rgb("#E51050")),
  (icon: "icons/engineering/sketchup.svg", label: "SketchUp", fill: rgb("#005F9E")),
  (icon: "icons/engineering/freecad.svg", label: "FreeCAD", fill: rgb("#418FDE")),
  (icon: "icons/engineering/ansys.svg", label: "Ansys", fill: rgb("#FFB71B")),
  (icon: "icons/engineering/siemens.svg", label: "Siemens NX", fill: rgb("#009999")),
  (icon: "icons/engineering/kicad.svg", label: "KiCad（协同看图）", fill: rgb("#314CB0")),
)
#bullets(
  [熟悉产品结构设计全流程（建模 - 公差分析 - 仿真验证 - 试产跟进），有跌落 / 振动等可靠性测试经验。],
)

#section("实习经历")

#entry-bar("华为（虚构示例）", subtitle: "结构工程师实习生", logo: "icons/companies/huawei.svg", meta: "2023.07 - 2023.12")
#project-title("Wearable Structure Design", "智能穿戴设备结构设计与公差优化")
#bullets(
  [*背景与目标：*新款手环结构装配合格率偏低，产线返修率超过 8%；*目标：*将装配合格率提升至 98% 以上。],
  [*我的职责：*结构设计模块负责人，独立完成公差链分析与结构优化方案落地。],
  (level: 1, body: [*执行链路：*基于 AutoCAD / SolidWorks 重新绘制装配图，用公差链分析定位到卡扣配合尺寸链累积误差过大。]),
  (level: 1, body: [*工程化：*优化卡扣结构与壁厚分布，配合产线试装验证 3 轮，装配合格率提升至 98.6%。]),
)

#entry-bar("小米（虚构示例）", subtitle: "硬件结构实习生", logo: "icons/companies/xiaomi.svg", meta: "2022.07 - 2022.12")
#project-title("Enclosure Optimization", "智能硬件外壳结构强度仿真与优化")
#bullets(
  [*背景与目标：*产品跌落测试中外壳边角开裂率较高；*目标：*在不增加成本的前提下通过 1.5m 跌落测试标准。],
  [*我的职责：*配合结构工程师完成有限元仿真建模与方案对比。],
  (level: 1, body: [*技术实现：*使用 Ansys 对 6 个跌落姿态做有限元仿真，定位应力集中点；同步与 PCBA 硬件工程师对齐结构安装孔位与走线避让。]),
  (level: 1, body: [*成果：*调整加强筋布局后跌落测试通过率从 72% 提升至 96%。]),
)

#section("竞赛获奖")
#entry-bar("全国大学生机械创新设计大赛", subtitle: "省级一等奖", meta: "2023.06")
#entry-bar("\"挑战杯\"课外学术科技作品竞赛", logo: "icons/competitions/challenge-cup.svg", subtitle: "校级二等奖", meta: "2022.11")

#section("项目经历")

#project-title("精密结构件公差优化", "毕业设计")
#bullets(
  [*项目背景与职责：*针对某精密连接件的批量装配一致性问题开展公差优化研究，独立完成建模、公差链计算与仿真验证。],
  (level: 1, body: [*技术实现与结果：*基于 AutoCAD 完成二维工程图绘制，FreeCAD 搭建三维装配模型并做干涉检查，毕业设计获评校级优秀毕业设计。]),
)

#project-title("产品外观结构设计", "课程项目 · 小组负责人")
#bullets(
  [*项目背景与职责：*为某桌面小家电做外观结构设计与可制造性评审，小组负责人，带队 4 人完成课程答辩。],
  (level: 1, body: [*技术实现与结果：*SketchUp 完成外观造型推敲并标注关键装配尺寸，方案获课程组最高分，被指导教师推荐参赛。]),
)
