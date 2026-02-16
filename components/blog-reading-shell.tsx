"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowUp,
  Calendar,
  Clock,
  Folder,
  Mail,
  MapPin,
  Moon,
  Share2,
  Sun,
  Tag,
} from "lucide-react"
import Markdown from "@/components/markdown"
import Gallery from "@/components/gallery"
import type { BlogPost } from "@/lib/blog"
import { getBlogGradientColors, slugifyCategory } from "@/lib/blog-utils"

interface BlogReadingShellProps {
  post: BlogPost
  shareUrl: string
}

const STORAGE_KEY = "blog-reading-theme"

type ReadingTheme = "dark" | "light"

export default function BlogReadingShell({ post, shareUrl }: BlogReadingShellProps) {
  const [theme, setTheme] = useState<ReadingTheme>("dark")
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === "light" || stored === "dark") {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === "undefined") return

    let animationFrame = 0

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const next = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0
      setProgress(next)
      animationFrame = 0
    }

    const handleScroll = () => {
      if (animationFrame) return
      animationFrame = window.requestAnimationFrame(updateProgress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  const authors = useMemo(() => {
    if (post.authors && post.authors.length > 0) return post.authors
    if (post.author) return [{ name: post.author }]
    return []
  }, [post.author, post.authors])

  const displayDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  const readingTimeLabel = post.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : undefined
  const wordCountLabel = post.wordCount ? `${post.wordCount.toLocaleString()} words` : undefined

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(post.title)

    return [
      {
        label: "X",
        href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      },
      {
        label: "LinkedIn",
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      },
      {
        label: "Facebook",
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      },
      {
        label: "Reddit",
        href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      },
      {
        label: "Email",
        href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
        icon: Mail,
      },
    ]
  }, [post.title, shareUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      setCopied(false)
    }
  }

  const gradientColors = getBlogGradientColors(post.blogColor, post.coverImageColor)
  const gradientStyle = gradientColors
    ? {
        backgroundImage: `radial-gradient(circle at top, ${gradientColors.top}, transparent 55%), radial-gradient(circle at 20% 80%, ${gradientColors.bottom}, transparent 60%)`,
      }
    : {
        backgroundImage:
          "radial-gradient(circle at top, rgba(16,185,129,0.18), transparent 55%), radial-gradient(circle at 20% 80%, rgba(59,130,246,0.16), transparent 60%)",
      }

  const isLight = theme === "light"
  const headerImage = post.coverImage || post.thumbnail || "/placeholder.svg?height=600&width=800&query=blog"
  const headerImageInline = headerImage.startsWith("data:")
  const stripeTitle = post.title.replace(/-/g, "\u2011")

  return (
    <div
      data-reading-theme={theme}
      className={isLight ? "text-neutral-900" : "text-white"}
    >
      <div className="fixed left-0 top-0 z-30 h-1 w-full bg-black/10">
        <div
          className="h-full bg-emerald-400 transition-[width] duration-150"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div
        className={
          isLight
            ? "bg-white/80 border border-neutral-200"
            : "bg-black/30 backdrop-blur-sm border border-neutral-800"
        }
      >
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-center p-6 md:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-[0.3em]">
              {post.category && (
                <Link
                  href={`/blog/category/${slugifyCategory(post.category)}`}
                  className={
                    isLight
                      ? "inline-flex items-center gap-2 border border-emerald-600/40 bg-emerald-50 px-3 py-1 text-emerald-700"
                      : "inline-flex items-center gap-2 border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-100"
                  }
                >
                  <Folder className="h-4 w-4" />
                  {post.category}
                </Link>
              )}
              {post.featured && (
                <span className={isLight ? "text-neutral-500" : "text-neutral-300"}>Featured</span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">{post.title}</h1>
            {post.excerpt && (
              <p className={isLight ? "text-neutral-600 text-lg" : "text-neutral-300 text-lg"}>{post.excerpt}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {displayDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  <span className={isLight ? "text-neutral-600" : "text-neutral-400"}>{displayDate}</span>
                </div>
              )}
              {post.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span className={isLight ? "text-neutral-600" : "text-neutral-400"}>{post.location}</span>
                </div>
              )}
              {readingTimeLabel && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span className={isLight ? "text-neutral-600" : "text-neutral-400"}>{readingTimeLabel}</span>
                </div>
              )}
              {wordCountLabel && (
                <div className="flex items-center gap-2">
                  <span className={isLight ? "text-neutral-500" : "text-neutral-500"}>{wordCountLabel}</span>
                </div>
              )}
            </div>

            {authors.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {authors.map((author) => (
                  <div
                    key={author.name}
                    className={
                      isLight
                        ? "border border-neutral-200 bg-white/80 px-4 py-3"
                        : "border border-neutral-800 bg-black/40 px-4 py-3"
                    }
                  >
                    <div className="text-sm font-semibold">{author.name}</div>
                    {author.role && <div className={isLight ? "text-xs text-neutral-500" : "text-xs text-neutral-400"}>{author.role}</div>}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className={isLight ? "text-xs text-emerald-700" : "text-xs text-emerald-300"}
                      >
                        {author.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <div
                    key={tag}
                    className={
                      isLight
                        ? "flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-200 px-2 py-1 font-mono"
                        : "flex items-center gap-1 text-xs bg-black/50 border border-neutral-800 px-2 py-1 font-mono"
                    }
                  >
                    <Tag className="h-3 w-3 text-emerald-400" />
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative aspect-video overflow-hidden border border-neutral-800">
            <Image
              src={headerImage}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized={headerImageInline}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-full px-6 py-4 text-center text-lg md:text-2xl font-marker text-white text-balance leading-tight"
                style={{ backgroundColor: post.coverImageColor || "rgb(16, 16, 16)" }}
              >
                {stripeTitle}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={
              isLight
                ? "inline-flex items-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-xs font-mono uppercase tracking-wide text-neutral-700"
                : "inline-flex items-center gap-2 border border-neutral-800 bg-black/40 px-3 py-2 text-xs font-mono uppercase tracking-wide text-neutral-200"
            }
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light theme" : "Dark theme"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className={
              isLight
                ? "inline-flex items-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-xs font-mono uppercase tracking-wide text-neutral-700"
                : "inline-flex items-center gap-2 border border-neutral-800 bg-black/40 px-3 py-2 text-xs font-mono uppercase tracking-wide text-neutral-200"
            }
          >
            <Share2 className="h-4 w-4" />
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-wide">
          {shareLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                isLight
                  ? "inline-flex items-center gap-2 border border-neutral-200 bg-white px-3 py-2 text-neutral-700"
                  : "inline-flex items-center gap-2 border border-neutral-800 bg-black/40 px-3 py-2 text-neutral-200"
              }
            >
              {link.icon ? <link.icon className="h-4 w-4" /> : null}
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={
          isLight
            ? "mt-10 bg-white/80 border border-neutral-200 p-6 md:p-10"
            : "mt-10 bg-black/30 backdrop-blur-sm border border-neutral-800 p-6 md:p-10"
        }
      >
        <div className={isLight ? "prose max-w-none" : "prose prose-invert max-w-none"}>
          <Markdown content={post.content} tone={theme} />
        </div>

        {post.gallery && post.gallery.length > 0 && (
          <div className={isLight ? "mt-12 pt-8 border-t border-neutral-200" : "mt-12 pt-8 border-t border-neutral-800"}>
            <Gallery images={post.gallery} title="Article Gallery" />
          </div>
        )}
      </div>

      <div className="mt-16 border-t border-neutral-800 pt-10">
        <div
          className={
            isLight
              ? "relative overflow-hidden border border-neutral-200 bg-white/80 p-8 md:p-12"
              : "relative overflow-hidden border border-neutral-800 bg-black/30 backdrop-blur-sm p-8 md:p-12"
          }
        >
          <div className="pointer-events-none absolute inset-0" style={gradientStyle}></div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className={isLight ? "text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 mb-4" : "text-xs font-mono uppercase tracking-[0.3em] text-emerald-200/80 mb-4"}>
              Want to see more updates?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Keep the momentum going</h2>
            <p className={isLight ? "text-neutral-600 mb-6" : "text-neutral-400 mb-6"}>
              Dive deeper into this category or head back to the full blog feed.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-mono">
              <Link
                href={post.category ? `/blog/category/${slugifyCategory(post.category)}` : "/blog"}
                className={
                  isLight
                    ? "inline-flex items-center gap-2 border border-emerald-400/60 bg-emerald-50 px-4 py-2 text-emerald-700 transition hover:border-emerald-500"
                    : "inline-flex items-center gap-2 border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-500/20"
                }
              >
                <Folder className="h-4 w-4" />
                {post.category ? `See more of ${post.category}` : "See more posts"}
              </Link>
              <Link
                href="/blog"
                className={
                  isLight
                    ? "inline-flex items-center gap-2 border border-neutral-200 bg-white px-4 py-2 text-neutral-700 transition hover:border-neutral-300"
                    : "inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                }
              >
                See all blog posts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {progress > 0.15 && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={
            isLight
              ? "fixed bottom-6 right-6 z-20 rounded-full border border-neutral-200 bg-white p-3 text-neutral-700 shadow"
              : "fixed bottom-6 right-6 z-20 rounded-full border border-neutral-800 bg-black/60 p-3 text-white"
          }
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
