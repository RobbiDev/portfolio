import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, Folder, MapPin, Tag, Users } from "lucide-react"
import PageHeader from "@/components/page-header"
import GridBackground from "@/components/grid-background"
import CategoryFilter from "@/components/category-filter"
import { getBlogPostsByCategory, getBlogCategories, type BlogPost } from "@/lib/blog"
import { slugifyCategory } from "@/lib/blog-utils"

export async function generateStaticParams() {
  const categories = await getBlogCategories()
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const categories = await getBlogCategories()
  const category = categories.find((cat) => cat.slug === params.category)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} | Blog`,
    description: `Blog posts in the ${category.name} category`,
  }
}

export default async function BlogCategoryPage({ params }: { params: { category: string } }) {
  let posts: BlogPost[] = []
  let categories = []
  let categoryName = ""
  let errorMessage = null

  try {
    posts = await getBlogPostsByCategory(params.category)
    categories = await getBlogCategories()

    const category = categories.find((cat) => cat.slug === params.category)
    if (!category) {
      notFound()
    }

    categoryName = category.name
    console.log(`Blog category page loaded ${posts.length} posts for category: ${categoryName}`)
  } catch (error) {
    console.error("Error fetching blog posts by category:", error)
    errorMessage = "Failed to load blog posts. Please try again later."
  }

  const formatAuthors = (post: { authors?: { name: string }[]; author?: string }) => {
    if (post.authors && post.authors.length > 0) {
      return post.authors.map((author) => author.name).join(" / ")
    }
    return post.author || ""
  }

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-pallete-main transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO ALL POSTS
        </Link>

        <PageHeader
          title={`${categoryName.toUpperCase()} POSTS`}
          subtitle={`Explore all blog posts in the ${categoryName} category.`}
        />

        <div className="mt-16">
          <CategoryFilter
            categories={categories}
            currentCategory={params.category}
            basePath="/blog"
            title="Categories"
          />

          {errorMessage ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Error</h3>
              <p className="text-neutral-400">{errorMessage}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">No posts found</h3>
              <p className="text-neutral-400">No blog posts found in the {categoryName} category.</p>
            </div>
          ) : (
            <div className="grid gap-10">
              {posts.map((post, index) => (
                <article
                  key={index}
                  className="group bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden"
                >
                  <div className="grid gap-6 md:grid-cols-[0.55fr_1fr] p-6 md:p-8 items-center">
                    <div className="relative aspect-video overflow-hidden border border-neutral-800">
                      {(() => {
                        const thumbnail = post.thumbnail || post.coverImage || "/placeholder.svg?height=600&width=800&query=blog"
                        const isInline = thumbnail.startsWith("data:")
                        return (
                          <Image
                            src={thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 40vw"
                            unoptimized={isInline}
                          />
                        )
                      })()}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3 text-xs font-mono uppercase tracking-[0.3em] text-neutral-400">
                        {post.category && (
                          <Link
                            href={`/blog/category/${slugifyCategory(post.category)}`}
                            className="inline-flex items-center gap-2 border border-pallete-main/30 px-3 py-1 text-pallete-main"
                          >
                            <Folder className="h-4 w-4" />
                            {post.category}
                          </Link>
                        )}
                        {post.featured && <span className="text-neutral-300">Featured</span>}
                      </div>

                      <Link href={`/blog/${post.slug}`}>
                        <h2 className="text-2xl md:text-3xl font-bold group-hover:text-pallete-main transition-colors">
                          {post.title}
                        </h2>
                      </Link>

                      {post.excerpt && <p className="text-neutral-300">{post.excerpt}</p>}

                      <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
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
                        {formatAuthors(post) && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-pallete-main" />
                            <span>{formatAuthors(post)}</span>
                          </div>
                        )}
                        {post.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-pallete-main" />
                            <span>{post.location}</span>
                          </div>
                        )}
                        {post.readingTimeMinutes && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-pallete-main" />
                            <span>{post.readingTimeMinutes} min read</span>
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

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 bg-pallete-main hover:bg-pallete-main/80 text-black px-4 py-2 font-medium transition-colors"
                      >
                        READ MORE
                      </Link>
                    </div>
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
