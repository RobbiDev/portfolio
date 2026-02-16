import Link from "next/link"
import type { Metadata } from "next"
import PageHeader from "@/components/page-header"
import GridBackground from "@/components/grid-background"
import { getAllBlogPosts, getBlogCategories, type BlogPost } from "@/lib/blog"
import type { Category } from "@/lib/types"
import Footer from "@/components/footer"
import BlogIndex from "@/components/blog-index"

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

  return (
    <div className="relative min-h-screen">
      {/* Decorative background for the page */}
      <GridBackground />

      <div className="relative z-10 container py-16 md:py-24">
        {/* Page header / hero */}
        <div className="relative">
          <PageHeader
            title="BLOG"
            subtitle="Thoughts, insights, and updates on web development, design, and technology."
          />
          <Link
            href="/system-error"
            className="group absolute right-0 top-0 inline-flex items-center gap-2 text-[10px] text-blue-200/20 transition hover:text-blue-100/60"
            aria-label="Open in-dev console"
          >
            <span className="relative inline-flex items-center font-mono">
              <span className="relative">dev://console</span>
              <span className="pointer-events-none absolute left-0 top-0 text-blue-200/15 opacity-0 transition group-hover:opacity-100 animate-glitch-1">
                dev://console
              </span>
              <span className="pointer-events-none absolute left-0 top-0 text-blue-200/10 opacity-0 transition group-hover:opacity-100 animate-glitch-2">
                dev://console
              </span>
            </span>
          </Link>
        </div>

        <div className="mt-16">
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
                      <span>Feed is quiet while new posts are in progress.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      <span>Check back soon for notes, experiments, and write-ups.</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm font-mono">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
                    >
                      Go Home
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Contact
                    </Link>
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      See Projects
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      About
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative overflow-hidden rounded-lg border border-blue-400/30 bg-black/70 p-5 shadow-[0_0_30px_rgba(59,130,246,0.25)]">
                    <div className="flex items-center justify-between border-b border-blue-400/20 pb-2 text-xs font-mono text-blue-200/80">
                      <span>MINI TERMINAL</span>
                      <span className="flex items-center gap-2 text-blue-200/70">
                        <span className="h-2 w-2 rounded-full bg-blue-300/80"></span>
                        204
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs font-mono text-neutral-300/90">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300">&gt;</span>
                        <span>blog feed</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <span className="text-blue-300">.</span>
                        <span>status: empty</span>
                      </div>
                    </div>
                    <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-200/60">
                      <span>LOG STREAM</span>
                    </div>
                    <Link
                      href="/system-error"
                      className="group absolute bottom-2 right-2 inline-flex items-center gap-2 px-2 py-1 text-[10px] text-blue-200/35 transition hover:text-blue-100/70"
                      aria-label="Open in-dev console"
                    >
                      <span className="relative inline-flex items-center font-mono">
                        <span className="relative">dev://console</span>
                        <span className="pointer-events-none absolute left-0 top-0 text-blue-200/20 opacity-0 transition group-hover:opacity-100 animate-glitch-1">
                          dev://console
                        </span>
                        <span className="pointer-events-none absolute left-0 top-0 text-blue-200/15 opacity-0 transition group-hover:opacity-100 animate-glitch-2">
                          dev://console
                        </span>
                      </span>
                    </Link>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.12),transparent)] opacity-70 animate-signal-scan"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <BlogIndex posts={posts} categories={categories} />
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
