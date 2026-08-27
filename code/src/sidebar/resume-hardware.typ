#import "../../template.typ": *

// 侧栏卡片风格：电子信息 / 嵌入式硬件工程师
#let accent = rgb("#1f7a5c")

#sidebar-resume(
  size: 9.8pt,
  accent: accent,
  sidebar-width: 31%,
  header: sidebar-header(
    name: "张三",
    title: "嵌入式硬件工程师 · 智能硬件方向",
    accent: accent,
    contacts: (
      (icon: "icons/ui/phone.svg", content: "138-0000-0000"),
      (icon: "icons/ui/envelope.svg", content: "zhangsan@example.com", link: "mailto:zhangsan@example.com"),
      (icon: "icons/ui/location.svg", content: "深圳"),
      (icon: "icons/ui/wechat.svg", content: "zhangsan"),
    ),
  ),

  sidebar: sidebar-card(accent: accent)[
    #sidebar-side-heading("专业技能", icn: "icons/ui/wrench.svg", accent: accent)
    #sidebar-skill-bar("电路设计 / PCB Layout", level: 0.9, accent: accent)
    #sidebar-skill-bar("单片机开发（STM32 / ARM）", level: 0.92, accent: accent)
    #sidebar-skill-bar("嵌入式 C / C++", level: 0.88, accent: accent)

    #v(0.35em)
    #sidebar-side-heading("教育背景", icn: "icons/ui/graduation-cap.svg", accent: accent)
    #sidebar-side-entry(
      "某某理工大学",
      subtitle: "电子信息工程 · 本科",
      date: "2017.09 – 2021.06",
      body: "GPA 3.7 / 4.0 · 专业排名前 10%",
    )

    #v(0.15em)
    #sidebar-side-heading("荣誉奖项", icn: "icons/ui/award.svg", accent: accent)
    #sidebar-side-entry("全国大学生电子设计竞赛（TI 杯）", subtitle: "国家二等奖", date: "2020.08")
    #sidebar-side-entry("恩智浦杯智能车竞赛", subtitle: "华南赛区一等奖", date: "2020.05")
    #sidebar-side-entry(
      logo: "icons/competitions/ict.svg",
      logo-width: 30%,
      "华为 ICT 大赛",
      subtitle: "全国总决赛三等奖",
      date: "2020.11",
    )

    #v(0.15em)
    #sidebar-side-heading("常用工具", icn: "icons/ui/star.svg", accent: accent)
    #sidebar-tag-row(
      (label: "KiCad", icon: "icons/engineering/kicad.svg", fill: rgb("#314CB0")),
      (label: "Arduino", icon: "icons/engineering/arduino.svg", fill: rgb("#00878F")),
      accent: accent,
    )

    #v(0.15em)
    #sidebar-side-heading("语言能力", accent: accent)
    #sidebar-skill-bar("英语（CET-6）", level: 0.75, accent: accent)
  ],

  main: [
    #sidebar-section("个人简介", accent: accent)
    #sidebar-summary-block[
      4 年嵌入式硬件开发经验，专注于智能硬件与工业物联网终端的电路设计与固件开发。熟悉从原理图设计、PCB Layout 到量产测试的完整硬件研发流程，主导过量产良率从行业平均水平提升至 99.2% 的主板设计项目。
    ]

    #v(0.3em)
    #sidebar-section("工作经历", icn: "icons/ui/work.svg", accent: accent)
    #sidebar-timeline-item(
      org: "某某智能硬件有限公司（虚构示例）",
      role: "硬件工程师",
      date: "2021.07 – 至今",
      accent: accent,
      bullets: (
        [主导智能穿戴设备主板设计，完成原理图评审、PCB Layout 与 EMC 整改，量产良率提升至 99.2%],
        [负责电源管理电路优化，待机功耗降低 35%，续航时间从 5 天提升至 8 天],
      ),
      tags: ((label: "KiCad", icon: "icons/engineering/kicad.svg", fill: rgb("#314CB0")), "STM32"),
    )
    #sidebar-timeline-item(
      org: "某某电子科技有限公司（虚构示例）",
      role: "硬件工程师实习生",
      date: "2020.07 – 2021.02",
      accent: accent,
      last: true,
      bullets: (
        [参与蓝牙音箱主板设计，协助完成 3 版原理图迭代与 EMC 预测试整改],
      ),
      tags: ("蓝牙音箱", "EMC"),
    )

    #v(0.4em)
    #sidebar-section("项目经历", icn: "icons/ui/code.svg", accent: accent)
    #sidebar-timeline-item(
      org: "工业物联网数据网关",
      role: "硬件 & 固件负责人",
      date: "2021.09 – 2022.05",
      accent: accent,
      icon: "icons/engineering/arduino.svg",
      icon-fill: rgb("#00878F"),
      summary: "面向中小工厂的低成本数据采集网关，支持多路传感器接入与云端上报。",
      bullets: ([基于 ARM Cortex-M4 完成主板设计，BOM 成本较竞品降低 20%],),
      tags: ("Cortex-M4", "MQTT"),
    )
    #sidebar-timeline-item(
      org: "智能车竞赛控制系统",
      role: "队长",
      date: "2020.03 – 2020.05",
      accent: accent,
      last: true,
      summary: "恩智浦杯智能车竞赛参赛作品，负责整车电路设计与循迹算法调优。",
      bullets: ([基于 PID 算法优化循迹响应速度，赛道平均通过时间缩短 18%],),
      tags: ("STM32", "PID"),
    )
  ],
)
