"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "./icons"
import { lineFor } from "@/lib/profile"
import type { ContentItem } from "@/lib/content"
import type { GalleryImage } from "@/lib/types"

interface ProjectDetailProps {
  project: ContentItem | null
  open: boolean
  onClose: () => void
  onOpenCaseStudy: () => void
  onOpenImage: (images: GalleryImage[], index: number) => void
}

export default function ProjectDetail({
  project,
  open,
  onClose,
  onOpenCaseStudy,
  onOpenImage,
}: ProjectDetailProps) {
  const line = project ? lineFor(project.categories) : null
  // The stack shows the top three shots; the lightbox holds the whole gallery.
  const stack = project ? project.gallery.slice(0, 3) : []

  return (
    <section className={`pv${open ? " on" : ""}`} aria-hidden={!open}>
      <div className="pv-scroll">
        <div className="pv-in">
          <button className="pv-back stg g1" type="button" onClick={onClose}>
            <ArrowLeftIcon />
            Back to the board
          </button>

          {project && line ? (
            <>
              <div className="pv-head stg g1">
                <span className={`ldot ${line.dot}`} style={{ width: 48, height: 48, fontSize: 19 }}>
                  {line.initial}
                </span>
                <h2 className="pv-title">{project.title}</h2>
                <div className="pv-tag">
                  {[line.label, project.categories.slice(1).join(" · "), project.timeline || project.status]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </div>

              {stack.length > 0 ? (
                <div className="pv-shot stg g2" style={{ border: "none", background: "none", aspectRatio: "auto" }}>
                  <div className="stackwrap">
                    <div
                      className="stack"
                      title="Open highlights"
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
                      {stack
                        .map((image, index) => ({ image, index }))
                        .reverse()
                        .map(({ image, index }) => (
                          <div className="scard" key={image.url}>
                            <div className="rj-slot">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={image.url} alt={image.alt || image.title || ""} loading="lazy" />
                            </div>
                            <span className="rj-sr-only">{index + 1}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="pv-grid">
                <div className="pv-text stg g3">
                  {project.summary ? <p className="pv-d">{project.summary}</p> : null}
                  {project.role || project.client ? (
                    <p className="pv-d">
                      {project.role ? <b>{project.role}. </b> : null}
                      {project.client ? `Built for ${project.client}.` : null}
                    </p>
                  ) : null}

                  {project.technologies.length > 0 ? (
                    <div className="chips">
                      {project.technologies.map((tech) => (
                        <span className="chip" key={tech}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}

                </div>

                <div className="pv-route stg g4">
                  {project.features && project.features.length > 0 ? (
                    <ul className="route">
                      {project.features.map((feature) => {
                        // "Title — detail" splits into a stop name and its blurb.
                        const [head, ...rest] = feature.split(/\s+[—–-]\s+/)
                        return (
                          <li key={feature}>
                            <b>{head}</b>
                            {rest.join(" — ")}
                          </li>
                        )
                      })}
                    </ul>
                  ) : null}
                </div>

                <div className="pv-actions stg g4">
                  <div className="btn-row">
                    {project.liveUrl ? (
                      <a className="btn acc" href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                        Visit Live Product
                        <ArrowRightIcon />
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a className="btn ghost" href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                        Source
                      </a>
                    ) : null}
                    <button className="btn ghost" type="button" onClick={onOpenCaseStudy}>
                      Full Case Study
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
