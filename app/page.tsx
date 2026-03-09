"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink, ArrowRight, Play, Wrench, FileText } from "lucide-react"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type TabId = "log" | "obs" | "sop" | "works"

const TABS: { id: TabId; cn: string; en: string }[] = [
  { id: "log",   cn: "工作日志", en: "WORK LOG" },
  { id: "obs",   cn: "近期观察", en: "OBSERVATIONS" },
  { id: "sop",   cn: "工作 SOP", en: "WORKFLOWS" },
  { id: "works", cn: "其他作品", en: "PORTFOLIO" },
]

// ─────────────────────────────────────────────
// Data — fill in your own content
// ─────────────────────────────────────────────
const WORK_LOGS = [
  {
    id: 1,
    date: "2025.03",
    title: "RWA合规框架研究",
    body: "完成对美国、欧盟、香港三地RWA监管框架的比较研究，识别跨境合规的关键风险节点与监管套利空间。",
    tags: ["RWA", "监管研究", "跨境合规"],
  },
  {
    id: 2,
    date: "2025.02",
    title: "数据跨境流动合规方案设计",
    body: "针对跨国企业设计符合GDPR及《数据安全法》双重要求的数据跨境传输合规框架，降低多法域执法风险。",
    tags: ["数据合规", "GDPR", "PIPL"],
  },
  {
    id: 3,
    date: "2025.01",
    title: "跨境刑事合规专题研究",
    body: "整理企业在应对多法域刑事风险时的核心策略，重点分析美国长臂管辖与境内属地管辖的交叉地带。",
    tags: ["刑事合规", "企业风险", "多法域"],
  },
  {
    id: 4,
    date: "2024.12",
    title: "Web3项目合规尽调方法论",
    body: "建立针对Web3项目的尽职调查标准流程，覆盖代币发行合规、AML/KYC要求及智能合约法律风险评估。",
    tags: ["Web3", "尽调", "AML"],
  },
]

const OBSERVATIONS = [
  {
    id: 1,
    date: "2025.03.15",
    title: "RWA：下一个合规蓝海",
    excerpt: "随着BlackRock等机构入场，RWA赛道的合规需求从模糊走向清晰。本文梳理当前监管空白与机会窗口，分析合规先行的战略价值。",
    tags: ["RWA", "Web3"],
    readTime: "6 min",
    type: "analysis",
  },
  {
    id: 2,
    date: "2025.03.08",
    title: "数据合规的新边界：从GDPR到AI Act",
    excerpt: "欧盟AI Act的落地将深刻改变企业数据合规的边界与成本结构，对中国出海企业影响尤为显著。",
    tags: ["数据合规", "AI监管"],
    readTime: "8 min",
    type: "research",
  },
  {
    id: 3,
    date: "2025.02.22",
    title: "跨境刑事合规：三个被忽视的风险",
    excerpt: "在多法域叠加的背景下，合规官往往低估了属地管辖权与长臂管辖的交叉风险，本文通过三个案例具体分析。",
    tags: ["刑事合规", "风险管理"],
    readTime: "10 min",
    type: "commentary",
  },
  {
    id: 4,
    date: "2025.02.10",
    title: "Web3企业的合规成本与竞争优势",
    excerpt: "合规从来不只是成本中心。在监管收紧的背景下，前置合规已成为一种差异化竞争策略——这一逻辑在RWA赛道尤为适用。",
    tags: ["Web3", "合规战略"],
    readTime: "5 min",
    type: "analysis",
  },
]

const SOPS = [
  {
    id: 1,
    title: "RWA合规尽调模板",
    description: "针对实物资产代币化项目的标准尽职调查流程，含监管映射矩阵与风险评分工具。",
    github: "https://github.com/",
    status: "active",
    version: "v1.2",
    updated: "2025.03",
    tags: ["RWA", "尽调"],
  },
  {
    id: 2,
    title: "跨境数据传输合规检查表",
    description: "覆盖GDPR、PIPL、《数据安全法》三法域的数据跨境传输评估工具，可直接用于企业内审。",
    github: "https://github.com/",
    status: "active",
    version: "v2.0",
    updated: "2025.02",
    tags: ["数据合规", "GDPR"],
  },
  {
    id: 3,
    title: "企业刑事合规计划框架",
    description: "参考美国DOJ、欧盟及中国相关指引整合而成的企业合规计划搭建SOP，适用于多法域经营的企业。",
    github: "https://github.com/",
    status: "draft",
    version: "v0.8",
    updated: "2025.01",
    tags: ["刑事合规", "企业合规"],
  },
  {
    id: 4,
    title: "Claude Skill 开发指南",
    description: "基于Anthropic Claude Agent SDK构建法律领域专用Skill的操作手册，含示例代码与测试方法。",
    github: "https://github.com/",
    status: "active",
    version: "v1.0",
    updated: "2025.03",
    tags: ["AI工具", "Claude SDK"],
  },
]

const WORKS = [
  {
    id: 1,
    type: "article" as const,
    title: "RWA监管框架的演进：机会与陷阱",
    description: "深度分析2024—2025年全球RWA监管演进路径，识别监管套利窗口与合规风险的边界。",
    date: "2025.02",
    link: "#",
    featured: true,
    size: "featured",
  },
  {
    id: 2,
    type: "tool" as const,
    title: "合规风险评估计算器",
    description: "帮助企业快速评估多法域合规风险指数的网页工具，覆盖美国、欧盟、中国三地主要法规。",
    date: "2025.01",
    link: "#",
    featured: false,
    size: "tall",
  },
  {
    id: 3,
    type: "video" as const,
    title: "RWA合规入门（三集系列）",
    description: "从监管视角解构实物资产代币化的核心合规问题，适合Web3从业者与律师参考。",
    date: "2024.12",
    link: "#",
    featured: false,
    size: "wide",
  },
  {
    id: 4,
    type: "article" as const,
    title: "数字经济时代的个人数据权利",
    description: "比较研究中欧美三地数据主体权利保护机制的深度评论。",
    date: "2024.11",
    link: "#",
    featured: false,
    size: "third",
  },
  {
    id: 5,
    type: "tool" as const,
    title: "跨境合规地图",
    description: "可交互的多法域合规要求可视化工具。",
    date: "2024.10",
    link: "#",
    featured: false,
    size: "third",
  },
  {
    id: 6,
    type: "article" as const,
    title: "企业合规的博弈论视角",
    description: "用博弈论分析监管者与企业的合规博弈均衡。",
    date: "2024.09",
    link: "#",
    featured: false,
    size: "third",
  },
]

// ─────────────────────────────────────────────
// Shared animation helper
// ─────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut", delay } },
})

// ─────────────────────────────────────────────
// Section: Work Log
// ─────────────────────────────────────────────
function WorkLogSection() {
  return (
    <div>
      <SectionHeader
        label="WORK LOG"
        subtitle="阶段性工作记录与项目进展"
      />

      <div className="relative">
        {/* Vertical timeline line */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "calc(7rem + 1px)", width: "1px", background: "var(--border)" }}
        />

        <div className="space-y-0">
          {WORK_LOGS.map((log, i) => (
            <motion.div
              key={log.id}
              {...fadeUp(i * 0.07)}
              className="flex gap-0 group"
            >
              {/* Date */}
              <div className="flex-shrink-0 pt-1 text-right" style={{ width: "7rem" }}>
                <span
                  className="font-mono-custom"
                  style={{ fontSize: "11px", color: "var(--orange)", letterSpacing: "0.05em" }}
                >
                  {log.date}
                </span>
              </div>

              {/* Timeline dot */}
              <div className="flex-shrink-0 flex flex-col items-center" style={{ width: "28px" }}>
                <div
                  className="mt-[6px] w-[9px] h-[9px] rounded-full border transition-all duration-300 z-10"
                  style={{
                    borderColor: "var(--orange)",
                    background: "var(--bg)",
                  }}
                />
                <div className="flex-1" />
              </div>

              {/* Content */}
              <div
                className="flex-1 pb-10 pr-2"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <h3
                  className="mb-2 transition-colors duration-200 group-hover:text-[var(--orange)]"
                  style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}
                >
                  {log.title}
                </h3>
                <p
                  className="mb-4 leading-relaxed"
                  style={{ fontSize: "13px", color: "var(--text-muted)" }}
                >
                  {log.body}
                </p>
                <div className="flex flex-wrap gap-2">
                  {log.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Section: Observations
// ─────────────────────────────────────────────
function ObservationsSection() {
  return (
    <div>
      <SectionHeader
        label="OBSERVATIONS"
        subtitle="对前沿议题的持续观察与分析"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {OBSERVATIONS.map((obs, i) => (
          <motion.article
            key={obs.id}
            {...fadeUp(i * 0.07)}
            className="card-hover p-6 cursor-pointer group"
          >
            {/* Meta row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-3">
                {obs.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono-custom"
                    style={{ fontSize: "10px", color: "var(--orange)", letterSpacing: "0.1em" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="flex items-center gap-3 font-mono-custom"
                style={{ fontSize: "10px", color: "var(--text-muted)" }}
              >
                <span>{obs.readTime}</span>
                <span>{obs.date}</span>
              </div>
            </div>

            {/* Title */}
            <h3
              className="mb-3 leading-snug transition-colors duration-200 group-hover:text-[var(--orange)]"
              style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}
            >
              {obs.title}
            </h3>

            {/* Excerpt */}
            <p
              className="mb-5 leading-relaxed"
              style={{ fontSize: "13px", color: "var(--text-muted)" }}
            >
              {obs.excerpt}
            </p>

            {/* Read more */}
            <div
              className="flex items-center gap-1 font-mono-custom transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0"
              style={{ fontSize: "10px", color: "var(--orange)", letterSpacing: "0.1em" }}
            >
              READ MORE <ArrowRight size={11} className="ml-1" />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Section: SOP / Workflows
// ─────────────────────────────────────────────
function SOPSection() {
  return (
    <div>
      <div className="flex items-start justify-between mb-10 gap-4">
        <SectionHeader
          label="WORKFLOWS & SOP"
          subtitle="标准化作业流程与工具模板，持续迭代中"
          noMargin
        />
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-2 font-mono-custom transition-all duration-200 nav-link-line px-3 py-2"
          style={{
            fontSize: "10px",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            letterSpacing: "0.1em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--orange)"
            e.currentTarget.style.borderColor = "var(--orange)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)"
            e.currentTarget.style.borderColor = "var(--border)"
          }}
        >
          <Github size={13} />
          VIEW ON GITHUB
        </a>
      </div>

      <div className="space-y-3">
        {SOPS.map((sop, i) => (
          <motion.div
            key={sop.id}
            {...fadeUp(i * 0.07)}
            className="card-hover p-5 group"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                {/* Badge row */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span
                    className="font-mono-custom"
                    style={{ fontSize: "10px", color: "var(--orange)" }}
                  >
                    {sop.version}
                  </span>
                  <span
                    className="font-mono-custom flex items-center"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.08em",
                      color: sop.status === "active" ? "var(--orange)" : "var(--text-muted)",
                      background: sop.status === "active" ? "var(--orange-dim)" : "transparent",
                      border: `1px solid ${sop.status === "active" ? "rgba(224,96,48,0.3)" : "var(--border)"}`,
                      padding: "1px 7px",
                    }}
                  >
                    {sop.status === "active" ? "● ACTIVE" : "○ DRAFT"}
                  </span>
                  <span
                    className="font-mono-custom"
                    style={{ fontSize: "10px", color: "var(--text-muted)" }}
                  >
                    Updated {sop.updated}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="mb-2 transition-colors duration-200 group-hover:text-[var(--orange)]"
                  style={{ fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}
                >
                  {sop.title}
                </h3>

                {/* Description */}
                <p
                  className="mb-4 leading-relaxed"
                  style={{ fontSize: "13px", color: "var(--text-muted)" }}
                >
                  {sop.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {sop.tags.map((tag) => (
                    <span key={tag} className="tag-pill font-mono-custom">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* GitHub link */}
              <a
                href={sop.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 transition-all duration-200"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--orange)"
                  e.currentTarget.style.borderColor = "var(--orange)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-muted)"
                  e.currentTarget.style.borderColor = "var(--border)"
                }}
              >
                <Github size={15} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Section: Works / Portfolio
// ─────────────────────────────────────────────
const typeConfig = {
  article: {
    label: "ARTICLE",
    Icon: FileText,
    glyphLarge: "文",
    color: "var(--orange)",
  },
  video: {
    label: "VIDEO",
    Icon: Play,
    glyphLarge: "▶",
    color: "var(--text-secondary)",
  },
  tool: {
    label: "TOOL",
    Icon: Wrench,
    glyphLarge: "{ }",
    color: "var(--brown)",
  },
}

function WorkCard({
  work,
  delay = 0,
  className = "",
  style = {},
}: {
  work: typeof WORKS[number]
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const cfg = typeConfig[work.type]

  return (
    <motion.a
      href={work.link}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      className={"block group relative overflow-hidden card-hover " + className}
      style={{ padding: "24px", minHeight: "160px", ...style }}
    >
      {/* Decorative large glyph */}
      <div
        className="absolute right-4 bottom-2 select-none pointer-events-none transition-all duration-500 group-hover:opacity-[0.08] font-mono-custom"
        style={{
          fontSize: "5rem",
          lineHeight: 1,
          color: cfg.color,
          opacity: 0.04,
          letterSpacing: "-0.05em",
        }}
      >
        {cfg.glyphLarge}
      </div>

      {/* Type label */}
      <div
        className="flex items-center gap-2 mb-4 font-mono-custom"
        style={{ fontSize: "10px", color: cfg.color, letterSpacing: "0.1em" }}
      >
        <cfg.Icon size={11} />
        {cfg.label}
      </div>

      {/* Title */}
      <h3
        className="mb-2 leading-snug transition-colors duration-200 group-hover:text-[var(--orange)]"
        style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}
      >
        {work.title}
      </h3>

      {/* Description */}
      <p
        className="mb-4 leading-relaxed"
        style={{ fontSize: "12px", color: "var(--text-muted)" }}
      >
        {work.description}
      </p>

      {/* Date + arrow */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono-custom"
          style={{ fontSize: "10px", color: "var(--text-muted)" }}
        >
          {work.date}
        </span>
        <ArrowRight
          size={12}
          className="transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
          style={{ color: "var(--orange)" }}
        />
      </div>
    </motion.a>
  )
}

function WorksSection() {
  const featured = WORKS.find((w) => w.featured)!
  const rest = WORKS.filter((w) => !w.featured)

  return (
    <div>
      <SectionHeader
        label="PORTFOLIO"
        subtitle="文章、工具与创意作品"
      />

      {/* Featured item — full bleed */}
      <motion.a
        href={featured.link}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="block group relative overflow-hidden mb-3"
        style={{
          border: "1px solid rgba(224,96,48,0.25)",
          background: "linear-gradient(135deg, rgba(224,96,48,0.06) 0%, var(--bg-surface) 60%)",
          padding: "36px 40px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--orange)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(224,96,48,0.25)"
        }}
      >
        {/* Decorative label */}
        <div
          className="absolute top-5 right-5 font-mono-custom"
          style={{ fontSize: "9px", color: "var(--orange)", opacity: 0.5, letterSpacing: "0.2em" }}
        >
          FEATURED
        </div>

        {/* Large decorative character */}
        <div
          className="absolute -bottom-6 -right-4 select-none pointer-events-none font-mono-custom"
          style={{ fontSize: "9rem", color: "var(--orange)", opacity: 0.04, lineHeight: 1 }}
        >
          文
        </div>

        <div
          className="flex items-center gap-2 mb-4 font-mono-custom"
          style={{ fontSize: "10px", color: "var(--orange)", letterSpacing: "0.12em" }}
        >
          <FileText size={12} />
          ARTICLE
        </div>

        <h3
          className="mb-3 transition-colors duration-300 group-hover:text-[var(--orange-light)]"
          style={{
            fontSize: "22px",
            fontWeight: 300,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            maxWidth: "600px",
          }}
        >
          {featured.title}
        </h3>

        <p
          className="mb-6 leading-relaxed"
          style={{ fontSize: "14px", color: "var(--text-muted)", maxWidth: "560px" }}
        >
          {featured.description}
        </p>

        <div
          className="inline-flex items-center gap-2 font-mono-custom transition-all duration-200 group-hover:gap-3"
          style={{ fontSize: "11px", color: "var(--orange)", letterSpacing: "0.1em" }}
        >
          EXPLORE <ArrowRight size={12} />
        </div>
      </motion.a>

      {/* Grid */}
      <div className="works-grid">
        {rest.map((work, i) => {
          const colClass =
            work.size === "tall"
              ? "works-tall"
              : work.size === "wide"
              ? "works-wide"
              : "works-third"
          const isVideo = work.type === "video"
          return (
            <WorkCard
              key={work.id}
              work={work}
              delay={0.1 + i * 0.07}
              className={colClass}
              style={isVideo ? { minHeight: "200px" } : {}}
            />
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Shared: SectionHeader
// ─────────────────────────────────────────────
function SectionHeader({
  label,
  subtitle,
  noMargin = false,
}: {
  label: string
  subtitle: string
  noMargin?: boolean
}) {
  return (
    <div className={noMargin ? "" : "mb-10"}>
      <div className="flex items-center gap-3 mb-2">
        <div className="accent-bar h-4" />
        <span
          className="font-mono-custom"
          style={{ fontSize: "10px", color: "var(--orange)", letterSpacing: "0.25em" }}
        >
          {label}
        </span>
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{subtitle}</p>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<TabId>("log")

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-primary)" }}>

      {/* Dot grid background */}
      <div
        className="dot-grid fixed inset-0 pointer-events-none"
        style={{ opacity: 0.35, zIndex: 0 }}
      />

      {/* ── Header ── */}
      <header
        className="relative"
        style={{ borderBottom: "1px solid var(--border)", zIndex: 10 }}
      >
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">

          {/* Identity row */}
          <div className="flex items-start justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                {/* Orange accent bar */}
                <div style={{ width: "3px", height: "28px", background: "var(--orange)", flexShrink: 0 }} />
                <h1
                  style={{
                    fontSize: "22px",
                    fontWeight: 300,
                    letterSpacing: "0.12em",
                    color: "var(--text-primary)",
                  }}
                >
                  YOUR NAME
                </h1>
              </div>
              <p
                className="font-mono-custom pl-[19px]"
                style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.2em" }}
              >
                LEGAL TECH · RWA COMPLIANCE · DATA LAW · CRIMINAL COMPLIANCE
              </p>
            </div>

            {/* Availability */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0 mt-1">
              <div
                className="w-[6px] h-[6px] rounded-full"
                style={{ background: "var(--orange)", boxShadow: "0 0 6px var(--orange)", animation: "pulse-glow 2s infinite" }}
              />
              <span
                className="font-mono-custom"
                style={{ fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.2em" }}
              >
                OPEN TO WORK
              </span>
            </div>
          </div>

          {/* Tab navigation */}
          <nav className="flex gap-0 -mb-px">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-5 py-3 transition-all duration-200 group text-left"
                  style={{
                    borderBottom: isActive
                      ? "1px solid var(--orange)"
                      : "1px solid transparent",
                    color: isActive ? "var(--orange)" : "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--text-secondary)"
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = "var(--text-muted)"
                  }}
                >
                  <span style={{ fontSize: "14px", fontWeight: 300, display: "block", marginBottom: "1px" }}>
                    {tab.cn}
                  </span>
                  <span
                    className="font-mono-custom"
                    style={{ fontSize: "9px", letterSpacing: "0.2em", opacity: 0.5, display: "block" }}
                  >
                    {tab.en}
                  </span>

                  {/* Hover underline (inactive tabs) */}
                  {!isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-px transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
                      style={{ background: "var(--border-light)" }}
                    />
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        className="relative max-w-5xl mx-auto px-6 py-14"
        style={{ zIndex: 10 }}
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {activeTab === "log"   && <WorkLogSection />}
          {activeTab === "obs"   && <ObservationsSection />}
          {activeTab === "sop"   && <SOPSection />}
          {activeTab === "works" && <WorksSection />}
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative mt-20"
        style={{ borderTop: "1px solid var(--border)", zIndex: 10 }}
      >
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

            {/* Research areas */}
            <div>
              <h3
                className="font-mono-custom mb-5"
                style={{ fontSize: "9px", color: "var(--orange)", letterSpacing: "0.3em" }}
              >
                研究领域
              </h3>
              <ul className="space-y-[10px]">
                {[
                  "实物资产代币化（RWA）",
                  "跨境刑事合规",
                  "数据合规与隐私保护",
                  "Web3 监管框架",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3"
                    style={{ fontSize: "13px", color: "var(--text-muted)" }}
                  >
                    <span style={{ color: "var(--orange)", marginTop: "1px" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Background */}
            <div>
              <h3
                className="font-mono-custom mb-5"
                style={{ fontSize: "9px", color: "var(--orange)", letterSpacing: "0.3em" }}
              >
                背景
              </h3>
              <ul className="space-y-[10px]">
                {[
                  { label: "就职于", value: "[公司名称]" },
                  { label: "学历", value: "[学校 · 学位/专业]" },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-3"
                    style={{ fontSize: "13px", color: "var(--text-muted)" }}
                  >
                    <span style={{ color: "var(--orange)", marginTop: "1px" }}>—</span>
                    <span>
                      <span style={{ color: "var(--text-muted)" }}>{item.label}：</span>
                      {item.value}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-3 pt-2">
                  <span style={{ color: "var(--orange)", marginTop: "1px", fontSize: "13px" }}>—</span>
                  <a
                    href="#"
                    className="flex items-center gap-1 transition-colors duration-200"
                    style={{ fontSize: "13px", color: "var(--text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--orange)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    个人简历 <ExternalLink size={11} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3
                className="font-mono-custom mb-5"
                style={{ fontSize: "9px", color: "var(--orange)", letterSpacing: "0.3em" }}
              >
                联系方式
              </h3>
              <ul className="space-y-[10px]">
                {[
                  { label: "Email",    value: "your@email.com",       href: "mailto:your@email.com" },
                  { label: "LinkedIn", value: "linkedin.com/in/xxx",  href: "#" },
                  { label: "GitHub",   value: "github.com/xxx",       href: "#" },
                ].map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <span style={{ color: "var(--orange)", marginTop: "1px", fontSize: "13px" }}>—</span>
                    <a
                      href={c.href}
                      className="transition-colors duration-200"
                      style={{ fontSize: "13px", color: "var(--text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--orange)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex items-center justify-between pt-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <span
              className="font-mono-custom"
              style={{ fontSize: "10px", color: "var(--border-light)", letterSpacing: "0.08em" }}
            >
              © 2025 · YOUR NAME
            </span>
            <span
              className="font-mono-custom"
              style={{ fontSize: "10px", color: "var(--border-light)", letterSpacing: "0.08em" }}
            >
              NEXT.JS · VERCEL
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
