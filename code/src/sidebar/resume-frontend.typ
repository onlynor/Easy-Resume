#import "../../template.typ": *

// 侧栏卡片风格：计算机 / 互联网前端工程师
#let accent = rgb("#2455a4")

#sidebar-resume(
  size: 9.8pt,
  accent: accent,
  sidebar-width: 31%,
  header: sidebar-header(
    name: "张三",
    title: "高级前端开发工程师 · 前端架构方向",
    accent: accent,
    contacts: (
      (icon: "icons/ui/phone.svg", content: "138-0000-0000"),
      (icon: "icons/ui/envelope.svg", content: "zhangsan@example.com", link: "mailto:zhangsan@example.com"),
      (icon: "icons/ui/location.svg", content: "上海"),
      (icon: "icons/ui/github.svg", content: "github.com/zhangsan"),
      (icon: "icons/ui/wechat.svg", content: "zhangsan"),
    ),
  ),

  sidebar: sidebar-card(accent: accent)[
    #sidebar-side-heading("专业技能", icn: "icons/ui/wrench.svg", accent: accent)
    #sidebar-skill-bar("JavaScript / TypeScript", level: 0.95, accent: accent)
    #sidebar-skill-bar("React / Vue", level: 0.9, accent: accent)
    #sidebar-skill-bar("Node.js", level: 0.75, accent: accent)
    #sidebar-skill-bar("性能优化 / 工程化", level: 0.85, accent: accent)

    #v(0.35em)
    #sidebar-side-heading("教育背景", icn: "icons/ui/graduation-cap.svg", accent: accent)
    #sidebar-side-entry(
      "某某大学",
      subtitle: "计算机科学与技术 · 本科",
      date: "2016.09 – 2020.06",
      body: "GPA 3.8 / 4.0 · 专业排名前 5%",
    )

    #v(0.15em)
    #sidebar-side-heading("荣誉奖项", icn: "icons/ui/award.svg", accent: accent)
    #sidebar-side-entry(
      logo: "icons/competitions/cscc.svg",
      logo-width: 50%,
      "全国大学生计算机系统能力大赛",
      subtitle: "操作系统内核赛道 · 全国二等奖",
      date: "2019.06",
    )
    #sidebar-side-entry("公司年度技术之星", date: "2023.12")
    #sidebar-side-entry(
      logo: "icons/competitions/icpc.svg",
      logo-width: 40%,
      "ACM-ICPC 区域赛银奖",
      date: "2019.11",
    )

    #v(0.15em)
    #sidebar-side-heading("语言能力", accent: accent)
    #sidebar-skill-bar("英语（CET-6）", level: 0.8, accent: accent)
  ],

  main: [
    #sidebar-section("个人简介", accent: accent)
    #sidebar-summary-block[
      6 年前端开发经验，专注于中大型 Web 应用的架构设计与性能优化。主导过多个从 0 到 1 的前端基础设施建设，擅长将复杂业务抽象为可复用组件与工程化方案。
    ]

    #v(0.3em)
    #sidebar-section("工作经历", icn: "icons/ui/work.svg", accent: accent)
    #sidebar-timeline-item(
      org: "某某科技有限公司（虚构示例）",
      role: "高级前端工程师",
      date: "2021.07 – 至今",
      accent: accent,
      bullets: (
        [主导中台前端架构升级，将构建时间从 8 分钟优化至 90 秒，首屏加载时间下降 65%],
        [设计并落地组件库与设计系统，覆盖公司内 12 个业务线，人均开发效率提升 30%],
      ),
      tags: (
        (label: "React", icon: "icons/tech/react.svg", fill: rgb("#61DAFB")),
        (label: "TypeScript", icon: "icons/tech/typescript.svg", fill: rgb("#3178C6")),
      ),
    )
    #sidebar-timeline-item(
      org: "某某互联网公司（虚构示例）",
      role: "前端工程师",
      date: "2020.07 – 2021.06",
      accent: accent,
      last: true,
      bullets: (
        [负责核心交易链路页面开发，日均支撑 200 万 + PV，配合后端完成接口性能治理],
        [从 0 到 1 搭建前端监控体系，接入错误上报与性能埋点，线上问题平均定位时间从 2 小时缩短至 20 分钟],
      ),
      tags: ((label: "Vue", icon: "icons/tech/vue.svg", fill: rgb("#4FC08D")),),
    )

    #v(0.4em)
    #sidebar-section("项目经历", icn: "icons/ui/code.svg", accent: accent)
    #sidebar-timeline-item(
      org: "轻量表单引擎",
      role: "作者 / 维护者",
      date: "2022.03 – 至今",
      accent: accent,
      icon: "icons/tech/react.svg",
      icon-fill: rgb("#61DAFB"),
      summary: "面向中后台场景的 Schema 驱动表单渲染引擎，支持动态联动、异步校验与自定义组件扩展。",
      bullets: ([实现按需加载与虚拟滚动，千字段级大表单渲染耗时从 1.2s 降至 200ms],),
      tags: ("TypeScript", "JSON Schema"),
    )
    #sidebar-timeline-item(
      org: "团队构建提速方案",
      role: "发起人",
      date: "2023.01 – 2023.04",
      accent: accent,
      last: true,
      icon: "icons/tech/vite.svg",
      icon-fill: rgb("#646CFF"),
      summary: "将团队 12 个中台项目的构建工具链从 Webpack 迁移至 Vite，统一构建配置模板。",
      bullets: ([平均构建时间从 6 分钟降至 45 秒，本地开发热更新从 3s 降至 200ms 以内],),
      tags: ("Vite", "Webpack"),
    )
  ],
)
