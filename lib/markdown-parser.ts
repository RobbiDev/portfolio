import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

export interface MarkdownContent<T = Record<string, any>> {
  metadata: T
  content: string
}

/**
 * Parses a markdown file with custom metadata delimiters
 * @param filePath - Path to the markdown file
 * @returns Object containing metadata and HTML content
 */
export async function parseMarkdownFile<T = Record<string, any>>(filePath: string): Promise<MarkdownContent<T>> {
  // Read file content
  const fullPath = path.resolve(filePath)
  const fileContents = fs.readFileSync(fullPath, "utf8")

  // Extract metadata and content using custom delimiter pattern
  const metadataPattern = /^===\n([\s\S]*?)\n===\n([\s\S]*)$/
  const match = fileContents.match(metadataPattern)

  if (!match) {
    throw new Error(`Invalid markdown format in file: ${filePath}. Missing metadata delimiters.`)
  }

  // Parse metadata JSON
  let metadata: T
  try {
    metadata = JSON.parse(match[1]) as T
  } catch (error) {
    throw new Error(`Invalid JSON in metadata section of file: ${filePath}`)
  }

  // Parse markdown content to HTML
  const markdownContent = match[2].trim()
  const processedContent = await remark()
    .use(html, { sanitize: false }) // Set sanitize to true in production if content is user-generated
    .process(markdownContent)

  const contentHtml = processedContent.toString()

  return {
    metadata,
    content: contentHtml,
  }
}

/**
 * Alternative implementation using gray-matter library
 * This handles more complex frontmatter formats (YAML, TOML, etc.)
 */
export async function parseMarkdownWithMatter<T = Record<string, any>>(filePath: string): Promise<MarkdownContent<T>> {
  // Read file content
  const fullPath = path.resolve(filePath)
  const fileContents = fs.readFileSync(fullPath, "utf8")

  // Replace custom delimiters with frontmatter delimiters for gray-matter
  const contentWithYamlDelimiters = fileContents.replace(/^===\n/, "---\n").replace(/\n===\n/, "\n---\n")

  // Use gray-matter to parse the metadata section
  const matterResult = matter(contentWithYamlDelimiters)

  // Process markdown content to HTML
  const processedContent = await remark().use(html, { sanitize: false }).process(matterResult.content)

  const contentHtml = processedContent.toString()

  return {
    metadata: matterResult.data as T,
    content: contentHtml,
  }
}

/**
 * Gets all markdown files from a directory
 * @param directory - Directory path relative to project root
 * @returns Array of file paths
 */
export function getMarkdownFiles(directory: string): string[] {
  const dirPath = path.join(process.cwd(), directory)
  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(directory, file))
}
