import fs from "fs"
import path from "path"
import type { Category, GalleryImage } from "./types"

export interface Project {
  slug: string
  title: string
  summary: string
  category: string[]
  technologies: string[]
  coverImage: string
  coverImageColor?: string
  content?: string
  client?: string
  timeline?: string
  role?: string
  liveUrl?: string
  githubUrl?: string
  features?: string[]
  images?: GalleryImage[]
  gallery?: GalleryImage[]
  relatedProjects?: { slug: string; title: string; category: string; summary: string }[]
}

function normalizeCategories(category: unknown): string[] {
  if (Array.isArray(category)) {
    return category.filter((item): item is string => typeof item === "string")
  }

  if (typeof category === "string") {
    return [category]
  }

  return []
}

export function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-")
}

function parseHexColor(value: unknown): { r: number; g: number; b: number } | null {
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (!match) return null

  const hex = match[1]
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    return { r, g, b }
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return { r, g, b }
}

function mixChannel(channelA: number, channelB: number, weight: number): number {
  return Math.round(channelA * (1 - weight) + channelB * weight)
}

function mixColors(
  colorA: { r: number; g: number; b: number },
  colorB: { r: number; g: number; b: number },
  weight: number,
): { r: number; g: number; b: number } {
  return {
    r: mixChannel(colorA.r, colorB.r, weight),
    g: mixChannel(colorA.g, colorB.g, weight),
    b: mixChannel(colorA.b, colorB.b, weight),
  }
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, value))
}

function toRgb(color: { r: number; g: number; b: number }): string {
  return `rgb(${clampChannel(color.r)}, ${clampChannel(color.g)}, ${clampChannel(color.b)})`
}

function getThumbnailGradient(coverImageColor?: unknown): { edge: string; center: string } {
  const base = parseHexColor(coverImageColor)
  if (!base) {
    return {
      edge: "rgb(16, 16, 16)",
      center: "rgb(255, 255, 255)",
    }
  }

  const mixed = mixColors(base, { r: 255, g: 255, b: 255 }, 0.25)

  return {
    edge: toRgb(base),
    center: toRgb(mixed),
  }
}

export function createTitleThumbnail(title: string, coverImageColor?: unknown): string {
  const gradient = getThumbnailGradient(coverImageColor)
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="wave" x1="0%" y1="15%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="${gradient.center}" stop-opacity="0" />
      <stop offset="34%" stop-color="${gradient.center}" stop-opacity="0.7" />
      <stop offset="52%" stop-color="${gradient.center}" stop-opacity="1" />
      <stop offset="72%" stop-color="${gradient.center}" stop-opacity="0.5" />
      <stop offset="100%" stop-color="${gradient.center}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="waveSoft" x1="10%" y1="95%" x2="95%" y2="5%">
      <stop offset="0%" stop-color="${gradient.edge}" stop-opacity="0.15" />
      <stop offset="50%" stop-color="${gradient.edge}" stop-opacity="0" />
      <stop offset="100%" stop-color="${gradient.edge}" stop-opacity="0.1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="${gradient.edge}" />
  <rect width="1200" height="675" fill="url(#wave)" />
  <rect width="1200" height="675" fill="url(#waveSoft)" />
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function resolveCoverImage(coverImage: unknown, title: string, coverImageColor?: unknown): string {
  if (typeof coverImage === "string") {
    const trimmed = coverImage.trim()
    if (trimmed) {
      if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
        return trimmed
      }

      const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
      const cleanPath = normalized.split("?")[0].split("#")[0]
      const publicPath = path.join(process.cwd(), "public", cleanPath)
      if (fs.existsSync(publicPath)) {
        return normalized
      }
    }
  }

  return createTitleThumbnail(title, coverImageColor)
}

export function getAllProjectSlugs(): string[] {
  try {
    const projectsDirectory = path.join(process.cwd(), "content", "projects")
    console.log("Looking for projects in:", projectsDirectory)

    if (!fs.existsSync(projectsDirectory)) {
      console.warn("Projects directory does not exist:", projectsDirectory)
      fs.mkdirSync(projectsDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    console.log("Found project files:", fileNames)
    return fileNames.filter((fileName) => fileName.endsWith(".md")).map((fileName) => fileName.replace(/\.md$/, ""))
  } catch (error) {
    console.error("Error reading project slugs:", error)
    return []
  }
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const projectsDirectory = path.join(process.cwd(), "content", "projects")
    const fullPath = path.join(projectsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Project file not found: ${fullPath}`)
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    console.log(`Read project file: ${fullPath}`)

    const { metadata, content } = parseMarkdownWithMetadata(fileContents)

    return {
      ...metadata,
      category: normalizeCategories(metadata.category),
      coverImage: resolveCoverImage(metadata.coverImage, metadata.title, metadata.coverImageColor),
      coverImageColor: typeof metadata.coverImageColor === "string" ? metadata.coverImageColor : undefined,
      content,
      slug,
    } as Project
  } catch (error) {
    console.error(`Error reading project file for slug ${slug}:`, error)
    return null
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsDirectory = path.join(process.cwd(), "content", "projects")
    console.log("Getting all projects from:", projectsDirectory)

    if (!fs.existsSync(projectsDirectory)) {
      console.warn("Projects directory does not exist:", projectsDirectory)
      fs.mkdirSync(projectsDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(projectsDirectory)
    console.log("Found project files for processing:", fileNames)

    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith(".md"))
    if (markdownFiles.length === 0) {
      return []
    }

    return processProjectFiles(fileNames, projectsDirectory)
  } catch (error) {
    console.error("Error in getAllProjects:", error)
    return []
  }
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await getAllProjects()
  const categorySlug = slugifyCategory(category)
  return projects.filter((project) => project.category.some((entry) => slugifyCategory(entry) === categorySlug))
}

export async function getProjectCategories(): Promise<Category[]> {
  const projects = await getAllProjects()
  const categoryMap = new Map<string, { name: string; count: number }>()

  projects.forEach((project) => {
    project.category.forEach((entry) => {
      const categorySlug = slugifyCategory(entry)
      const existing = categoryMap.get(categorySlug)
      if (existing) {
        existing.count += 1
      } else {
        categoryMap.set(categorySlug, {
          name: entry,
          count: 1,
        })
      }
    })
  })

  return Array.from(categoryMap.entries()).map(([slug, { name, count }]) => ({
    name,
    slug,
    count,
  }))
}

export async function getFeaturedProjects(count = 3): Promise<Project[]> {
  const projects = await getAllProjects()
  return projects
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
    .slice(0, count)
}

function processProjectFiles(fileNames: string[], projectsDirectory: string): Project[] {
  try {
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        const fullPath = path.join(projectsDirectory, fileName)

        try {
          const fileContents = fs.readFileSync(fullPath, "utf8")
          console.log(`Processing project file: ${fileName}`)

          const { metadata, content } = parseMarkdownWithMetadata(fileContents)

          return {
            ...metadata,
            category: normalizeCategories(metadata.category),
            coverImage: resolveCoverImage(metadata.coverImage, metadata.title, metadata.coverImageColor),
            coverImageColor: typeof metadata.coverImageColor === "string" ? metadata.coverImageColor : undefined,
            content,
            slug,
          } as Project
        } catch (fileError) {
          console.error(`Error processing project file ${fileName}:`, fileError)
          return null
        }
      })
      .filter((project): project is Project => project !== null)
  } catch (error) {
    console.error("Error processing project files:", error)
    return []
  }
}

function parseMarkdownWithMetadata(fileContents: string): { metadata: any; content: string } {
  const metadataPattern = /^===\s*([\s\S]*?)\s*===\s*([\s\S]*)$/
  const match = fileContents.match(metadataPattern)

  if (!match) {
    console.error("Invalid markdown format. Missing metadata delimiters.")
    throw new Error("Invalid markdown format. Missing metadata delimiters.")
  }

  let metadata
  try {
    const metadataStr = match[1].trim()
    metadata = JSON.parse(metadataStr)
  } catch (error) {
    console.error("Invalid JSON in metadata section:", error)
    throw new Error("Invalid JSON in metadata section")
  }

  const content = match[2].trim()

  return {
    metadata,
    content,
  }
}
