"use client"

import RichMarkdown, { Gallery } from "@/components/rich-markdown"
import PostcardArt from "./postcard-art"
import { ArrowLeftIcon, ArrowRightIcon } from "./icons"
import { lineFor } from "@/lib/profile"
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

/** The project a post is about, as a card that boards it. */
function RelatedProject({ project, onOpen }: { project: ContentItem; onOpen: () => void }) {
  const line = lineFor(project.categories)
  return (
    <button className="bp-project" type="button" onClick={onOpen}>
      <span className={`gthumb line-${line.dot}`}>
        {project.coverImage ? (
          <span className="rj-slot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverImage} alt="" loading="lazy" />
          </span>
        ) : (
          <span className="gname">{project.title}</span>
        )}
      </span>
      <span className="bp-project-body">
        <span className="bp-project-kick">The project behind this post</span>
        <span className="bp-project-title">{project.title}</span>
        {project.summary ? <span className="bp-project-sum">{project.summary}</span> : null}
        <span className="bp-project-go">
          Open the project
          <ArrowRightIcon />
        </span>
      </span>
    </button>
  )
}

interface PostReaderProps {
  post: ContentItem | null
  project: ContentItem | null
  index: number
  open: boolean
  onClose: () => void
  onOpenImage: (images: GalleryImage[], index: number) => void
  onOpenProject: (slug: string) => void
}

export default function PostReader({ post, project, index, open, onClose, onOpenImage, onOpenProject }: PostReaderProps) {
  // A post's photos close it as a gallery, unless the body already placed
  // them with ::gallery.
  const showGallery = Boolean(post?.gallery.length) && !/^\s*::gallery\b/m.test(post?.content ?? "")

  return (
    <section className={`bp${open ? " on reveal" : ""}`} aria-hidden={!open}>
      <div className="bp-scroll">
        <div className="bp-in">
          <button className="back2 rv r1" type="button" onClick={onClose}>
            <ArrowLeftIcon />
            Back to My Writing
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

              {showGallery ? (
                <div className="bp-gallery rv r3">
                  <h3 className="bp-section">Photos</h3>
                  <Gallery images={post.gallery} onOpenImage={onOpenImage} />
                </div>
              ) : null}

              {project ? (
                <div className="rv r3">
                  <RelatedProject project={project} onOpen={() => onOpenProject(project.slug)} />
                </div>
              ) : null}

              <div className="bfoot rv r3">
                <span className="sig">
                  RJ · My Writing · {post.location || "Greensboro, NC"}
                </span>
                <button className="back2" style={{ marginBottom: 0 }} type="button" onClick={onClose}>
                  <ArrowLeftIcon />
                  Back to My Writing
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
