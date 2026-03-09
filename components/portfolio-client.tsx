"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Github, ExternalLink, ArrowRight, Play, Wrench, FileText } from "lucide-react"
import type { WorkLog, Observation, SOP, Work } from "@/lib/notion"

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
// Shared animation helper
// ─────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut", delay } },
})

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyState({ message = "暂无内容，请在 Notion 中添加。" }: { message?: string }) {
  return (
    <div
      className="py-20 text-center"
      style={{ color: "var(--text-muted)", fontSize: "13px" }}
    >
      {message}
    </div>
  )
}

// ─────────────────────────────────────────────
// Section: Work Log
// ─────────────────────────────────────────────
function WorkLogSection({ logs }: { logs: WorkLog[] }) {
  return (
    <div>
      <SectionHeader
        label="WORK LOG"
        subtitle="阶段性工作记录与项目进展"
      />

      {logs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute top-0 bottom-0"
            style={{ left: "calc(7rem + 1px)", width: "1px", background: "var(--border)" }}
          />

          <div className="space-y-0">
            {logs.map((log, i) => (
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
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Section: Observations
// ─────────────────────────────────────────────
function ObservationsSection({ observations }: { observations: Observation[] }) {
  return (
    <div>
      <SectionHeader
        label="OBSERVATIONS"
        subtitle="对前沿议题的持续观察与分析"
      />

      {observations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {observations.map((obs, i) => (
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
                  {obs.readTime && <span>{obs.readTime}</span>}
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
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Section: SOP / Workflows
// ─────────────────────────────────────────────
function SOPSection({ sops }: { sops: SOP[] }) {
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

      {sops.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {sops.map((sop, i) => (
            <motion.div
              key={sop.id}
              {...fadeUp(i * 0.07)}
              className="card-hover p-5 group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Badge row */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {sop.version && (
                      <span
                        className="font-mono-custom"
                        style={{ fontSize: "10px", color: "var(--orange)" }}
                      >
                        {sop.version}
                      </span>
                    )}
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
                    {sop.updated && (
                      <span
                        className="font-mono-custom"
                        style={{ fontSize: "10px", color: "var(--text-muted)" }}
                      >
                        Updated {sop.updated}
                      </span>
                    )}
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
                {sop.github && (
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
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
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
  work: Work
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

function WorksSection({ works }: { works: Work[] }) {
  const featured = works.find((w) => w.featured)
  const rest = works.filter((w) => !w.featured)

  return (
    <div>
      <SectionHeader
        label="PORTFOLIO"
        subtitle="文章、工具与创意作品"
      />

      {works.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Featured item — full bleed */}
          {featured && (
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
                {typeConfig[featured.type].glyphLarge}
              </div>

              <div
                className="flex items-center gap-2 mb-4 font-mono-custom"
                style={{ fontSize: "10px", color: "var(--orange)", letterSpacing: "0.12em" }}
              >
                {(() => { const Ic = typeConfig[featured.type].Icon; return <Ic size={12} /> })()}
                {typeConfig[featured.type].label}
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
          )}

          {/* Grid */}
          {rest.length > 0 && (
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
          )}
        </>
      )}
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
// Main Client Component
// ─────────────────────────────────────────────
export default function PortfolioClient({
  workLogs,
  observations,
  sops,
  works,
}: {
  workLogs: WorkLog[]
  observations: Observation[]
  sops: SOP[]
  works: Work[]
}) {
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
          {activeTab === "log"   && <WorkLogSection logs={workLogs} />}
          {activeTab === "obs"   && <ObservationsSection observations={observations} />}
          {activeTab === "sop"   && <SOPSection sops={sops} />}
          {activeTab === "works" && <WorksSection works={works} />}
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
