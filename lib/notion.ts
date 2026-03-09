import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// ─────────────────────────────────────────────
// Exported types (used by portfolio-client.tsx)
// ─────────────────────────────────────────────

export type WorkLog = {
  id: number
  date: string
  title: string
  body: string
  tags: string[]
}

export type Observation = {
  id: number
  date: string
  title: string
  excerpt: string
  tags: string[]
  readTime: string
  type: string
}

export type SOP = {
  id: number
  title: string
  description: string
  github: string
  status: "active" | "draft"
  version: string
  updated: string
  tags: string[]
}

export type Work = {
  id: number
  type: "article" | "video" | "tool"
  title: string
  description: string
  date: string
  link: string
  featured: boolean
  size: "featured" | "tall" | "wide" | "third"
}

// ─────────────────────────────────────────────
// Property helpers
// ─────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRichText(prop: any): string {
  return prop?.rich_text?.map((t: { plain_text: string }) => t.plain_text).join("") ?? ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTitle(prop: any): string {
  return prop?.title?.map((t: { plain_text: string }) => t.plain_text).join("") ?? ""
}

/** Returns YYYY.MM from a Notion date property */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDateMonthly(prop: any): string {
  const raw: string = prop?.date?.start ?? ""
  if (!raw) return ""
  return raw.slice(0, 7).replace("-", ".")
}

/** Returns YYYY.MM.DD from a Notion date property */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDateFull(prop: any): string {
  const raw: string = prop?.date?.start ?? ""
  if (!raw) return ""
  return raw.slice(0, 10).replace(/-/g, ".")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSelect(prop: any): string {
  return prop?.select?.name ?? ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMultiSelect(prop: any): string[] {
  return prop?.multi_select?.map((s: { name: string }) => s.name) ?? []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getUrl(prop: any): string {
  return prop?.url ?? ""
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCheckbox(prop: any): boolean {
  return prop?.checkbox ?? false
}

// ─────────────────────────────────────────────
// Fetchers
// ─────────────────────────────────────────────

export async function getWorkLogs(): Promise<WorkLog[]> {
  const dbId = process.env.NOTION_WORK_LOGS_DB
  if (!dbId) return []
  try {
    const res = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "Date", direction: "descending" }],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.results.map((page: any, i) => ({
      id: i + 1,
      date: getDateMonthly(page.properties.Date),
      title: getTitle(page.properties.Name),
      body: getRichText(page.properties.Body),
      tags: getMultiSelect(page.properties.Tags),
    }))
  } catch (e) {
    console.error("[Notion] Failed to fetch work logs:", e)
    return []
  }
}

export async function getObservations(): Promise<Observation[]> {
  const dbId = process.env.NOTION_OBSERVATIONS_DB
  if (!dbId) return []
  try {
    const res = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "Date", direction: "descending" }],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.results.map((page: any, i) => ({
      id: i + 1,
      date: getDateFull(page.properties.Date),
      title: getTitle(page.properties.Name),
      excerpt: getRichText(page.properties.Excerpt),
      tags: getMultiSelect(page.properties.Tags),
      readTime: getRichText(page.properties.ReadTime),
      type: getSelect(page.properties.Type),
    }))
  } catch (e) {
    console.error("[Notion] Failed to fetch observations:", e)
    return []
  }
}

export async function getSOPs(): Promise<SOP[]> {
  const dbId = process.env.NOTION_SOPS_DB
  if (!dbId) return []
  try {
    const res = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "Updated", direction: "descending" }],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.results.map((page: any, i) => {
      const rawStatus = getSelect(page.properties.Status)
      return {
        id: i + 1,
        title: getTitle(page.properties.Name),
        description: getRichText(page.properties.Description),
        github: getUrl(page.properties.GitHub),
        status: rawStatus === "active" ? ("active" as const) : ("draft" as const),
        version: getRichText(page.properties.Version),
        updated: getDateMonthly(page.properties.Updated),
        tags: getMultiSelect(page.properties.Tags),
      }
    })
  } catch (e) {
    console.error("[Notion] Failed to fetch SOPs:", e)
    return []
  }
}

export async function getWorks(): Promise<Work[]> {
  const dbId = process.env.NOTION_WORKS_DB
  if (!dbId) return []
  try {
    const res = await notion.databases.query({
      database_id: dbId,
      sorts: [{ property: "Date", direction: "descending" }],
    })
    const validTypes = ["article", "video", "tool"] as const
    const validSizes = ["featured", "tall", "wide", "third"] as const
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.results.map((page: any, i) => {
      const rawType = getSelect(page.properties.Type)
      const rawSize = getSelect(page.properties.Size)
      return {
        id: i + 1,
        type: validTypes.includes(rawType as typeof validTypes[number])
          ? (rawType as Work["type"])
          : "article",
        title: getTitle(page.properties.Name),
        description: getRichText(page.properties.Description),
        date: getDateMonthly(page.properties.Date),
        link: getUrl(page.properties.Link) || "#",
        featured: getCheckbox(page.properties.Featured),
        size: validSizes.includes(rawSize as typeof validSizes[number])
          ? (rawSize as Work["size"])
          : "third",
      }
    })
  } catch (e) {
    console.error("[Notion] Failed to fetch works:", e)
    return []
  }
}
