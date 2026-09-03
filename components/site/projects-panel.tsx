"use client"

import { useCallback, useRef, useState } from "react"
import { lineFor, profile } from "@/lib/profile"
import type { ContentItem } from "@/lib/content"

interface ProjectsPanelProps {
  projects: ContentItem[]
  panelRef: React.RefObject<HTMLDivElement>
  open: boolean
  reveal: boolean
  pushed: boolean
  onOpenProject: (slug: string) => void
  onLearn: () => void
}

export default function ProjectsPanel({
  projects,
  panelRef,
  open,
  reveal,
  pushed,
  onOpenProject,
  onLearn,
}: ProjectsPanelProps) {
  // Tapping the platform pylon sends a train across the bottom of the board.
  const [riding, setRiding] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ride = useCallback(() => {
    if (riding) return
    setRiding(true)
    timer.current = setTimeout(() => setRiding(false), 4400)
  }, [riding])

  const className = ["panel", open ? "on" : "", reveal ? "reveal" : "", pushed ? "pushed" : "", riding ? "rumble" : ""]
    .filter(Boolean)
    .join(" ")

  return (
    <section className={className} id="panel-work" aria-hidden={!open}>
      <div className="panel-scroll" ref={panelRef}>
        <div
          className="pylon"
          role="button"
          tabIndex={0}
          aria-label="Call a train"
          onClick={ride}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              ride()
            }
          }}
        >
          <div className="pm">M</div>
          <div className="pstripes">
            <i className="s1" />
            <i className="s2" />
            <i className="s3" />
          </div>
          <div className="pword" />
        </div>

        <div className={`train${riding ? " go" : ""}`} aria-hidden="true">
          <div className="tcar">
            <i className="tw" />
            <i className="tw" />
            <i className="tw" />
            <i className="tw" />
            <b className="tdoor" />
            <b className="tdoor d2" />
            <span className="tstripe" />
          </div>
          <div className="tcar">
            <i className="tw" />
            <i className="tw" />
            <i className="tw" />
            <i className="tw" />
            <b className="tdoor" />
            <b className="tdoor d2" />
            <span className="tstripe" />
          </div>
          <div className="tcar head">
            <i className="tw" />
            <i className="tw" />
            <i className="tw" />
            <b className="tdoor" />
            <span className="tstripe" />
            <span className="tlight" />
          </div>
        </div>

        <div className="panel-in">
          <div className="mb-head stagger s1">
            <span className="mlogo">M</span>
            <span className="mb-title">Projects</span>
            <button className="mb-learn" type="button" onClick={onLearn} style={{ marginLeft: "auto" }}>
              <span className="lstar">✳</span>Learn
            </button>
          </div>

          <div className="stagger s2">
            {projects.map((project) => {
              const line = lineFor(project.categories)
              return (
                <button className="brow" type="button" key={project.slug} onClick={() => onOpenProject(project.slug)}>
                  <span className="gthumb">
                    {project.coverImage ? (
                      <span className="rj-slot">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={project.coverImage} alt="" loading="lazy" />
                      </span>
                    ) : null}
                    <span className="gm">M</span>
                    {/* Cover art normally carries its own title lockup. */}
                    {project.coverImage ? null : <span className="gname">{project.title}</span>}
                  </span>
                  <span className="binfo">
                    <span className="bline">
                      <span className={`ldot ${line.dot}`}>{line.initial}</span>
                      <span className="llabel">
                        {line.label}
                        {project.draft ? " · In development" : ""}
                      </span>
                    </span>
                    <span className="bname">{project.title}</span>
                    <span className="bdest">{project.summary}</span>
                    <span className="bgo">
                      Board this project <span>→</span>
                    </span>
                  </span>
                </button>
              )
            })}

            <div className="brow soon">
              <span className="gthumb soon">
                <span className="gm">M</span>
                <span className="gname">Next departure</span>
              </span>
              <span className="binfo">
                <span className="bline">
                  <span className="ldot yl">N</span>
                  <span className="llabel">Yellow Line · Network</span>
                </span>
                <span className="bname">Next departure</span>
                <span className="bdest">to Be Announced.</span>
              </span>
            </div>
          </div>

          <div className="board-note stagger s3">
            <span>Service updates roll out on GitHub first</span>
            <a href={profile.github} target="_blank" rel="noreferrer noopener">
              github.com/{profile.githubHandle} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
