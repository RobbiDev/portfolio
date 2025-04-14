import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import GridBackground from "@/components/grid-background"
import Markdown from "@/components/markdown"
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog"

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  console.log("Generated static params for blog slugs:", slugs)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  
  let awaitparams = await params
  
  const post = getBlogPostBySlug(awaitparams.slug)

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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {

  let post = null
  let errorMessage = null
  let awaitparams = await params

  try {
    post = getBlogPostBySlug(awaitparams.slug)
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
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-lime-400 transition-colors mb-8"
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
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-lime-400 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO BLOG
        </Link>

        <article className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6 md:p-8">
          <header className="mb-8 pb-8 border-b border-neutral-800">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>

            <div className="flex flex-wrap gap-6 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-lime-400" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-lime-400" />
                <span>{post.author}</span>
              </div>
            </div>

            {post.tags && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, tagIndex) => (
                  <div
                    key={tagIndex}
                    className="flex items-center gap-1 text-xs bg-black/50 border border-neutral-800 px-2 py-1 font-mono"
                  >
                    <Tag className="h-3 w-3 text-lime-400" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-invert prose-lime max-w-none">
            <Markdown content={post.content} />
          </div>
        </article>
      </div>
    </div>
  )
}
