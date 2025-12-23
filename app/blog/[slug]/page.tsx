import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag, Folder } from "lucide-react"
import GridBackground from "@/components/grid-background"
import Markdown from "@/components/markdown"
import Gallery from "@/components/gallery"
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog"

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

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  console.log("Rendering blog post page for slug:", params.slug)

  let post = null
  let errorMessage = null

  try {
    post = getBlogPostBySlug(params.slug)
    console.log("Retrieved blog post:", post ? post.title : "Not found")

    if (!post) {
      notFound()
    }
  } catch (error) {
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

        <article className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6 md:p-8">
          <header className="mb-8 pb-8 border-b border-neutral-800">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap gap-6 text-sm text-neutral-400 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-pallete-main" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-pallete-main" />
                <span>{post.author}</span>
              </div>
              {post.category && (
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4 text-pallete-main" />
                  <Link
                    href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:text-pallete-main transition-colors"
                  >
                    {post.category}
                  </Link>
                </div>
              )}
            </div>

            {post.tags && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, tagIndex) => (
                  <div
                    key={tagIndex}
                    className="flex items-center gap-1 text-xs bg-black/50 border border-neutral-800 px-2 py-1 font-mono"
                  >
                    <Tag className="h-3 w-3 text-pallete-main" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-lime max-w-none">
            <Markdown content={post.content} />
          </div>

          {/* Gallery Section - Only show if gallery exists */}
          {post.gallery && post.gallery.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-800">
              <Gallery images={post.gallery} title="Article Gallery" />
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
