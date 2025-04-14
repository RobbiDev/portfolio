import { parseMarkdownFile, getMarkdownFiles } from "./markdown-parser"
import path from "path"
import type { BlogPostMetadata, ProjectMetadata } from "./types"

/**
 * Gets all blog posts with metadata
 */
export async function getAllBlogPosts() {
  const files = getMarkdownFiles("content/blog")

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, ".md")
      const { metadata } = await parseMarkdownFile<BlogPostMetadata>(file)

      return {
        slug,
        ...metadata,
      }
    }),
  )

  // Sort posts by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Gets a specific blog post by slug
 */
export async function getBlogPost(slug: string) {
  const filePath = path.join("content/blog", `${slug}.md`)
  return parseMarkdownFile<BlogPostMetadata>(filePath)
}

/**
 * Gets all projects with metadata
 */
export async function getAllProjects() {
  const files = getMarkdownFiles("content/projects")

  const projects = await Promise.all(
    files.map(async (file) => {
      const slug = path.basename(file, ".md")
      const { metadata } = await parseMarkdownFile<ProjectMetadata>(file)

      return {
        slug,
        ...metadata,
      }
    }),
  )

  return projects
}

/**
 * Gets featured projects
 */
export async function getFeaturedProjects() {
  const projects = await getAllProjects()
  return projects.filter((project) => project.featured)
}

/**
 * Gets a specific project by slug
 */
export async function getProject(slug: string) {
  const filePath = path.join("content/projects", `${slug}.md`)
  return parseMarkdownFile<ProjectMetadata>(filePath)
}
