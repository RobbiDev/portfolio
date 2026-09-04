"use client"

import { useMemo } from "react"

import RichMarkdown, { SplitSection } from "@/components/rich-markdown"
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

/** Sections are numbered in the order they appear: 01, 02, 03… */
function pad(index: number): string {
  return String(index).padStart(2, "0")
}

export default function CaseStudy({ project, open, onClose, onOpenImage }: CaseStudyProps) {
  const line = project ? lineFor(project.categories) : null
  const stats = project
    ? [
        { key: "Role", value: project.role },
        { key: "Client", value: project.client },
        { key: "Type", value: project.categories.join(" · ") },
        { key: "Timeline", value: project.timeline },
        { key: "Status", value: project.status || (project.draft ? "In development" : "Live") },
        { key: "Stack", value: project.technologies.slice(0, 4).join(", ") },
      ].filter((stat): stat is { key: string; value: string } => Boolean(stat.value))
    : []

  // The two-column "problem / approach" blocks are lifted out of the body so
  // they read as sections of the case study rather than as mid-prose asides.
  const { splits, body } = useMemo(() => extractSplits(project?.content ?? ""), [project?.content])

  let count = 0
  const dataIndex = stats.length > 0 ? pad(++count) : null
  const splitIndexes = splits.map(() => pad(++count))
  const reportIndex = body ? pad(++count) : null
  const linksIndex = project?.liveUrl || project?.githubUrl ? pad(++count) : null

  return (
    <section className={`cs${open ? " on reveal" : ""}`} aria-hidden={!open}>
      <div className="cs-scroll">
        <div className="cs-in">
          <div className="mb-head rv r1">
            <span className="mlogo">M</span>
            <span className="mb-title" style={{ fontFamily: "var(--helv)", fontWeight: 700 }}>
              Case Study
            </span>
            <button className="pv-back mb-back" type="button" onClick={onClose}>
              <ArrowLeftIcon />
              Back to {project?.title ?? "the project"}
            </button>
          </div>

          {project && line ? (
            <>
              <div className="cs-head rv r2">
                <span className={`ldot ${line.dot}`} style={{ width: 48, height: 48, fontSize: 19 }}>
                  {line.initial}
                </span>
                <h2 className="cs-title">{project.title}</h2>
                <div className="pv-tag">
                  {[line.label, project.timeline, project.status].filter(Boolean).join(" · ")}
                </div>
              </div>

              {project.gallery[0] ? (
                <div
                  className="cs-shot rv r3"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenImage(project.gallery, 0)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      onOpenImage(project.gallery, 0)
                    }
                  }}
                >
                  <div className="rj-slot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.gallery[0].url}
                      alt={project.gallery[0].alt || project.title}
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : null}

              {dataIndex ? (
                <div className="sec rv r4">
                  <div className="sec-h">
                    <span>Project Data</span>
                    <span>{dataIndex}</span>
                  </div>
                  <div className="stat-grid">
                    {stats.map((stat) => (
                      <div className="stat" key={stat.key}>
                        <div className="k">{stat.key}</div>
                        <div className="v">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {splits.map((split, index) => (
                <SplitSection
                  key={index}
                  title={split.title}
                  left={split.left}
                  right={split.right}
                  index={splitIndexes[index]}
                  onOpenImage={onOpenImage}
                />
              ))}

              {reportIndex ? (
                <div className="sec">
                  <div className="sec-h">
                    <span>Field Report</span>
                    <span>{reportIndex}</span>
                  </div>
                  <article>
                    <RichMarkdown content={body} gallery={project.gallery} onOpenImage={onOpenImage} />
                  </article>
                </div>
              ) : null}

              {linksIndex ? (
                <div className="sec">
                  <div className="sec-h">
                    <span>Where It&rsquo;s Headed</span>
                    <span>{linksIndex}</span>
                  </div>
                  <div className="btn-row">
                    {project.liveUrl ? (
                      <a className="btn rd" href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                        Visit Live Product
                        <ArrowRightIcon />
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a className="btn ghost" href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                        Source on GitHub
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
