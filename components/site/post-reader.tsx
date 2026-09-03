"use client"

import RichMarkdown from "@/components/rich-markdown"
import PostcardArt from "./postcard-art"
import type { ContentItem } from "@/lib/content"
import type { GalleryImage } from "@/lib/types"

function formatDate(value?: string): string | null {
  if (!value) return null
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

function districtClass(item: ContentItem): string {
  const category = (item.categories[0] || "").toLowerCase()
  if (category.includes("news")) return "news"
  if (category.includes("talk") || category.includes("speak")) return "talk"
  return "blog"
}

interface PostReaderProps {
  post: ContentItem | null
  index: number
  open: boolean
  onClose: () => void
  onOpenImage: (images: GalleryImage[], index: number) => void
}

export default function PostReader({ post, index, open, onClose, onOpenImage }: PostReaderProps) {
  return (
    <section className={`bp${open ? " on reveal" : ""}`} aria-hidden={!open}>
      <div className="bp-scroll">
        <div className="bp-in">
          <button className="back2 rv r1" type="button" onClick={onClose}>
            ← Back to Field Notes
          </button>

          {post ? (
            <>
              <div className="hero-card rv r2">
                <PostcardArt item={post} index={index} className="thumb" />
                <div className="hero-body">
                  <div className="bmeta">
                    <span className={`district ${districtClass(post)}`}>{post.categories[0] || "Blog"}</span>
                    {formatDate(post.date) ? <span>{formatDate(post.date)}</span> : null}
                    <span>·</span>
                    <span>{post.readingMinutes} min read</span>
                    {post.draft ? (
                      <>
                        <span>·</span>
                        <span>Draft</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="btitle">{post.title}</h2>
                  {post.summary ? <p className="dek">{post.summary}</p> : null}
                </div>
              </div>

              <article className="rv r3">
                <RichMarkdown content={post.content} gallery={post.gallery} onOpenImage={onOpenImage} />
              </article>

              <div className="bfoot rv r3">
                <span className="sig">
                  RJ · Field Notes · {post.location || "Greensboro, NC"}
                </span>
                <button className="back2" style={{ marginBottom: 0 }} type="button" onClick={onClose}>
                  ← Back to Field Notes
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
