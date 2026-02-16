import fs from "fs"
import path from "path"
import type { GalleryImage, Category } from "./types"

export interface BlogPost {
  slug: string
  title: string
  date: string
  author: string
  excerpt: string
  content: string
  coverImage?: string
  tags?: string[]
  category?: string
  gallery?: GalleryImage[]
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

    return {
      ...metadata,
      content,
      slug,
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
  return posts.filter((post) => post.category?.toLowerCase().replace(/\s+/g, "-") === category.toLowerCase())
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

          return {
            ...metadata,
            content,
            slug,
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
