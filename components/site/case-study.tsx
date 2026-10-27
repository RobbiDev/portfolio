"use client"

import { useMemo } from "react"

import RichMarkdown, { Gallery } from "@/components/rich-markdown"
import { ArrowLeftIcon, ArrowRightIcon } from "./icons"
import { extractSplits } from "@/lib/rich-markdown"
import type { ContentItem } from "@/lib/content"
import type { GalleryImage } from "@/lib/types"

interface CaseStudyProps {
  project: ContentItem | null
  open: boolean
  onClose: () => void
  onOpenImage: (images: GalleryImage[], index: number) => void
}

/** "SOFTWARE" → "Software": the categories are written in caps for the board. */
function titleCase(value: string): string {
  return value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
}

/**
 * The full case study: a plain reading page. One narrow column, the
 * project's facts as a short list, then the write-up, links and gallery.
 */
export default function CaseStudy({ project, open, onClose, onOpenImage }: CaseStudyProps) {
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

  return (
    <section className={`cs${open ? " on reveal" : ""}`} aria-hidden={!open}>
      <div className="cs-scroll">
        <div className="cs-in cs-read">
          <button className="cs-back rv r1" type="button" onClick={onClose}>
            <ArrowLeftIcon />
            Back to {project?.title ?? "the project"}
          </button>

          {project ? (
            <>
              <header className="cs-header rv r2">
                <p className="cs-eyebrow">Case study{kind ? ` · ${kind}` : ""}</p>
                <h2 className="cs-h1">{project.title}</h2>
                {project.summary ? <p className="cs-lede">{project.summary}</p> : null}
              </header>

              {project.coverImage ? (
                <div className="cs-cover rv r3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.coverImage} alt="" />
                </div>
              ) : null}

              {facts.length > 0 ? (
                <dl className="cs-facts rv r3">
                  {facts.map((fact) => (
                    <div key={fact.key}>
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
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
