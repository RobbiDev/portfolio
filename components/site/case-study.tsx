"use client"

import RichMarkdown from "@/components/rich-markdown"
import { lineFor } from "@/lib/profile"
import type { ContentItem } from "@/lib/content"
import type { GalleryImage } from "@/lib/types"

interface CaseStudyProps {
  project: ContentItem | null
  open: boolean
  onClose: () => void
  onOpenImage: (images: GalleryImage[], index: number) => void
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

  return (
    <section className={`cs${open ? " on reveal" : ""}`} aria-hidden={!open}>
      <div className="cs-scroll">
        <div className="cs-in">
          <button className="pv-back rv r1" type="button" onClick={onClose}>
            ← Back to {project?.title ?? "the project"}
          </button>

          {project && line ? (
            <>
              <div className="mb-head rv r1">
                <span className="mlogo">M</span>
                <span className="mb-title" style={{ fontFamily: "var(--helv)", fontWeight: 700 }}>
                  Case Study
                </span>
                <span className="mb-sub" style={{ fontFamily: "var(--helv)" }}>
                  {line.label}
                  <br />
                  robbyj.dev
                </span>
              </div>

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

              {stats.length > 0 ? (
                <div className="sec rv r4">
                  <div className="sec-h">
                    <span>Project Data</span>
                    <span>01</span>
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

              <div className="sec">
                <div className="sec-h">
                  <span>Field Report</span>
                  <span>{stats.length > 0 ? "02" : "01"}</span>
                </div>
                <article>
                  <RichMarkdown content={project.content} gallery={project.gallery} onOpenImage={onOpenImage} />
                </article>
              </div>

              {project.liveUrl || project.githubUrl ? (
                <div className="sec">
                  <div className="sec-h">
                    <span>Where It&rsquo;s Headed</span>
                    <span>{stats.length > 0 ? "03" : "02"}</span>
                  </div>
                  <div className="btn-row">
                    {project.liveUrl ? (
                      <a className="btn rd" href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                        Visit Live Product <span>→</span>
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
