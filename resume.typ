#import "code/template.typ": *

// 简历模板 · 单栏高密度风格，把下面的占位内容换成你自己的信息，直接编译即可。
// 想用其他风格（侧栏卡片 / 极简）或看示例，去 code/src/ 里找。

#show: doc => resume(
  accent: rgb("#2458b8"), // 换主题色只改这一行（十六进制颜色）
  name: "你的姓名",
  meta: (
    (
      (icon: "icons/ui/phone.svg", content: "手机号码"),
      (icon: "icons/ui/envelope.svg", content: link("mailto:you@example.com", "you@example.com")),
      (icon: "icons/ui/wechat.svg", content: "微信号"),
    ),
    (
      (icon: "icons/ui/user.svg", content: "身份 · 目标岗位 · 到岗时间", strong: true),
    ),
    (
      (icon: "icons/ui/github.svg", content: "github.com/yourname"),
    ),
  ),
  doc,
)

#section("个人简介")
说明你的核心优势和求职意向。

#section("教育经历")
// 学校有校徽就加 logo: "icons/school/xxx.svg"（先去 code/icons/school/ 看看有没有对应的）
#entry-bar("学校名称", subtitle: "专业 · 学历", meta: "入学年月 - 毕业年月")

#section("实习 / 工作经历")

// 公司有官方 Logo 就加 logo: "icons/companies/xxx.svg"（先去 code/icons/companies/ 看看有没有对应的）
#entry-bar("公司名称", subtitle: "职位名称", meta: "起始年月 - 结束年月")
#project-title("项目 / 业务名称")
#bullets(
  [*背景与目标：*一句话说明业务背景和要解决的问题；*目标：*量化的目标。],
  [*我的职责：*你在其中的角色和职责范围。],
  (level: 1, body: [*执行链路：*具体做了什么、用了什么方法 / 技术。]),
  (level: 1, body: [*结果：*量化的结果，比如提升了多少百分比、节省了多少成本。]),
)

#section("项目经历")

#project-title("项目名称")
#bullets(
  [*项目背景与职责：*一句话说明项目背景和你的角色。],
  (level: 1, body: [*技术实现：*具体做了什么。]),
  (level: 1, body: [*结果：*量化的结果。]),
)

#section("竞赛获奖 / 证书")
// 竞赛 / 证书有对应 Logo 就加 logo: "icons/competitions/xxx.svg"（先去 code/icons/competitions/ 看看有没有对应的）
#entry-bar("奖项 / 证书名称", subtitle: "获奖等级", meta: "年月")

#section("技能")
// 有品牌 Logo 就用 (icon: "icons/tech/xxx.svg", label: "xxx")，没有就用纯文字字符串。
// 计算机二级 / 英语四六级 / 普通话证书这类没有专属 Logo 的证书直接写文字；
// 雅思 / 托福有官方 Logo，可用 (icon: "icons/certificates/ielts.svg" 或 "toefl.svg", label: "...", box-width: 2.3em)
#tool-line("技能 1", "技能 2", "技能 3")
