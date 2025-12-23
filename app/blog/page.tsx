import Link from "next/link"
import { Calendar, User, Tag, Folder } from "lucide-react"
import PageHeader from "@/components/page-header"
import GridBackground from "@/components/grid-background"
import CategoryFilter from "@/components/category-filter"
import { getAllBlogPosts, getBlogCategories } from "@/lib/blog"

export default async function BlogPage() {
  let posts = []
  let categories = []
  let errorMessage = null

  try {
    posts = await getAllBlogPosts()
    categories = await getBlogCategories()
    console.log("Blog page loaded posts:", posts.length)
    console.log("Blog categories:", categories)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    errorMessage = "Failed to load blog posts. Please try again later."
  }

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <PageHeader
          title="BLOG"
          subtitle="Thoughts, insights, and updates on web development, design, and technology."
        />

        <div className="mt-16">
          <CategoryFilter categories={categories} basePath="/blog" title="Categories" />

          {errorMessage ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Error</h3>
              <p className="text-neutral-400">{errorMessage}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">No blog posts found</h3>
              <p className="text-neutral-400">
                Blog posts will appear here once they are added to the content/blog directory.
              </p>
            </div>
          ) : (
            <div className="grid gap-12">
              {posts.map((post, index) => (
                <article
                  key={index}
                  className="group bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-neutral-400">
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

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-pallete-main transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-neutral-300 mb-6">{post.excerpt}</p>

                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mb-6">
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
