"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import AboutPanel, { type FileKey } from "./about-panel"
import CaseStudy from "./case-study"
import ContactPanel from "./contact-panel"
import Lightbox, { type LightboxState } from "./lightbox"
import PostReader from "./post-reader"
import ProjectDetail from "./project-detail"
import ProjectsPanel from "./projects-panel"
import WritingPanel from "./writing-panel"
import { AsteriskIcon, CloseIcon, StarIcon } from "./icons"
import { profile } from "@/lib/profile"
import { track } from "@/lib/analytics"
import type { ContentItem } from "@/lib/content"
import type { GalleryImage } from "@/lib/types"

type PanelId = "work" | "writing" | "about" | "contact"

const PANELS: PanelId[] = ["work", "writing", "about", "contact"]
const PANEL_LABEL: Record<PanelId, string> = {
  work: "Projects",
  writing: "Writing",
  about: "About",
  contact: "Contact",
}
const GLYPHS = "ABCDEFGHIKLMNOPRSTUVWX/·01"

/** The design's letter-scramble reveal, driven by rAF. */
function useScramble(word: string, active: boolean, delay: number) {
  const [text, setText] = useState(word)

  useEffect(() => {
    if (!active) {
      setText(word)
      return
    }

    let frame = 0
    let raf = 0
    const total = Math.max(14, word.length * 3)
    const start = window.setTimeout(() => {
      const tick = () => {
        let out = ""
        for (let i = 0; i < word.length; i++) {
          out += frame / 3 > i ? word[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        setText(out)
        if (frame++ < total) raf = requestAnimationFrame(tick)
        else setText(word)
      }
      raf = requestAnimationFrame(tick)
    }, delay)

    return () => {
      window.clearTimeout(start)
      cancelAnimationFrame(raf)
    }
  }, [word, active, delay])

  return text
}

function MenuItem({
  index,
  label,
  menuOpen,
  onSelect,
}: {
  index: number
  label: string
  menuOpen: boolean
  onSelect: () => void
}) {
  const text = useScramble(label, menuOpen, 120 + index * 70)
  return (
    <button className="mitem" type="button" onClick={onSelect}>
      <span className="idx">{String(index).padStart(2, "0")}</span>
      <span className="word">{text}</span>
    </button>
  )
}

export interface SiteShellProps {
  projects: ContentItem[]
  posts: ContentItem[]
}

export default function SiteShell({ projects, posts }: SiteShellProps) {
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [reveal, setReveal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const [projectSlug, setProjectSlug] = useState<string | null>(null)
  const [caseStudyOpen, setCaseStudyOpen] = useState(false)
  const [postSlug, setPostSlug] = useState<string | null>(null)
  const [wipe, setWipe] = useState<"none" | "nav" | "writing">("none")

  const [openFile, setOpenFile] = useState<FileKey | null>(null)
  const [deskOpen, setDeskOpen] = useState(false)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  const scrollRefs = {
    work: useRef<HTMLDivElement>(null),
    writing: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  }

  const project = useMemo(
    () => projects.find((item) => item.slug === projectSlug) ?? null,
    [projects, projectSlug],
  )
  const postIndex = useMemo(() => posts.findIndex((item) => item.slug === postSlug), [posts, postSlug])
  const post = postIndex >= 0 ? posts[postIndex] : null

  /* ── body classes the stylesheet keys off ─────────────────────────────── */
  const [bodyFx, setBodyFx] = useState<"none" | "opening" | "tp">("none")

  useEffect(() => {
    const { classList } = document.body
    classList.toggle("paneled", panel !== null)
    classList.toggle("opening", bodyFx === "opening")
    classList.toggle("tp", bodyFx === "tp")
    return () => classList.remove("paneled", "opening", "tp")
  }, [panel, bodyFx])

  /* ── navigation ───────────────────────────────────────────────────────── */

  const closeOverlays = useCallback(() => {
    setProjectSlug(null)
    setCaseStudyOpen(false)
    setPostSlug(null)
    setDeskOpen(false)
    setOpenFile(null)
    setLightbox(null)
  }, [])

  const go = useCallback(
    (next: PanelId | "home") => {
      if (busy) return
      setBusy(true)
      if (next !== "home") track("panel_view", { panel: next })

      // Projects gets the transporter effect; everything else gets the wipe.
      const teleport = next === "work"
      setBodyFx(teleport ? "tp" : "opening")

      window.setTimeout(() => {
        setMenuOpen(false)
        closeOverlays()
        setReveal(false)
        Object.values(scrollRefs).forEach((ref) => {
          if (ref.current) ref.current.scrollTop = 0
        })

        if (next === "home") {
          setPanel(null)
        } else {
          setPanel(next)
          requestAnimationFrame(() => setReveal(true))
        }

        if (typeof history !== "undefined" && history.replaceState) {
          history.replaceState(null, "", next === "home" ? "#" : `#${next}`)
        }
      }, teleport ? 350 : 280)

      window.setTimeout(
        () => {
          setBodyFx("none")
          setBusy(false)
        },
        teleport ? 720 : 580,
      )
    },
    // scrollRefs is a stable object of refs; excluding it keeps `go` stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [busy, closeOverlays],
  )

  /* Restore the panel named in the URL hash on first load. */
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (PANELS.includes(hash as PanelId)) {
      setPanel(hash as PanelId)
      setReveal(true)
    }
  }, [])

  /* ── readers, each with the wipe the design gives it ──────────────────── */

  const openPost = useCallback((slug: string) => {
    track("post_view", { post: slug })
    setWipe("writing")
    window.setTimeout(() => {
      setPostSlug(slug)
      setWipe("none")
    }, 520)
  }, [])

  const closePost = useCallback(() => {
    setWipe("writing")
    window.setTimeout(() => {
      setPostSlug(null)
      setWipe("none")
    }, 520)
  }, [])

  const openCaseStudy = useCallback(() => {
    setWipe("nav")
    window.setTimeout(() => {
      setCaseStudyOpen(true)
      setWipe("none")
    }, 480)
  }, [])

  const closeCaseStudy = useCallback(() => {
    setWipe("nav")
    window.setTimeout(() => {
      setCaseStudyOpen(false)
      setWipe("none")
    }, 480)
  }, [])

  const openImage = useCallback((images: GalleryImage[], index: number) => {
    if (images.length === 0) return
    setLightbox({ images, index })
  }, [])

  /* ── keyboard ─────────────────────────────────────────────────────────── */

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = (event.target as HTMLElement | null)?.closest("input,textarea")

      if (event.key === "Escape") {
        if (lightbox) return // the lightbox handles its own Escape
        if (openFile) return setOpenFile(null)
        if (deskOpen) return setDeskOpen(false)
        if (postSlug) return closePost()
        if (caseStudyOpen) return closeCaseStudy()
        if (projectSlug) return setProjectSlug(null)
        if (menuOpen) return setMenuOpen(false)
        if (panel) return setMenuOpen(true)
        return
      }

      if (event.key === " " && !typing && !lightbox) {
        event.preventDefault()
        setMenuOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, openFile, deskOpen, postSlug, caseStudyOpen, projectSlug, menuOpen, panel])


  /* Markdown can link to a panel with a plain `#contact` anchor. Delegated at
   * the document so the shell renders no wrapper element — the stylesheet
   * lays the page out as direct flex children of <body>. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a")
      const href = anchor?.getAttribute("href")
      if (!href?.startsWith("#")) return

      const target = href.slice(1)
      if (target === "home" || PANELS.includes(target as PanelId)) {
        event.preventDefault()
        go(target as PanelId | "home")
      }
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [go])

  return (
    <>
      <main className="hero">
        <span className="cross tl" />
        <div className="wrap hero-inner">
          <div className="fan" id="fan">
            {PANELS.map((id, index) => (
              <div className={`fw f${index + 1}`} key={id}>
                <button className={`fcard c${index + 1} plain`} type="button" onClick={() => go(id)}>
                  <span className="cardname big">{PANEL_LABEL[id]}</span>
                </button>
              </div>
            ))}
          </div>

          <h1 className="giant" id="giant">
            {profile.headline.lead}
            <br />
            {profile.headline.tail}
            <span className="acc">{profile.headline.accent}</span>
          </h1>

          <div className="learn-row">
            <button className="learn" type="button" onClick={() => setMenuOpen(true)}>
              <span className="lstar">
                <StarIcon />
              </span>
              <span className="lword">Learn</span>
            </button>
          </div>
        </div>
      </main>

      <div className="mosaic">
        <div className="mo b">
          <span className="star slow">
            <StarIcon />
          </span>
        </div>
        <div className="mo dots" />
        <div className="mo k">
          <div className="smile">
            <i className="e l" />
            <i className="e r" />
            <i className="m" />
          </div>
        </div>
        <div className="mo checker" />
        <div className="mo bd">
          <div className="arch" />
        </div>
        <div className="mo p">
          <span className="aa">Aa</span>
        </div>
        <div className="mo rings" />
        <div className="mo b">
          <div className="dia" />
        </div>
        <div className="mo p">
          <div className="half" />
        </div>
        <div className="mo stripes" />
        <div className="mo k">
          <span className="star blue">
            <StarIcon />
          </span>
        </div>
        <div className="mo bd">
          <span className="star">
            <AsteriskIcon />
          </span>
        </div>
      </div>

      <div className="wipe" />
      <div className={`pvdim${projectSlug ? " show" : ""}`} />
      <div className={`navwipe${wipe === "nav" ? " go" : ""}`} />
      <div className={`wwipe${wipe === "writing" ? " go" : ""}`}>
        <span className="wstamp">
          <span>Field</span>
          <span>Notes</span>
        </span>
      </div>
      <div className="tpfx" />

      <button className={`orb${panel ? " show" : ""}`} type="button" aria-label="Menu" onClick={() => setMenuOpen(true)}>
        <StarIcon />
      </button>

      <nav className={`menu${menuOpen ? " on" : ""}`} aria-hidden={!menuOpen}>
        <span className="rings" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <button className="mclose" type="button" onClick={() => setMenuOpen(false)}>
          Close
          <CloseIcon />
        </button>
        <div className="menu-body">
          <MenuItem
            index={0}
            label="Home"
            menuOpen={menuOpen}
            onSelect={() => (panel === null ? setMenuOpen(false) : go("home"))}
          />
          {PANELS.map((id, index) => (
            <MenuItem
              key={id}
              index={index + 1}
              label={PANEL_LABEL[id]}
              menuOpen={menuOpen}
              onSelect={() => (panel === id ? setMenuOpen(false) : go(id))}
            />
          ))}
        </div>
        <div className="menu-foot">
          <a href={profile.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </nav>

      <ProjectsPanel
        projects={projects}
        panelRef={scrollRefs.work}
        open={panel === "work"}
        reveal={reveal && panel === "work"}
        pushed={Boolean(projectSlug)}
        onOpenProject={(slug) => {
          track("project_view", { project: slug })
          setProjectSlug(slug)
        }}
        onLearn={() => setMenuOpen(true)}
      />

      <ProjectDetail
        project={project}
        open={Boolean(projectSlug)}
        onClose={() => setProjectSlug(null)}
        onOpenCaseStudy={openCaseStudy}
        onOpenImage={openImage}
      />

      <CaseStudy project={project} open={caseStudyOpen} onClose={closeCaseStudy} onOpenImage={openImage} />

      <WritingPanel
        posts={posts}
        panelRef={scrollRefs.writing}
        open={panel === "writing"}
        reveal={reveal && panel === "writing"}
        onOpenPost={openPost}
      />

      <PostReader
        post={post}
        index={Math.max(0, postIndex)}
        open={Boolean(postSlug)}
        onClose={closePost}
        onOpenImage={openImage}
      />

      <AboutPanel
        panelRef={scrollRefs.about}
        open={panel === "about"}
        reveal={reveal && panel === "about"}
        openFile={openFile}
        deskOpen={deskOpen}
        onOpenFile={(key) => {
          if (key) track(key === "resume" ? "resume_view" : "file_view", { file: key })
          setOpenFile(key)
        }}
        onToggleDesk={(open) => {
          // The desk is the whole resume on one sheet — same intent as the file.
          if (open) track("resume_view", { file: "quick-look" })
          setDeskOpen(open)
        }}
        onContact={() => go("contact")}
      />

      <ContactPanel
        panelRef={scrollRefs.contact}
        open={panel === "contact"}
        reveal={reveal && panel === "contact"}
      />

      <Lightbox
        state={lightbox}
        onClose={() => setLightbox(null)}
        onNavigate={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
      />
    </>
  )
}
