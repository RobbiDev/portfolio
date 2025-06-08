import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag, Folder } from "lucide-react"
import PageHeader from "@/components/page-header"
import GridBackground from "@/components/grid-background"
import CategoryFilter from "@/components/category-filter"
import { getBlogPostsByCategory, getBlogCategories } from "@/lib/blog"

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
  let posts = []
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

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-lime-400 transition-colors mb-8"
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
            <div className="grid gap-12">
              {posts.map((post, index) => (
                <article
                  key={index}
                  className="group bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-neutral-400">
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
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-lime-400" />
                        <span>{post.category}</span>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-lime-400 transition-colors">
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
                            <Tag className="h-3 w-3 text-lime-400" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black px-4 py-2 font-medium transition-colors"
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
