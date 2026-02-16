import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GridBackground from "@/components/grid-background"
import BlogReadingShell from "@/components/blog-reading-shell"
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog"
import { getAllInDevSlugs } from "@/lib/in-dev"
import { findBestSlugMatch } from "@/lib/slug-fallback"

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  console.log("Generated static params for blog slugs:", slugs)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }

  const shareImage = post.thumbnail || post.coverImage

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: shareImage
      ? {
          title: post.title,
          description: post.excerpt,
          type: "article",
          images: [
            {
              url: shareImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        }
      : undefined,
    twitter: shareImage
      ? {
          card: "summary_large_image",
          title: post.title,
          description: post.excerpt,
          images: [shareImage],
        }
      : undefined,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  console.log("Rendering blog post page for slug:", params.slug)

  let post = null
  let errorMessage = null

  const isNavigationError = (error: unknown) => {
    if (!error || typeof error !== "object") return false
    const digest = (error as { digest?: string }).digest
    return typeof digest === "string" && (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_NOT_FOUND"))
  }

  try {
    post = getBlogPostBySlug(params.slug)
    console.log("Retrieved blog post:", post ? post.title : "Not found")

    if (!post) {
      const inDevMatch = findBestSlugMatch(params.slug, getAllInDevSlugs())
      if (inDevMatch) {
        redirect(`/system-error/${inDevMatch}`)
      }
      notFound()
    }
  } catch (error) {
    if (isNavigationError(error)) {
      throw error
    }
    console.error(`Error fetching blog post with slug ${params.slug}:`, error)
    errorMessage = "Failed to load blog post. Please try again later."
  }

  if (errorMessage) {
    return (
      <div className="relative min-h-screen">
        <GridBackground />
        <div className="relative z-10 container py-16 md:py-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-pallete-main transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> BACK TO BLOG
          </Link>

          <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Error</h3>
            <p className="text-neutral-400">{errorMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-pallete-main transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO BLOG
        </Link>

        <BlogReadingShell post={post} shareUrl={`https://robbyj.com/blog/${post.slug}`} />
      </div>
    </div>
  )
}
