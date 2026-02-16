import Link from "next/link"
import type { Metadata } from "next"
import { Calendar, User, Tag, Folder } from "lucide-react"
import PageHeader from "@/components/page-header"
import GridBackground from "@/components/grid-background"
import CategoryFilter from "@/components/category-filter"
import { getAllBlogPosts, getBlogCategories, type BlogPost } from "@/lib/blog"
import type { Category } from "@/lib/types"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, insights, and updates on web development, design, and technology.",
}

/**
 * Blog index page
 * - Fetches blog posts and categories
 * - Renders a list of posts with metadata and UI components
 */
export default async function BlogPage(): Promise<JSX.Element> {
  // Strongly-typed local state
  // `posts` will contain the parsed blog post metadata and content
  let posts: BlogPost[] = []
  // `categories` is derived from available posts and used by the category filter
  let categories: Category[] = []
  // `errorMessage` is displayed when loading fails
  let errorMessage: string | null = null

  try {
    posts = await getAllBlogPosts()
    categories = await getBlogCategories()
    // Debug logs help while developing locally — remove in production if desired
    console.debug("Blog page loaded posts:", posts.length)
    console.debug("Blog categories:", categories)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    errorMessage = "Failed to load blog posts. Please try again later."
  }

  const formatDate = (isoDate?: string) =>
    isoDate
      ? new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : ""

  return (
    <div className="relative min-h-screen">
      {/* Decorative background for the page */}
      <GridBackground />

      <div className="relative z-10 container py-16 md:py-24">
        {/* Page header / hero */}
        <PageHeader
          title="BLOG"
          subtitle="Thoughts, insights, and updates on web development, design, and technology."
        />

        <div className="mt-16">
          {/* Category selector (left / top of posts list) */}
          <CategoryFilter categories={categories} basePath="/blog" title="Categories" />

          {/*
            Conditional rendering:
            - Show an error box if loading failed
            - Show a friendly empty state if there are no posts
            - Otherwise render the posts grid
          */}
          {errorMessage ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Error</h3>
              <p className="text-neutral-400">{errorMessage}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="relative overflow-hidden bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_55%)]"></div>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(226,26,65,0.2),_transparent_60%)]"></div>

              <div className="relative z-10 grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.3em] text-blue-200/80 mb-3">
                    Broadcast Offline
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">No published blog posts yet</h3>
                  <p className="text-neutral-400 mb-6">
                    New notes and write-ups will appear here once they are ready to ship.
                  </p>
                  <div className="grid gap-3 text-sm font-mono text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      <span>Add a markdown file in content/blog.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      <span>Use the in-dev console for drafts.</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm font-mono">
                    <Link
                      href="/system-error"
                      className="inline-flex items-center gap-2 border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
                    >
                      Open In-Dev Console
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Pitch a Topic
                    </Link>
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute h-56 w-56 rounded-full border border-blue-400/30 animate-signal-spin"></div>
                  <div className="absolute h-40 w-40 rounded-full border border-red-400/30 animate-signal-spin [animation-duration:22s]"></div>
                  <div className="absolute h-28 w-28 rounded-full border border-white/10 animate-signal-spin [animation-duration:28s]"></div>
                  <div className="relative h-28 w-28 rounded-full border border-blue-400/40 bg-black/60 shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                    <div className="absolute inset-3 rounded-full border border-red-300/30 animate-signal-pulse"></div>
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.9)]"></div>
                  </div>
                  <div className="pointer-events-none absolute -bottom-6 h-16 w-48 rounded-full bg-blue-500/10 blur-2xl"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-12">
              {posts.map((post: BlogPost) => (
                // Each article is one post preview in the grid
                <article
                  key={post.slug}
                  className="group bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    {/* Post meta: date, author, category */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-pallete-main" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-pallete-main" />
                        <span>{post.author}</span>
                      </div>

                      {/* Link to the category page if a category exists */}
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

                    {/* Title and excerpt */}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-pallete-main transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-neutral-300 mb-6">{post.excerpt}</p>

                    {/* Tags (if present) */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag: string, tagIndex: number) => (
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

                    {/* Read more link */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 bg-pallete-main hover:bg-pallete-main/80 text-black px-4 py-2 font-medium transition-colors"
                    >
                      READ MORE
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
