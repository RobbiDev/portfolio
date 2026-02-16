"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Filter, Folder, MapPin, Tag, Users } from "lucide-react"
import type { BlogPost } from "@/lib/blog"
import type { Category } from "@/lib/types"
import { getBlogGradientColors, slugifyCategory } from "@/lib/blog-utils"

interface BlogIndexProps {
  posts: BlogPost[]
  categories: Category[]
}

function formatDate(isoDate?: string) {
  return isoDate
    ? new Date(isoDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""
}

function formatAuthors(post: BlogPost) {
  if (post.authors && post.authors.length > 0) {
    return post.authors.map((author) => author.name).join(" / ")
  }
  return post.author || ""
}

export default function BlogIndex({ posts, categories }: BlogIndexProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")

  const years = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((post) => {
      if (!post.date) return
      const year = new Date(post.date).getFullYear()
      if (!Number.isNaN(year)) set.add(String(year))
    })
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [posts])

  const tags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((post) => {
      post.tags?.forEach((tag) => set.add(tag))
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (selectedYear !== "all" && post.date) {
        const year = String(new Date(post.date).getFullYear())
        if (year !== selectedYear) return false
      }

      if (selectedYear !== "all" && !post.date) return false

      if (selectedTag !== "all") {
        const hasTag = post.tags?.some((tag) => tag === selectedTag)
        if (!hasTag) return false
      }

      return true
    })
  }, [posts, selectedTag, selectedYear])

  const featuredPosts = useMemo(
    () => filteredPosts.filter((post) => post.featured).slice(0, 2),
    [filteredPosts],
  )

  const nonFeaturedPosts = useMemo(
    () => filteredPosts.filter((post) => !post.featured),
    [filteredPosts],
  )

  return (
    <div className="space-y-8">
      <div className="border border-neutral-800 bg-black/30 p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-neutral-300">
            <Filter className="h-4 w-4 text-pallete-main" />
            <span>Explore posts</span>
            <span className="hidden md:inline text-xs text-neutral-500">
              {filteredPosts.length} result{filteredPosts.length === 1 ? "" : "s"}
              {selectedYear !== "all" ? ` · ${selectedYear}` : ""}
              {selectedTag !== "all" ? ` · ${selectedTag}` : ""}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
              Year
            </div>
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(event.target.value)}
                className="bg-black/70 border border-neutral-800 px-3 py-2 text-sm text-neutral-200"
              >
                <option value="all">All</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedYear("all")
                setSelectedTag("all")
              }}
              className="text-xs uppercase tracking-[0.2em] text-pallete-main"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" className="border border-pallete-main bg-pallete-main text-black px-3 py-1 text-xs uppercase tracking-[0.2em]">
              All categories
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="border border-neutral-800 text-neutral-300 px-3 py-1 text-xs uppercase tracking-[0.2em]"
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className={
                  selectedTag === "all"
                    ? "border border-pallete-main bg-pallete-main text-black px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    : "border border-neutral-800 text-neutral-300 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                }
              >
                All tags
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={
                    selectedTag === tag
                      ? "border border-pallete-main bg-pallete-main text-black px-3 py-1 text-xs uppercase tracking-[0.2em]"
                      : "border border-neutral-800 text-neutral-300 px-3 py-1 text-xs uppercase tracking-[0.2em]"
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {featuredPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Featured Articles</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => {
              const thumbnail = post.thumbnail || post.coverImage || "/placeholder.svg?height=600&width=800&query=blog"
              const isInline = thumbnail.startsWith("data:")
              const stripeTitle = post.title.replace(/-/g, "\u2011")
              const gradient = getBlogGradientColors(post.blogColor, post.coverImageColor)
              const gradientStyle = gradient
                ? {
                    backgroundImage: `radial-gradient(circle at top, ${gradient.top}, transparent 55%), radial-gradient(circle at 20% 80%, ${gradient.bottom}, transparent 60%)`,
                  }
                : undefined
              return (
                <article key={post.slug} className="border border-neutral-800 bg-black/30">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized={isInline}
                    />
                    {isInline && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-full px-4 py-3 text-center text-sm font-marker text-white"
                          style={{ backgroundColor: post.coverImageColor || "rgb(16, 16, 16)" }}
                        >
                          {stripeTitle}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="relative border-t border-neutral-800 p-5">
                    {gradientStyle && <div className="pointer-events-none absolute inset-0" style={gradientStyle} />}
                    <div className="relative z-10 space-y-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-400">
                        {post.category && (
                          <Link
                            href={`/blog/category/${slugifyCategory(post.category)}`}
                            className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 text-pallete-main"
                          >
                            <Folder className="h-4 w-4" />
                            {post.category}
                          </Link>
                        )}
                        <span className="text-pallete-main">Featured</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-2xl font-bold hover:text-pallete-main transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      {post.excerpt && <p className="text-sm text-neutral-400">{post.excerpt}</p>}
                      <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-pallete-main" />
                          <time dateTime={post.date}>{formatDate(post.date)}</time>
                        </div>
                        {formatAuthors(post) && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-pallete-main" />
                            <span>{formatAuthors(post)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <section className="space-y-6">
        <div className="text-sm text-neutral-400">Latest updates</div>
        <div className="grid gap-6 md:grid-cols-3">
          {nonFeaturedPosts.map((post) => {
            const thumbnail = post.thumbnail || post.coverImage || "/placeholder.svg?height=600&width=800&query=blog"
            const isInline = thumbnail.startsWith("data:")
            const stripeTitle = post.title.replace(/-/g, "\u2011")
            const gradientStyle = {
              backgroundImage:
                "radial-gradient(circle at top, rgba(239,68,68,0.22), transparent 55%), radial-gradient(circle at 20% 80%, rgba(59,130,246,0.2), transparent 60%)",
            }
              return (
              <article key={post.slug} className="border border-neutral-800 bg-black/30">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={isInline}
                  />
                  {isInline && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-full px-4 py-2 text-center text-xs md:text-sm font-marker text-white"
                        style={{ backgroundColor: post.coverImageColor || "rgb(16, 16, 16)" }}
                      >
                        {stripeTitle}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative border-t border-neutral-800 p-5">
                  {gradientStyle && <div className="pointer-events-none absolute inset-0" style={gradientStyle} />}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-neutral-400">
                      {post.category && (
                        <Link
                          href={`/blog/category/${slugifyCategory(post.category)}`}
                          className="inline-flex items-center gap-2 border border-neutral-800 px-3 py-1 text-pallete-main"
                        >
                          <Folder className="h-4 w-4" />
                          {post.category}
                        </Link>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-lg font-bold hover:text-pallete-main transition-colors">
                          {post.title}
                        </h3>
                      </Link>
                      {post.excerpt && <p className="text-sm text-neutral-400">{post.excerpt}</p>}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-pallete-main" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
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
                        {post.tags.map((tag) => (
                          <div key={tag} className="flex items-center gap-1 text-xs border border-neutral-800 px-2 py-1">
                            <Tag className="h-3 w-3 text-pallete-main" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {filteredPosts.length === 0 && (
        <div className="border border-neutral-800 bg-black/30 p-8 text-center">
          <h3 className="text-xl font-bold mb-3">No matching articles</h3>
          <p className="text-neutral-400">Try a different year or tag.</p>
        </div>
      )}
    </div>
  )
}
