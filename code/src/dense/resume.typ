#import "../../template.typ": *

// 单栏高密度风格版本：算法 / 后端工程师，目标大厂（含 Google）+ 竞赛背景
#show: doc => resume(
  size: 8.6pt,
  accent: rgb("#2458b8"),
  name: "张三",
  meta: (
    (
      (icon: "icons/ui/phone.svg", content: "138-0000-0000"),
      (icon: "icons/ui/envelope.svg", content: link("mailto:zhangsan@example.com", "zhangsan@example.com")),
      (icon: "icons/ui/wechat.svg", content: "zhangsan"),
    ),
    (
      (icon: "icons/ui/user.svg", content: "硕士在读 · 目标岗位：后端 / 算法工程师 · 可随时到岗", strong: true),
    ),
    (
      (icon: "icons/ui/github.svg", content: "github.com/zhangsan"),
      (icon: "icons/tech/leetcode.svg", content: "LeetCode Rating 2100+"),
      (icon: "icons/tech/kaggle.svg", content: "Kaggle Competitions Expert"),
    ),
  ),
  doc,
)

#section("个人简介")
计算机科学与技术硕士在读，有 Google、字节跳动后端实习经历，主导过分布式 KV 存储引擎等个人项目，能独立完成从问题定位、方案设计到上线验证的全流程。

#section("教育经历")
#entry-bar("某某大学", subtitle: "计算机科学与技术 · 硕士", meta: "2022.09 - 2025.06")
#entry-bar("某某大学", subtitle: "计算机科学与技术 · 本科", meta: "2018.09 - 2022.06")

#section("技能")
#tool-line(
  (icon: "icons/tech/go.svg", label: "Go", fill: rgb("#00ADD8")),
  (icon: "icons/tech/cplusplus.svg", label: "C++", fill: rgb("#00599C")),
  (icon: "icons/tech/python.svg", label: "Python", fill: rgb("#3776AB")),
  (icon: "icons/tech/mysql.svg", label: "MySQL", fill: rgb("#4479A1")),
  (icon: "icons/tech/redis.svg", label: "Redis", fill: rgb("#FF4438")),
  (icon: "icons/tech/kubernetes.svg", label: "Kubernetes", fill: rgb("#326CE5")),
  (icon: "icons/tech/linux.svg", label: "Linux", fill: rgb("#FCC624")),
  (icon: "icons/tech/git.svg", label: "Git", fill: rgb("#F03C2E")),
)
#bullets(
  [熟悉分布式系统设计模式（一致性哈希、Raft、MQ 削峰）与常见中间件原理，能独立排查线上性能问题。],
)

#section("实习经历")

#entry-bar("Google（虚构示例）", subtitle: "软件工程实习生", logo: "icons/companies/google.svg", meta: "2024.06 - 2024.09")
#project-title("Search Infra Reliability", "分布式索引服务的稳定性优化")
#bullets(
  [*背景与目标：*索引服务在业务高峰期存在延迟毛刺，P99 延迟偶发超过 200ms；*目标：*将 P99 延迟稳定压制在 50ms 以内。],
  [*我的职责：*该稳定性优化模块 owner，独立完成从问题定位、方案设计到上线验证的全流程。],
  (level: 1, body: [*执行链路：*引入 #code("shadow read") 影子流量对比新旧链路耗时分布，结合火焰图定位到批量 GC 停顿是主因。]),
  (level: 1, body: [*工程化：*落地分代 GC 参数调优与请求优先级队列，配合灰度发布分批上线，P99 延迟下降 42%，相关经验沉淀为团队内部文档。]),
)

#entry-bar("字节跳动（虚构示例）", subtitle: "后端开发实习生", logo: "icons/companies/bytedance.svg", meta: "2023.06 - 2023.09")
#project-title("Feature Platform Optimization", "推荐系统特征平台性能优化")
#bullets(
  [*背景与目标：*特征平台单次请求需聚合 200+ 特征，高峰期平均响应时间超过 SLA；*目标：*在不降低特征覆盖率的前提下压缩响应时间。],
  [*我的职责：*负责特征聚合链路的性能画像与优化落地，配合团队完成上线验收。],
  (level: 1, body: [*技术实现：*按访问频次对特征做冷热分层，热特征放入本地缓存 + #code("singleflight") 合并回源请求，降低下游 QPS 峰值。]),
  (level: 1, body: [*成果：*平台平均响应时间从 180ms 降至 95ms，下游存储 QPS 降低 30%，方案推广至另外 2 个特征域。]),
)

#section("竞赛获奖")
#entry-bar("ACM-ICPC 国际大学生程序设计竞赛", logo: "icons/competitions/icpc.svg", subtitle: "亚洲区域赛银奖", meta: "2021.11")
#entry-bar("CCPC 中国大学生程序设计竞赛", logo: "icons/competitions/ccpc.svg", subtitle: "省赛金奖", meta: "2021.05")
#entry-bar("蓝桥杯全国软件和信息技术专业人才大赛", logo: "icons/competitions/lanqiao.svg", subtitle: "省级一等奖", meta: "2020.05")

#section("项目经历")

#project-title("MiniKV", "支持 Raft 一致性协议的分布式 KV 存储引擎（个人项目）")
#bullets(
  [*项目背景与职责：*为深入理解分布式一致性协议，独立设计并实现一个精简版分布式 KV 存储引擎，代码开源于 GitHub。],
  (level: 1, body: [*技术实现：*基于 Go 实现 Raft 选主 / 日志复制 / 快照，存储层采用 LSM-Tree，支持线性一致读。]),
  (level: 1, body: [*结果：*通过 Jepsen 风格的网络分区测试验证一致性正确性，GitHub 获 300+ Star。]),
)

#project-title("竞赛训练平台", "面向校内 ACM 集训队的判题与训练系统")
#bullets(
  [*项目背景与职责：*校内集训队缺少统一题库与判题工具；作为项目负责人，主导后端判题服务设计，带队 3 人在 1 个月内完成上线。],
  (level: 1, body: [*技术实现与结果：*基于 Docker 沙箱隔离执行用户提交代码，支持 C++ / Python / Java 多语言判题；上线后服务校内集训队 100+ 人次。]),
)
