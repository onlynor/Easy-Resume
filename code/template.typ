/*
 * Easy Resume · Typst 简历设计系统，单文件含三套互相独立的排版风格：
 * 1. 主风格（无前缀）：单栏高密度，STAR 式要点，resumes 目录下的示例主要在用。
 * 2. 侧栏卡片风格（sidebar- 前缀）：两栏 + 技能进度条 + 时间线，前缀避免和
 *    主风格同名函数（font / palette / resume / section）冲突。
 * 3. 极简风格（minimal- 前缀）：纯黑白灰，不用强调色 / 图标 / Logo / 照片。
 * 三套风格共用同一个 svg-icon() 图标渲染函数，其余组件互相独立，不要混用。
 */

// SVG 部分来源图标会在根节点自带 fill，这里先剥离已有 fill 再统一注入主题色，
// 兼容所有来源的单色 SVG。
#let svg-icon(path, fill: black, size: 0.85em, box-width: 1.1em, box-height: 0.72em) = {
  let raw = read(path)
  let stripped = raw.replace(regex("\\sfill=\"[^\"]*\""), "")
  let colored = stripped.replace("<svg", "<svg fill=\"" + fill.to-hex() + "\"")
  box(height: box-height, width: box-width, align(center + horizon, image(bytes(colored), height: size)))
}

// 主风格 · 单栏高密度

#let font = (
  body: "Liberation Serif", // Times New Roman 的免费替代字体
  cjk: "Noto Serif CJK SC",
  heading: "Noto Sans CJK SC",
  mono: "Noto Sans Mono",
)

#let palette = (
  blue: rgb("#2458b8"),
  text: rgb("#151515"),
  muted: rgb("#596273"),
  band: rgb("#f2f3f5"),
)

// resume(accent: ...) 写入一次，section / link / project-title / lead 等
// 都通过 context 读取，不用每个组件单独传 accent。
#let accent-state = state("easy-resume-accent", palette.blue)

#let resume(
  size: 10pt,
  accent: palette.blue,
  margin: (top: 0.65cm, bottom: 0.65cm, left: 1.1cm, right: 1.1cm),
  name: "",
  meta: (),
  photo: none,
  body,
) = {
  set document(title: name + " 简历")
  set page(paper: "a4", margin: margin, numbering: none)
  set text(font: (font.body, font.cjk), size: size, fill: palette.text, lang: "zh")
  set par(justify: true, leading: 0.55em)
  accent-state.update(accent)

  // 用真正的 heading 承载区块标题，PDF 会自动生成可点击跳转的书签大纲
  show heading: it => context {
    let ac = accent-state.get()
    v(0.3em)
    text(font: (font.heading, font.cjk), fill: ac, size: 1.42em, weight: "bold")[#it.body]
    v(0.1em)
    line(length: 100%, stroke: 1.4pt + ac)
    v(0.16em)
  }
  show link: it => context text(fill: accent-state.get())[#it]

  grid(
    columns: (1fr, 2.8cm),
    column-gutter: 0.8cm,
    align: top,
    [
      #text(font: (font.heading, font.cjk), size: 2.05em, weight: "bold")[#name]
      #v(0.15em)
      #for line in meta [
        #box({
          line.map(part => {
            box({
              if "icon" in part { context svg-icon(part.icon, fill: accent-state.get(), size: 0.72em) ; h(0.22em) }
              if "strong" in part and part.strong {
                text(weight: "bold")[#part.content]
              } else {
                part.content
              }
            })
          }).join(box(inset: (x: 0.3em))[#text(fill: rgb("#2d2d2d"))[|]])
        })
        #v(0.16em)
      ]
    ],
    box(
      width: 2.8cm, height: 3.6cm, clip: true, stroke: 0.6pt + rgb("#c7cbd1"),
      image(if photo != none { photo } else { "icons/ui/figure.png" }, width: 2.8cm, height: 3.6cm, fit: "cover"),
    ),
  )

  body
}

#let section(title) = heading(title)

// 教育背景不带 logo；公司经历可传 logo（多色官方 Logo，原样显示不染色）
#let entry-bar(name, meta: none, logo: none, subtitle: none) = block(
  width: 100%, fill: palette.band, radius: 3pt, inset: (x: 0.5em, y: 0.32em), above: 0.35em, below: 0.32em,
)[
  #grid(
    columns: (auto, 1fr, auto),
    column-gutter: 0.5em,
    align: horizon,
    if logo != none { box(width: 1.5em, height: 1.5em, image(logo, width: 1.5em, height: 1.5em, fit: "contain")) } else { [] },
    text(size: 0.98em, weight: "bold")[#name #if subtitle != none [#text(weight: "regular", size: 0.94em)[ · #subtitle]]],
    text(size: 0.85em, fill: rgb("#202020"))[#meta],
  )
]

// parts 可传多个（如中英文双标题），用全角竖线分隔
#let project-title(..parts) = block(above: 0.38em, below: 0.7em)[
  #context text(fill: accent-state.get().darken(8%), size: 1.02em, weight: "bold")[
    #parts.pos().join([　|　])
  ]
]

#let lead(body) = block(above: 0.1em, below: 0.2em)[
  #context text(fill: accent-state.get().darken(4%), size: 0.96em, weight: "bold")[#body]
]

// items 每条可以是纯 content（一级要点），也可以是 (level: 1, body: [...]) 精细控制层级
#let bullets(..items) = block(above: 0.06em, below: 0.12em)[
  #for it in items.pos() [
    #let level = if type(it) == dictionary { it.at("level", default: 0) } else { 0 }
    #let content = if type(it) == dictionary { it.body } else { it }
    #grid(
      columns: (level * 1.1em, 0.9em, 1fr), column-gutter: (0em, 0.25em),
      [],
      text(fill: if level == 0 { palette.text } else { palette.muted }, size: 0.75em)[
        #if level == 0 { sym.bullet } else { sym.circle.small }
      ],
      text(size: 0.9em)[#content],
    )
    #v(0.07em)
  ]
]

#let code(body) = box(fill: palette.band, inset: (x: 0.2em), radius: 1.5pt)[
  #text(font: (font.mono, font.cjk), size: 0.88em)[#body]
]

#let muted(body) = text(fill: palette.muted)[#body]

// tools 每项形如 (icon: "icons/tech/react.svg", label: "React", fill: rgb("#61DAFB"))，
// fill 传官方品牌色，不传则用当前强调色；横向较宽的 Logo（IELTS / TOEFL 这类文字型
// 商标）可加 box-width: 2.3em 避免被默认窄图标框压扁。
// 也可以传纯字符串——没有可靠对应品牌时用纯文字，不强行配图标、不用相近品牌图标顶替
// （比如计算机等级考试 / 英语四六级 / 普通话证书这类没有专属 Logo 的证书）。
#let tool-line(..tools) = block(above: 0.15em, below: 0.2em)[
  #tools.pos().map(t => box({
    if type(t) == str {
      text(size: 0.94em)[#t]
    } else {
      context svg-icon(t.icon, fill: t.at("fill", default: accent-state.get()), size: 0.78em, box-width: t.at("box-width", default: 1.1em))
      h(0.2em)
      text(size: 0.94em)[#t.label]
    }
  })).join(h(0.4em) + text(fill: rgb("#9aa0ab"))[·] + h(0.4em))
]

// 侧栏卡片风格（当前 resumes/*.typ 未使用，保留供需要更强调"技能可视化"的场景切换）

#let sidebar-font = (
  main: "Noto Sans",
  cjk: "Noto Sans CJK SC",
  mono: "Noto Sans Mono",
)

#let sidebar-palette = (
  ink: rgb("#1f2430"),
  muted: rgb("#69707d"),
  faint: rgb("#98a0ab"),
  rule: rgb("#e2e6ec"),
  paper: rgb("#ffffff"),
)

// 无真实证件照时的圆形占位头像；传入真实照片时用 sidebar-header(photo:) 直接覆盖
#let sidebar-avatar-placeholder(diameter: 2.6cm, accent: rgb("#2455a4")) = box(
  width: diameter, height: diameter, radius: diameter / 2, fill: accent.lighten(78%),
  stroke: 1.4pt + accent,
  align(center + horizon, svg-icon("icons/ui/user.svg", fill: accent, size: 1.5em, box-width: 1.5em)),
)

#let sidebar-dot(fill: black) = box(width: 3pt, height: 3pt, radius: 1.5pt, fill: fill, baseline: -0.2em)

#let sidebar-header(
  name: "",
  title: "",
  accent: rgb("#2455a4"),
  photo: none,
  photo-diameter: 2.6cm,
  contacts: (),
) = {
  let avatar = if photo != none {
    box(width: photo-diameter, height: photo-diameter, radius: photo-diameter / 2, clip: true,
      image(photo, width: photo-diameter, height: photo-diameter, fit: "cover"))
  } else {
    sidebar-avatar-placeholder(diameter: photo-diameter, accent: accent)
  }

  grid(
    columns: (1fr, auto),
    column-gutter: 1em,
    align: horizon,
    [
      #text(fill: sidebar-palette.ink, size: 2.1em, weight: "bold", font: (sidebar-font.main, sidebar-font.cjk))[#name]
      #if title != "" [
        #v(0.15em)
        #box(fill: accent.lighten(85%), inset: (x: 0.55em, y: 0.32em), radius: 2pt)[
          #text(fill: accent, size: 0.92em, weight: "medium", tracking: 0.5pt)[#title]
        ]
      ]
    ],
    avatar,
  )

  v(0.65em)

  set text(font: (sidebar-font.main, sidebar-font.cjk), size: 0.88em, fill: sidebar-palette.muted)
  let pieces = contacts.map(c => {
    box({
      if "icon" in c { svg-icon(c.icon, fill: accent) }
      h(0.3em)
      if "link" in c {
        text(fill: sidebar-palette.muted, link(c.link, c.content))
      } else {
        c.content
      }
    })
  })
  pieces.join([ #h(0.55em) #sidebar-dot(fill: sidebar-palette.faint) #h(0.55em) ])

  v(0.5em)
  line(length: 100%, stroke: 1.4pt + accent)
  v(0.9em)
}

#let sidebar-section(title, icn: none, accent: rgb("#2455a4")) = {
  v(0.2em)
  grid(
    columns: (auto, 1fr),
    column-gutter: 0.6em,
    align: horizon,
    box({
      if icn != none {
        svg-icon(icn, fill: accent, size: 0.95em)
      } else {
        box(width: 0.7em, height: 0.7em, fill: accent, radius: 1.5pt)
      }
      h(0.45em)
      text(fill: sidebar-palette.ink, size: 1.18em, weight: "bold")[#title]
    }),
    line(length: 100%, stroke: 0.6pt + sidebar-palette.rule),
  )
  v(0.5em)
}

#let sidebar-side-heading(title, icn: none, accent: rgb("#2455a4")) = {
  box({
    if icn != none {
      svg-icon(icn, fill: accent)
      h(0.4em)
    }
    text(fill: accent, size: 1em, weight: "bold", tracking: 0.3pt)[#title]
  })
  v(0.35em)
  line(length: 100%, stroke: 0.5pt + accent.lighten(55%))
  v(0.4em)
}

#let sidebar-card(accent: rgb("#2455a4"), bg: rgb("#f4f6f9"), body) = block(
  width: 100%,
  fill: bg,
  radius: 4pt,
  inset: 0pt,
  stroke: none,
  {
    block(width: 100%, height: 5pt, fill: accent, radius: (top: 4pt))
    block(width: 100%, inset: (x: 1em, top: 0.9em, bottom: 0.6em), body)
  },
)

// 进度条用底色 + 主题色两层 block 叠加实现，level 是 0-1 的填充比例
#let sidebar-skill-bar(name, level: 0.8, accent: rgb("#2455a4")) = block(width: 100%, below: 0.24em)[
  #text(size: 0.9em, fill: sidebar-palette.ink)[#name]
  #v(0.15em)
  #block(width: 100%, height: 5pt, fill: accent.lighten(80%), radius: 2.5pt)[
    #block(width: level * 100%, height: 100%, fill: accent, radius: 2.5pt)
  ]
]

// 有对应品牌 Logo 时传 icon: 显示真实配色小图标；没有可靠对应品牌时
// （如 "JSON Schema" "Canvas" 这类非品牌概念）留空即可，不要用相近品牌图标顶替。
#let sidebar-tag(body, icon: none, icon-fill: none, accent: rgb("#2455a4")) = box(
  fill: if icon != none { rgb("#eef1f5") } else { accent.lighten(85%) },
  inset: (x: 0.5em, y: 0.28em), radius: 2pt, outset: (y: 0.1em),
)[
  #box({
    if icon != none {
      svg-icon(icon, fill: if icon-fill != none { icon-fill } else { accent }, size: 0.75em, box-width: 0.95em)
      h(0.1em)
    }
    text(
      fill: if icon != none { rgb("#3d4552") } else { accent.darken(10%) },
      size: 0.78em, font: (sidebar-font.mono, sidebar-font.cjk),
    )[#body]
  })
]

// tags 既可传纯字符串，也可传 (label: "React", icon: "icons/tech/react.svg", fill: rgb("#61DAFB"))
#let sidebar-tag-row(..tags, accent: rgb("#2455a4")) = block(width: 100%, above: 0.35em, below: 0.2em)[
  #tags.pos().map(t => {
    if type(t) == str {
      sidebar-tag(t, accent: accent)
    } else {
      sidebar-tag(t.label, icon: t.at("icon", default: none), icon-fill: t.at("fill", default: none), accent: accent)
    }
  }).join(h(0.4em))
]

// logo 传官方多色 Logo（竞赛 / 机构 lockup 图，PNG 或 SVG 均可），按原始比例
// 顶部展示，保留官方多色设计，不做单色化处理
#let sidebar-side-entry(title, subtitle: none, date: none, body: none, logo: none, logo-width: 78%) = block(width: 100%, below: 0.3em)[
  #if logo != none [
    #image(logo, width: logo-width)
    #v(0.22em)
  ]
  #text(size: 0.92em, weight: "bold", fill: sidebar-palette.ink)[#title]
  #if date != none [
    #linebreak()
    #text(size: 0.78em, fill: sidebar-palette.faint, font: (sidebar-font.mono, sidebar-font.cjk))[#date]
  ]
  #if subtitle != none [
    #linebreak()
    #text(size: 0.84em, fill: sidebar-palette.muted)[#subtitle]
  ]
  #if body != none [
    #v(0.15em)
    #text(size: 0.82em, fill: sidebar-palette.muted)[#body]
  ]
]

// icon 传单色品牌 SVG + icon-fill 官方色，会按 icon-fill 重新染色；logo 传多色官方
// Logo（原样显示、不做单色化），适合公司 / 竞赛这类有完整视觉规范的徽标；二者只用一个。
// 没有可靠对应品牌时两者都不传，保留默认圆点即可，不要用相近品牌图标顶替。
#let sidebar-timeline-item(
  org: "",
  role: "",
  date: "",
  accent: rgb("#2455a4"),
  last: false,
  icon: none,
  icon-fill: none,
  logo: none,
  summary: none,
  bullets: (),
  tags: (),
) = {
  let has-badge = icon != none or logo != none
  let inset-left = if has-badge { 1.5em } else { 1em }
  block(
    width: 100%,
    inset: (left: inset-left, bottom: if last { 0em } else { 1.1em }),
    stroke: (left: 1.4pt + accent.lighten(58%)),
  )[
  #if icon != none [
    #place(top + left, dx: -inset-left - 6.5pt, dy: 0.15em)[
      #box(width: 13pt, height: 13pt, radius: 6.5pt, fill: white, stroke: 1.1pt + icon-fill,
        align(center + horizon, svg-icon(icon, fill: icon-fill, size: 7.5pt, box-width: 7.5pt)))
    ]
  ] else if logo != none [
    #place(top + left, dx: -inset-left - 6.5pt, dy: 0.15em)[
      #box(width: 13pt, height: 13pt, radius: 6.5pt, fill: white, stroke: 1.1pt + sidebar-palette.rule, clip: true,
        align(center + horizon, image(logo, width: 10pt)))
    ]
  ] else [
    #place(top + left, dx: -inset-left - 3.3pt, dy: 0.35em)[
      #circle(radius: 3.3pt, fill: accent)
    ]
  ]
  #grid(
    columns: (1fr, auto),
    align: (left, right),
    text(size: 1em, weight: "bold", fill: sidebar-palette.ink)[#org #h(0.5em) #text(fill: accent, weight: "medium")[#role]],
    text(size: 0.82em, fill: sidebar-palette.faint, font: (sidebar-font.mono, sidebar-font.cjk))[#date],
  )
  #if summary != none [
    #v(0.2em)
    #text(size: 0.88em, fill: sidebar-palette.muted)[#summary]
  ]
  #if bullets.len() > 0 [
    #v(0.15em)
    #for b in bullets [
      #grid(columns: (0.9em, 1fr), column-gutter: 0.2em,
        text(fill: accent)[#sym.dot.c],
        text(size: 0.88em, fill: sidebar-palette.ink.lighten(10%))[#b],
      )
      #v(0.15em)
    ]
  ]
  #if tags.len() > 0 { sidebar-tag-row(..tags, accent: accent) }
  ]
}

#let sidebar-summary-block(body) = block(width: 100%, below: 0.4em)[
  #set text(size: 0.92em, fill: sidebar-palette.muted)
  #set par(justify: true, leading: 0.62em)
  #body
]

#let sidebar-resume(
  size: 10pt,
  accent: rgb("#2455a4"),
  sidebar-width: 32%,
  margin: (top: 0.8cm, bottom: 0.8cm, left: 1.5cm, right: 1.5cm),
  header: none,
  sidebar: none,
  main: none,
) = {
  set document(title: "简历")
  set page(paper: "a4", margin: margin, numbering: none)
  set text(font: (sidebar-font.main, sidebar-font.cjk), size: size, fill: sidebar-palette.ink, lang: "zh")
  set par(justify: true, leading: 0.58em)
  show link: set text(fill: accent)

  header

  grid(
    columns: (sidebar-width, 1fr),
    column-gutter: 1.1em,
    sidebar,
    main,
  )
}

// 极简风格（minimal- 前缀）：纯黑白灰，不用强调色 / 图标 / Logo / 照片，靠字重与留白做层次

#let minimal-font = (
  body: "Liberation Serif",
  cjk: "Noto Serif CJK SC",
  heading: "Noto Sans CJK SC",
)

#let minimal-ink = rgb("#1a1a1a")
#let minimal-gray = rgb("#767676")
#let minimal-rule = rgb("#cfcfcf")

#let minimal-resume(
  size: 10.5pt,
  margin: (top: 1.6cm, bottom: 1.6cm, left: 2cm, right: 2cm),
  name: "",
  meta: (),
  body,
) = {
  set document(title: name + " 简历")
  set page(paper: "a4", margin: margin, numbering: none)
  set text(font: (minimal-font.body, minimal-font.cjk), size: size, fill: minimal-ink, lang: "zh")
  set par(justify: false, leading: 0.65em)

  show heading: it => {
    v(1.1em)
    text(font: (minimal-font.heading, minimal-font.cjk), size: 1em, weight: "bold", tracking: 2pt)[
      #upper(it.body)
    ]
    v(0.35em)
    line(length: 100%, stroke: 0.4pt + minimal-rule)
    v(0.5em)
  }
  show link: set text(fill: minimal-ink, weight: "bold")

  align(center)[
    #text(font: (minimal-font.heading, minimal-font.cjk), size: 2em, weight: "bold", tracking: 3pt)[#name]
    #v(0.4em)
    #text(fill: minimal-gray, size: 0.92em)[
      #meta.join([  ·  ])
    ]
  ]

  body
}

#let minimal-section(title) = heading(title)

#let minimal-entry(title, subtitle: none, date: none) = block(width: 100%, above: 0.7em, below: 0.5em)[
  #grid(
    columns: (1fr, auto), align: (left, right),
    text(weight: "bold")[#title #if subtitle != none [#text(style: "italic", weight: "regular")[ — #subtitle]]],
    text(fill: minimal-gray, size: 0.9em)[#date],
  )
]

#let minimal-bullets(..items) = block(width: 100%, above: 0.15em, below: 0.4em)[
  #for it in items.pos() [
    #grid(columns: (0.9em, 1fr), column-gutter: 0.2em,
      text(fill: minimal-gray)[–],
      text(size: 0.95em)[#it],
    )
    #v(0.15em)
  ]
]

#let minimal-tags(..items) = block(width: 100%, above: 0.1em, below: 0.3em)[
  #text(size: 0.95em)[#items.pos().join([ ／ ])]
]

#let minimal-muted(body) = block(width: 100%, below: 0.4em)[
  #text(fill: minimal-gray, size: 0.92em, style: "italic")[#body]
]
