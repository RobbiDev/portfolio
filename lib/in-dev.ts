import fs from "fs"
import path from "path"
import { resolveCoverImage } from "./projects"
import type { GalleryImage } from "./types"

export interface InDevItem {
  slug: string
  title: string
  type: "project" | "blog"
  date?: string
  summary?: string
  excerpt?: string
  status?: string
  category?: string | string[]
  technologies?: string[]
  content: string
  coverImage?: string
  coverImageRaw?: string
  coverImageColor?: string
  author?: string
  tags?: string[]
  client?: string
  timeline?: string
  role?: string
  liveUrl?: string
  githubUrl?: string
  features?: string[]
  gallery?: GalleryImage[]
}

// Parse markdown with metadata (same format as projects)
function parseMarkdownWithMetadata(fileContents: string): { metadata: any; content: string } {
  // Extract metadata and content using custom delimiter pattern
  const metadataPattern = /^===\s*([\s\S]*?)\s*===\s*([\s\S]*)$/
  const match = fileContents.match(metadataPattern)

  if (!match) {
    console.error("Invalid markdown format. Missing metadata delimiters.")
    throw new Error(`Invalid markdown format. Missing metadata delimiters.`)
  }

  // Parse metadata JSON
  let metadata
  try {
    const metadataStr = match[1].trim()
    metadata = JSON.parse(metadataStr)
  } catch (error) {
    console.error("Invalid JSON in metadata section:", error)
    throw new Error(`Invalid JSON in metadata section`)
  }

  // Get the content
  const content = match[2].trim()

  return {
    metadata,
    content,
  }
}

// Get all in-dev item slugs from both projects and blog folders
export function getAllInDevSlugs(): string[] {
  try {
    const slugs: string[] = []
    
    // Check projects/in-process folder
    const projectsInProcessDir = path.join(process.cwd(), "content", "projects", "in-process")
    if (fs.existsSync(projectsInProcessDir)) {
      const projectFiles = fs.readdirSync(projectsInProcessDir)
      const projectSlugs = projectFiles
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => fileName.replace(/\.md$/, ""))
      slugs.push(...projectSlugs)
    } else {
      fs.mkdirSync(projectsInProcessDir, { recursive: true })
    }
    
    // Check blog/in-process folder
    const blogInProcessDir = path.join(process.cwd(), "content", "blog", "in-process")
    if (fs.existsSync(blogInProcessDir)) {
      const blogFiles = fs.readdirSync(blogInProcessDir)
      const blogSlugs = blogFiles
        .filter((fileName) => fileName.endsWith(".md"))
        .map((fileName) => fileName.replace(/\.md$/, ""))
      slugs.push(...blogSlugs)
    } else {
      fs.mkdirSync(blogInProcessDir, { recursive: true })
    }
    
    return slugs
  } catch (error) {
    console.error("Error reading in-process slugs:", error)
    return []
  }
}

// Get in-dev item by slug (checks both projects and blog folders)
export function getInDevItemBySlug(slug: string): InDevItem | null {
  try {
    // Try projects/in-process first
    const projectsInProcessDir = path.join(process.cwd(), "content", "projects", "in-process")
    const projectPath = path.join(projectsInProcessDir, `${slug}.md`)
    
    if (fs.existsSync(projectPath)) {
      const fileContents = fs.readFileSync(projectPath, "utf8")
      const { metadata, content } = parseMarkdownWithMetadata(fileContents)

      return {
        slug,
        title: metadata.title || slug,
        type: "project",
        date: metadata.date || metadata.createdAt,
        summary: metadata.summary || metadata.excerpt,
        excerpt: metadata.excerpt,
        status: metadata.status || "In Development",
        category: metadata.category,
        technologies: metadata.technologies || metadata.tech || [],
        content,
        coverImageRaw: metadata.coverImage,
        coverImage: resolveCoverImage(metadata.coverImage, metadata.title || slug, metadata.coverImageColor),
        coverImageColor: metadata.coverImageColor,
        author: metadata.author,
        tags: metadata.tags,
        client: metadata.client,
        timeline: metadata.timeline,
        role: metadata.role,
        liveUrl: metadata.liveUrl,
        githubUrl: metadata.githubUrl,
        features: metadata.features,
        gallery: metadata.gallery,
      }
    }
    
    // Try blog/in-process
    const blogInProcessDir = path.join(process.cwd(), "content", "blog", "in-process")
    const blogPath = path.join(blogInProcessDir, `${slug}.md`)
    
    if (fs.existsSync(blogPath)) {
      const fileContents = fs.readFileSync(blogPath, "utf8")
      const { metadata, content } = parseMarkdownWithMetadata(fileContents)

      return {
        slug,
        title: metadata.title || slug,
        type: "blog",
        date: metadata.date || metadata.createdAt,
        summary: metadata.summary || metadata.excerpt,
        excerpt: metadata.excerpt,
        status: metadata.status || "Draft",
        category: metadata.category,
        technologies: metadata.technologies || metadata.tech || [],
        content,
        coverImageRaw: metadata.coverImage,
        coverImage: resolveCoverImage(metadata.coverImage, metadata.title || slug, metadata.coverImageColor),
        coverImageColor: metadata.coverImageColor,
        author: metadata.author,
        tags: metadata.tags,
        client: metadata.client,
        timeline: metadata.timeline,
        role: metadata.role,
        liveUrl: metadata.liveUrl,
        githubUrl: metadata.githubUrl,
        features: metadata.features,
        gallery: metadata.gallery,
      }
    }

    console.warn(`In-dev item file not found: ${slug}`)
    return null
  } catch (error) {
    console.error(`Error reading in-dev item ${slug}:`, error)
    return null
  }
}

// Get all in-dev items
export function getAllInDevItems(): InDevItem[] {
  const slugs = getAllInDevSlugs()
  const items = slugs
    .map((slug) => getInDevItemBySlug(slug))
    .filter((item): item is InDevItem => item !== null)
    .sort((a, b) => {
      // Sort by date if available, otherwise by title
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return a.title.localeCompare(b.title)
    })

  return items
}
