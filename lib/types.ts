export interface BlogPostMetadata {
  title: string
  date: string
  author: string
  excerpt?: string
  link?: string
  tags?: string[]
}

export interface ProjectMetadata {
  title: string
  description: string
  technologies: string[]
  github?: string
  demo?: string
  image?: string
  featured?: boolean
}
