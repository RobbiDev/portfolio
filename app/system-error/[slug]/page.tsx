import { notFound, redirect } from "next/navigation"
import InDevWorkbench from "@/components/in-dev-workbench"
import { getAllInDevSlugs, getInDevItemBySlug } from "@/lib/in-dev"
import GridBackground from "@/components/grid-background"
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projects"
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog"
import { findBestSlugMatch } from "@/lib/slug-fallback"

export async function generateStaticParams() {
  const slugs = getAllInDevSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const item = getInDevItemBySlug(params.slug)

  if (!item) {
    return {
      title: "Item Not Found",
    }
  }

  return {
    title: `${item.title} | In Development`,
    description: item.summary || item.excerpt || "In-development item",
  }
}

export default function InDevItemPage({ params }: { params: { slug: string } }) {
  const item = getInDevItemBySlug(params.slug)

  if (!item) {
    const projectMatch = findBestSlugMatch(params.slug, getAllProjectSlugs())
    if (projectMatch && getProjectBySlug(projectMatch)) {
      redirect(`/projects/${projectMatch}`)
    }

    const blogMatch = findBestSlugMatch(params.slug, getAllBlogSlugs())
    if (blogMatch && getBlogPostBySlug(blogMatch)) {
      redirect(`/blog/${blogMatch}`)
    }

    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-blue-500 font-mono">

      <div className="relative z-10 container py-8 md:py-16 mx-auto  overflow-visible">
        <GridBackground />
        <InDevWorkbench
          initial={{
            title: item.title,
            type: item.type,
            summary: item.summary,
            status: item.status,
            category: item.category,
            technologies: item.technologies,
            content: item.content,
            coverImage: item.coverImage,
            coverImageRaw: item.coverImageRaw,
            coverImageColor: item.coverImageColor,
            author: item.author,
            tags: item.tags,
            date: item.date,
            client: item.client,
            timeline: item.timeline,
            role: item.role,
            liveUrl: item.liveUrl,
            githubUrl: item.githubUrl,
            features: item.features,
          }}
        />
      </div>
    </div>
  )
}
