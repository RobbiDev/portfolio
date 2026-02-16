export interface BlogPostMetadata {
  title: string
  date: string
  author: string
  excerpt?: string
  link?: string
  tags?: string[]
  category?: string
  gallery?: GalleryImage[]
}

export interface ProjectMetadata {
  title: string
  description?: string
  technologies: string[]
  github?: string
  demo?: string
  image?: string
  featured?: boolean
  category: string | string[]
  summary: string
  coverImage: string
  coverImageColor?: string
  client?: string
  timeline?: string
  role?: string
  liveUrl?: string
  githubUrl?: string
  features?: string[]
  images?: GalleryImage[] // Updated to use the same GalleryImage type
  gallery?: GalleryImage[] // Added gallery support for projects
  relatedProjects?: { slug: string; title: string; category: string; summary: string }[]
}

export interface GalleryImage {
  url: string
  caption?: string
  alt?: string
  title?: string
}

export interface Category {
  name: string
  slug: string
  description?: string
  count: number
}
