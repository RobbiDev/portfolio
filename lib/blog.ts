import fs from "fs"
import path from "path"
import type { GalleryImage, Category } from "./types"
import { slugifyCategory } from "./blog-utils"

export interface BlogAuthor {
  name: string
  role?: string
  email?: string
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  author?: string
  authors?: BlogAuthor[]
  excerpt?: string
  content: string
  coverImage?: string
  coverImageColor?: string
  blogColor?: string
  thumbnail?: string
  location?: string
  featured?: boolean
  tags?: string[]
  category?: string
  gallery?: GalleryImage[]
  readingTimeMinutes?: number
  wordCount?: number
}

function normalizeAuthors(authors: unknown, fallbackAuthor?: unknown): BlogAuthor[] {
  if (Array.isArray(authors)) {
    return authors
      .map((author) => {
        if (typeof author === "string") {
          return { name: author }
        }
        if (author && typeof author === "object" && "name" in author) {
          const entry = author as { name?: unknown; role?: unknown; email?: unknown }
          if (typeof entry.name === "string" && entry.name.trim()) {
            return {
              name: entry.name.trim(),
              role: typeof entry.role === "string" ? entry.role : undefined,
              email: typeof entry.email === "string" ? entry.email : undefined,
            }
          }
        }
        return null
      })
      .filter((author): author is BlogAuthor => author !== null)
  }

  if (authors && typeof authors === "object" && "name" in authors) {
    const entry = authors as { name?: unknown; role?: unknown; email?: unknown }
    if (typeof entry.name === "string" && entry.name.trim()) {
      return [
        {
          name: entry.name.trim(),
          role: typeof entry.role === "string" ? entry.role : undefined,
          email: typeof entry.email === "string" ? entry.email : undefined,
        },
      ]
    }
  }

  if (typeof fallbackAuthor === "string" && fallbackAuthor.trim()) {
    return [{ name: fallbackAuthor.trim() }]
  }

  return []
}

function normalizeStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const items = value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    return items.length > 0 ? items : undefined
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()]
  }

  return undefined
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

  return {
    edge: toRgb(base),
    center: "rgb(255, 255, 255)",
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

export function resolveThumbnail(thumbnail: unknown, title: string, coverImageColor?: unknown): string {
  if (typeof thumbnail === "string") {
    const trimmed = thumbnail.trim()
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

function getWordCount(content: string): number {
  const words = content.trim().split(/\s+/)
  return words.filter(Boolean).length
}

export function estimateReadingTime(content: string): { minutes: number; words: number } {
  const words = getWordCount(content)
  const minutes = Math.max(1, Math.round(words / 200))
  return { minutes, words }
}

export function getAllBlogSlugs(): string[] {
  try {
    const blogDirectory = path.join(process.cwd(), "content", "blog")
    console.log("Looking for blog posts in:", blogDirectory)

    if (!fs.existsSync(blogDirectory)) {
      console.warn("Blog directory does not exist:", blogDirectory)
      fs.mkdirSync(blogDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(blogDirectory)
    console.log("Found blog files:", fileNames)
    return fileNames.filter((fileName) => fileName.endsWith(".md")).map((fileName) => fileName.replace(/\.md$/, ""))
  } catch (error) {
    console.error("Error reading blog slugs:", error)
    return []
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const blogDirectory = path.join(process.cwd(), "content", "blog")
    const fullPath = path.join(blogDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Blog post file not found: ${fullPath}`)
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    console.log(`Read blog post file: ${fullPath}`)

    const { metadata, content } = parseMarkdownWithMetadata(fileContents)

    const { minutes, words } = estimateReadingTime(content)
    const authors = normalizeAuthors(metadata.authors, metadata.author)
    const coverImageColor = typeof metadata.coverImageColor === "string" ? metadata.coverImageColor : undefined
    const blogColor = typeof metadata.blogColor === "string" ? metadata.blogColor : undefined
    const coverImage = resolveCoverImage(metadata.coverImage, metadata.title, coverImageColor)
    const thumbnail = resolveThumbnail(metadata.thumbnail ?? metadata.coverImage, metadata.title, coverImageColor)

    return {
      ...metadata,
      author: typeof metadata.author === "string" ? metadata.author : authors[0]?.name,
      authors,
      tags: normalizeStringArray(metadata.tags),
      category: typeof metadata.category === "string" ? metadata.category : undefined,
      location: typeof metadata.location === "string" ? metadata.location : undefined,
      featured: Boolean(metadata.featured),
      coverImage,
      coverImageColor,
      blogColor,
      thumbnail,
      content,
      slug,
      readingTimeMinutes: minutes,
      wordCount: words,
    } as BlogPost
  } catch (error) {
    console.error(`Error reading blog file for slug ${slug}:`, error)
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogDirectory = path.join(process.cwd(), "content", "blog")
    console.log("Getting all blog posts from:", blogDirectory)

    if (!fs.existsSync(blogDirectory)) {
      console.warn("Blog directory does not exist:", blogDirectory)
      fs.mkdirSync(blogDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(blogDirectory)
    console.log("Found blog files for processing:", fileNames)

    const markdownFiles = fileNames.filter((fileName) => fileName.endsWith(".md"))
    if (markdownFiles.length === 0) {
      return []
    }

    return processBlogFiles(fileNames, blogDirectory)
  } catch (error) {
    console.error("Error reading blog directory:", error)
    return []
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.filter((post) => (post.category ? slugifyCategory(post.category) === category.toLowerCase() : false))
}

export async function getBlogCategories(): Promise<Category[]> {
  const posts = await getAllBlogPosts()
  const categoryMap = new Map<string, { name: string; count: number }>()

  posts.forEach((post) => {
    if (post.category) {
      const categorySlug = post.category.toLowerCase().replace(/\s+/g, "-")
      const existing = categoryMap.get(categorySlug)
      if (existing) {
        existing.count += 1
      } else {
        categoryMap.set(categorySlug, {
          name: post.category,
          count: 1,
        })
      }
    }
  })

  return Array.from(categoryMap.entries()).map(([slug, { name, count }]) => ({
    name,
    slug,
    count,
  }))
}

export async function getRecentBlogPosts(count = 3): Promise<BlogPost[]> {
  const posts = await getAllBlogPosts()
  return posts.slice(0, count)
}

function processBlogFiles(fileNames: string[], blogDirectory: string): BlogPost[] {
  try {
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        const fullPath = path.join(blogDirectory, fileName)

        try {
          const fileContents = fs.readFileSync(fullPath, "utf8")
          console.log(`Processing blog file: ${fileName}`)

          const { metadata, content } = parseMarkdownWithMetadata(fileContents)

          const { minutes, words } = estimateReadingTime(content)
          const authors = normalizeAuthors(metadata.authors, metadata.author)
          const coverImageColor = typeof metadata.coverImageColor === "string" ? metadata.coverImageColor : undefined
          const blogColor = typeof metadata.blogColor === "string" ? metadata.blogColor : undefined
          const coverImage = resolveCoverImage(metadata.coverImage, metadata.title, coverImageColor)
          const thumbnail = resolveThumbnail(metadata.thumbnail ?? metadata.coverImage, metadata.title, coverImageColor)

          return {
            ...metadata,
            author: typeof metadata.author === "string" ? metadata.author : authors[0]?.name,
            authors,
            tags: normalizeStringArray(metadata.tags),
            category: typeof metadata.category === "string" ? metadata.category : undefined,
            location: typeof metadata.location === "string" ? metadata.location : undefined,
            featured: Boolean(metadata.featured),
            coverImage,
            coverImageColor,
            blogColor,
            thumbnail,
            content,
            slug,
            readingTimeMinutes: minutes,
            wordCount: words,
          } as BlogPost
        } catch (fileError) {
          console.error(`Error processing blog file ${fileName}:`, fileError)
          return null
        }
      })
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Error processing blog files:", error)
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
