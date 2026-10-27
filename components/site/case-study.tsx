"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import RichMarkdown, { Gallery } from "@/components/rich-markdown"
import { ArrowLeftIcon, ArrowRightIcon } from "./icons"
import { lineFor } from "@/lib/profile"
import { extractSplits } from "@/lib/rich-markdown"
import type { ContentItem } from "@/lib/content"
import type { GalleryImage } from "@/lib/types"

interface CaseStudyProps {
  project: ContentItem | null
  open: boolean
  onClose: () => void
  onOpenImage: (images: GalleryImage[], index: number) => void
}

interface TocEntry {
  id: string
  label: string
}

/** The board's line colours, used when a project sets no colour of its own. */
const LINE_COLOR: Record<string, string> = {
  rd: "#e51636",
  yl: "#efc31f",
  gr: "#0fab4b",
  bl: "#1574c4",
}

/** "SOFTWARE" → "Software": the categories are written in caps for the board. */
function titleCase(value: string): string {
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Headings the contents list is built from: section titles and the write-up's own h1/h2s. */
const HEADING_SELECTOR = ".cs-h2, .cs-prose h1, .cs-prose h2"

/**
 * The full case study: a reading page. A pinned bar carries the way back and
 * the reading progress; on wide screens a sticky contents list sits beside
 * the write-up and follows along.
 */
export default function CaseStudy({ project, open, onClose, onOpenImage }: CaseStudyProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [toc, setToc] = useState<TocEntry[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [pastHeader, setPastHeader] = useState(false)

  const facts = project
    ? [
        { key: "Role", value: project.role },
        { key: "Client", value: project.client },
        { key: "Timeline", value: project.timeline },
        { key: "Status", value: project.status || (project.draft ? "In development" : undefined) },
        { key: "Stack", value: project.technologies.join(", ") },
      ].filter((fact): fact is { key: string; value: string } => Boolean(fact.value))
    : []

  // The two-column "problem / approach" blocks are lifted out of the body so
  // they open the write-up as sections of their own.
  const { splits, body } = useMemo(() => extractSplits(project?.content ?? ""), [project?.content])
  const kind = project?.categories.map(titleCase).join(" · ")
  const accent = project ? project.accent || LINE_COLOR[lineFor(project.categories).dot] : undefined

  // Collect the rendered headings once the page is on screen, give each an
  // id, and list them. Reading the DOM keeps markdown headings in the list
  // without the renderer having to know about it.
  useEffect(() => {
    if (!open || !project) return
    const frame = requestAnimationFrame(() => {
      const used = new Set<string>()
      const entries: TocEntry[] = []
      bodyRef.current?.querySelectorAll<HTMLElement>(HEADING_SELECTOR).forEach((heading) => {
        const label = heading.textContent?.trim()
        if (!label) return
        let id = `cs-${slugify(label)}`
        while (used.has(id)) id += "-x"
        used.add(id)
        heading.id = id
        entries.push({ id, label })
      })
      setToc(entries)
      setActive(entries[0]?.id ?? null)
    })
    if (scrollRef.current) scrollRef.current.scrollTop = 0
    setProgress(0)
    setPastHeader(false)
    return () => cancelAnimationFrame(frame)
  }, [open, project])

  const onScroll = useCallback(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const max = scroller.scrollHeight - scroller.clientHeight
    setProgress(max > 0 ? scroller.scrollTop / max : 0)
    setPastHeader(scroller.scrollTop > 220)

    // The current section is the last heading above the top third of the view.
    const line = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.3
    let current: string | null = toc[0]?.id ?? null
    for (const entry of toc) {
      const heading = document.getElementById(entry.id)
      if (heading && heading.getBoundingClientRect().top <= line) current = entry.id
    }
    setActive(current)
  }, [toc])

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <section
      className={`cs${open ? " on reveal" : ""}`}
      aria-hidden={!open}
      style={accent ? ({ "--cs-accent": accent } as React.CSSProperties) : undefined}
    >
      <div className="cs-scroll" ref={scrollRef} onScroll={onScroll}>
        <div className="cs-bar">
          <div className="cs-bar-in">
            <button className="cs-back" type="button" onClick={onClose}>
              <ArrowLeftIcon />
              <span>Back</span>
            </button>
            <span className={`cs-bar-title${pastHeader ? " show" : ""}`}>{project?.title}</span>
          </div>
          <span className="cs-progress" style={{ transform: `scaleX(${progress})` }} />
        </div>

        <div className="cs-in cs-read">
          {project ? (
            <>
              <header className="cs-header rv r2">
                <p className="cs-eyebrow">
                  Case study{kind ? ` · ${kind}` : ""}
                </p>
                <h2 className="cs-h1">{project.title}</h2>
                {project.summary ? <p className="cs-lede">{project.summary}</p> : null}
              </header>

              <div className="cs-layout">
                {toc.length > 1 ? (
                  <nav className="cs-toc" aria-label="On this page">
                    <span className="cs-toc-h">On this page</span>
                    <ol>
                      {toc.map((entry) => (
                        <li key={entry.id}>
                          <button
                            type="button"
                            className={entry.id === active ? "on" : undefined}
                            onClick={() => jump(entry.id)}
                          >
                            {entry.label}
                          </button>
                        </li>
                      ))}
                    </ol>
                  </nav>
                ) : null}

                <div className="cs-main" ref={bodyRef}>
                  {project.coverImage ? (
                    <div className="cs-cover rv r3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.coverImage} alt="" />
                    </div>
                  ) : null}

                  {facts.length > 0 ? (
                    <dl className="cs-facts rv r3">
                      {facts.map((fact) => (
                        <div key={fact.key} className={fact.key === "Stack" ? "wide" : undefined}>
                          <dt>{fact.key}</dt>
                          <dd>{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {splits.map((split, index) => (
                    <section className="cs-section rv r4" key={index}>
                      {split.title ? <h3 className="cs-h2">{split.title}</h3> : null}
                      <article className="cs-prose">
                        <RichMarkdown content={split.left} gallery={project.gallery} onOpenImage={onOpenImage} />
                        {split.right ? (
                          <RichMarkdown content={split.right} gallery={project.gallery} onOpenImage={onOpenImage} />
                        ) : null}
                      </article>
                    </section>
                  ))}

                  {body ? (
                    <section className="cs-section">
                      <article className="cs-prose">
                        <RichMarkdown content={body} gallery={project.gallery} onOpenImage={onOpenImage} />
                      </article>
                    </section>
                  ) : null}

                  {project.liveUrl || project.githubUrl ? (
                    <section className="cs-section">
                      <h3 className="cs-h2">Links</h3>
                      <div className="cs-links">
                        {project.liveUrl ? (
                          <a className="cs-btn primary" href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                            Visit the live site
                            <ArrowRightIcon />
                          </a>
                        ) : null}
                        {project.githubUrl ? (
                          <a className="cs-btn" href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                            Source on GitHub
                          </a>
                        ) : null}
                      </div>
                    </section>
                  ) : null}

                  {project.gallery.length ? (
                    <section className="cs-section">
                      <h3 className="cs-h2">Gallery</h3>
                      <Gallery images={project.gallery} onOpenImage={onOpenImage} />
                    </section>
                  ) : null}

                  <button className="cs-back cs-back-end" type="button" onClick={onClose}>
                    <ArrowLeftIcon />
                    Back to {project.title}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
