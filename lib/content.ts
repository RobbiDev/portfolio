import fs from "fs"
import path from "path"
import type { GalleryImage } from "./types"

/**
 * Every piece of writing on the site is a markdown file under content/.
 * Published items live at the root of their folder; anything still being
 * worked on lives in an in-process/ subfolder and is surfaced as a draft.
 */
export type ContentKind = "project" | "post"

export interface Author {
  name: string
  role?: string
  email?: string
}

export interface ContentItem {
  kind: ContentKind
  slug: string
  draft: boolean
  title: string
  summary: string
  content: string
  date?: string
  categories: string[]
  tags: string[]
  technologies: string[]
  authors: Author[]
  location?: string
  featured: boolean
  accent?: string
  coverImage?: string
  gallery: GalleryImage[]
  readingMinutes: number
  /* project-only */
  client?: string
  timeline?: string
  role?: string
  status?: string
  liveUrl?: string
  githubUrl?: string
  features?: string[]
}

/** Roughly 200 words a minute, floored at one. */
export function estimateReadingTime(content: string): { minutes: number; words: number } {
  const words = content.split(/\s+/).filter(Boolean).length
  return { minutes: Math.max(1, Math.round(words / 200)), words }
}

const CONTENT_ROOT = path.join(process.cwd(), "content")

/** Markdown files carry a JSON header fenced by `===` lines. */
function parseMarkdown(fileContents: string): { metadata: Record<string, any>; body: string } {
  const match = fileContents.match(/^===\s*([\s\S]*?)\s*===\s*([\s\S]*)$/)
  if (!match) {
    throw new Error("Missing `===` metadata delimiters")
  }

  return { metadata: JSON.parse(match[1].trim()), body: match[2].trim() }
}

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((entry): entry is string => typeof entry === "string")
  if (typeof value === "string" && value.trim()) return [value.trim()]
  return []
}

function toAuthors(metadata: Record<string, any>): Author[] {
  const raw = metadata.authors
  if (Array.isArray(raw) && raw.length > 0) {
    return raw
      .map((entry) => (typeof entry === "string" ? { name: entry } : entry))
      .filter((entry): entry is Author => Boolean(entry && typeof entry.name === "string"))
  }

  return typeof metadata.author === "string" ? [{ name: metadata.author }] : []
}

function toGallery(value: unknown): GalleryImage[] {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => (entry ? { ...entry, url: resolveMedia(entry.url) } : null))
    .filter((entry): entry is GalleryImage => Boolean(entry?.url))
}

/**
 * Cover art is optional: the design falls back to its own generated postcard
 * art, which beats a broken image. So only hand back paths that actually
 * resolve — a remote URL, a data URI, or a file that exists in public/.
 */
export function resolveMedia(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined

  const trimmed = value.trim()
  if (!trimmed || trimmed === "/") return undefined
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) return trimmed

  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
  const filePath = path.join(process.cwd(), "public", normalized.split("?")[0].split("#")[0])
  return fs.existsSync(filePath) ? normalized : undefined
}

export function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-")
}

function readItem(filePath: string, kind: ContentKind, draft: boolean): ContentItem | null {
  const slug = path.basename(filePath, ".md")

  try {
    const { metadata, body } = parseMarkdown(fs.readFileSync(filePath, "utf8"))
    const title = typeof metadata.title === "string" ? metadata.title : slug

    return {
      kind,
      slug,
      draft,
      title,
      summary: metadata.summary || metadata.excerpt || "",
      content: body,
      date: metadata.date || metadata.createdAt,
      categories: toArray(metadata.category),
      tags: toArray(metadata.tags),
      technologies: toArray(metadata.technologies ?? metadata.tech),
      authors: toAuthors(metadata),
      location: typeof metadata.location === "string" ? metadata.location : undefined,
      featured: metadata.featured === true,
      accent: metadata.projectColor || metadata.blogColor || metadata.coverImageColor,
      coverImage: resolveMedia(metadata.coverImage),
      gallery: toGallery(metadata.gallery ?? metadata.images),
      readingMinutes: estimateReadingTime(body).minutes,
      client: metadata.client,
      timeline: metadata.timeline,
      role: metadata.role,
      status: metadata.status,
      liveUrl: metadata.liveUrl,
      githubUrl: metadata.githubUrl,
      features: toArray(metadata.features),
    }
  } catch (error) {
    console.error(`Skipping ${path.relative(process.cwd(), filePath)}:`, error)
    return null
  }
}

function readFolder(folder: string, kind: ContentKind, draft: boolean): ContentItem[] {
  if (!fs.existsSync(folder)) return []

  return fs
    .readdirSync(folder)
    .filter((name) => name.endsWith(".md") && !name.endsWith(".template.md"))
    .map((name) => readItem(path.join(folder, name), kind, draft))
    .filter((item): item is ContentItem => item !== null)
}

/** Newest first, with undated items last but stable by title. */
function byDateDesc(a: ContentItem, b: ContentItem): number {
  const aTime = a.date ? new Date(a.date).getTime() : Number.NaN
  const bTime = b.date ? new Date(b.date).getTime() : Number.NaN
  if (Number.isNaN(aTime) && Number.isNaN(bTime)) return a.title.localeCompare(b.title)
  if (Number.isNaN(aTime)) return 1
  if (Number.isNaN(bTime)) return -1
  return bTime - aTime
}

export function getProjects(): ContentItem[] {
  const dir = path.join(CONTENT_ROOT, "projects")
  return [...readFolder(dir, "project", false), ...readFolder(path.join(dir, "in-process"), "project", true)].sort(
    (a, b) => {
      if (a.draft !== b.draft) return a.draft ? 1 : -1
      return byDateDesc(a, b)
    },
  )
}

export function getPosts(): ContentItem[] {
  const dir = path.join(CONTENT_ROOT, "blog")
  return [...readFolder(dir, "post", false), ...readFolder(path.join(dir, "in-process"), "post", true)].sort((a, b) => {
    if (a.draft !== b.draft) return a.draft ? 1 : -1
    return byDateDesc(a, b)
  })
}
