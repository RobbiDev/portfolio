"use client"

import { ArrowDownIcon, ArrowLeftIcon, BoltIcon, CloseIcon } from "./icons"
import { profile, type TimelineEntry } from "@/lib/profile"

type FileKey = "profile" | "exp" | "edu" | "skills" | "resume"

const FILES: { key: FileKey; tint: string; name: string; meta: string }[] = [
  { key: "profile", tint: "tg", name: "PROFILE.txt", meta: "2 KB · who he is" },
  { key: "exp", tint: "tb", name: "EXPERIENCE.log", meta: "14 KB · work history" },
  { key: "edu", tint: "ty", name: "EDUCATION.db", meta: "6 KB · schooling" },
  { key: "skills", tint: "tp", name: "SKILLS.sys", meta: "31 KB · capabilities" },
  { key: "resume", tint: "tr", name: "RESUME.pdf", meta: "1 file · printable" },
]

function LogEntry({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="flog">
      <div className="lt">
        {entry.period} · {entry.place}
      </div>
      <div className="lr">{entry.role}</div>
      <div className="ld">{entry.detail}</div>
    </div>
  )
}

function FileWindow({
  id,
  title,
  open,
  onClose,
  children,
}: {
  id: string
  title: string
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`fxwrap${open ? " on" : ""}`} id={`fx-${id}`} aria-hidden={!open}>
      <div className="fxshade" onClick={onClose} />
      <div className="fwin">
        <div className="fwin-bar">
          {title}
          <button className="xbtn" type="button" onClick={onClose}>
            <CloseIcon />
            Close
          </button>
        </div>
        <div className="fwin-body">{children}</div>
      </div>
    </div>
  )
}

interface AboutPanelProps {
  panelRef: React.RefObject<HTMLDivElement>
  open: boolean
  reveal: boolean
  openFile: FileKey | null
  deskOpen: boolean
  onOpenFile: (key: FileKey | null) => void
  onToggleDesk: (open: boolean) => void
  onContact: () => void
}

export default function AboutPanel({
  panelRef,
  open,
  reveal,
  openFile,
  deskOpen,
  onOpenFile,
  onToggleDesk,
  onContact,
}: AboutPanelProps) {
  return (
    <>
      <section className={`panel${open ? " on" : ""}${reveal ? " reveal" : ""}`} id="panel-about" aria-hidden={!open}>
        <div className="panel-scroll" ref={panelRef}>
          <div className="panel-in">
            <div className="fx-head stagger s2">
              <h2 className="fx-title">
                C:\SUBJECT\ROBBY_J&gt;
                <span className="cur" />
              </h2>
              <button className="fql" type="button" onClick={() => onToggleDesk(true)}>
                <BoltIcon />
                Quick Look
              </button>
            </div>
            <p className="fx-hint stagger s2">
              Evidence recovered from the subject&rsquo;s drive. <b>Open any file</b> to review it.
            </p>

            <div className="fdesk stagger s3">
              {FILES.map((file) => (
                <button className="ficon" type="button" key={file.key} onClick={() => onOpenFile(file.key)}>
                  <span className="fdoc">
                    <b />
                    <i className={file.tint} />
                  </span>
                  <span className="fname">{file.name}</span>
                  <span className="fmeta">{file.meta}</span>
                </button>
              ))}
              <button className="ficon" type="button" onClick={onContact}>
                <span className="fdoc">
                  <b />
                  <i className="tg" />
                </span>
                <span className="fname">CONTACT.lnk</span>
                <span className="fmeta">shortcut</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Look: the whole resume on one sheet, plus the ID badge. */}
      <div className={`desk${deskOpen ? " on" : ""}`} aria-hidden={!deskOpen}>
        <button className="dnote" type="button" onClick={() => onToggleDesk(false)}>
          <ArrowLeftIcon />
          Back to files
        </button>
        <div className="dwrap">
          <div className="dpwrap">
            <a className="dtab" href={profile.resumeUrl} target="_blank" rel="noreferrer noopener">
              Take a copy
              <ArrowDownIcon />
            </a>
            <div className="dpaper">
              <div className="dp-name">{profile.name}</div>
              <div className="dp-contact">
                {profile.location} · {profile.email} · github.com/{profile.githubHandle}
              </div>
              <p>{profile.summary}</p>

              <div className="fsec">
                <span className="fdot" />
                Experience
              </div>
              {profile.experience.map((entry) => (
                <LogEntry entry={entry} key={entry.period + entry.place} />
              ))}

              <div className="fsec">
                <span className="fdot" />
                Education
              </div>
              {profile.education.map((entry) => (
                <LogEntry entry={entry} key={entry.period + entry.place} />
              ))}

              <div className="fsec">
                <span className="fdot" />
                Skills
              </div>
              {profile.skills.map((group) => (
                <div key={group.name}>
                  <div className="fgrp">{group.name}</div>
                  {group.items.map((item) => (
                    <span className="ftag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="dside">
            <span className="lany" />
            <div className="idcard">
              <div className="idphoto">
                {profile.photo ? (
                  <div className="rj-slot">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.photo} alt={profile.name} />
                  </div>
                ) : null}
              </div>
              <div className="idname">
                {profile.nickname} Johnson
              </div>
              <div className="idrole">{profile.tagline}</div>
              <div className="idbar" />
            </div>
            <div className="hdd">
              <span className="hled" />
              <div className="hlab">
                <b>SUBJECT_BACKUP · 2TB</b>Evidence drive · mounted · read-only
              </div>
              <span className="hcable" />
            </div>
          </div>
        </div>
      </div>

      <FileWindow id="profile" title="PROFILE.txt · verified" open={openFile === "profile"} onClose={() => onOpenFile(null)}>
        <div className="fkv">
          <span className="k">Name</span>
          <span className="v">
            Robert &ldquo;{profile.nickname}&rdquo; Johnson
          </span>
          <span className="k">Location</span>
          <span className="v">{profile.location}</span>
          <span className="k">Role</span>
          <span className="v">
            {profile.role} · {profile.employer}
          </span>
          <span className="k">Status</span>
          <span className="v">{profile.status}</span>
        </div>
        {profile.bio.map((paragraph, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
        ))}
      </FileWindow>

      <FileWindow
        id="exp"
        title={`EXPERIENCE.log · ${profile.experience.length} entries`}
        open={openFile === "exp"}
        onClose={() => onOpenFile(null)}
      >
        {profile.experience.map((entry) => (
          <LogEntry entry={entry} key={entry.period + entry.place} />
        ))}
      </FileWindow>

      <FileWindow
        id="edu"
        title={`EDUCATION.db · ${profile.education.length} records`}
        open={openFile === "edu"}
        onClose={() => onOpenFile(null)}
      >
        {profile.education.map((entry) => (
          <LogEntry entry={entry} key={entry.period + entry.place} />
        ))}
      </FileWindow>

      <FileWindow
        id="skills"
        title={`SKILLS.sys · ${profile.skills.length} modules`}
        open={openFile === "skills"}
        onClose={() => onOpenFile(null)}
      >
        {profile.skills.map((group) => (
          <div key={group.name}>
            <div className="fgrp">{group.name}</div>
            {group.items.map((item) => (
              <span className="ftag" key={item}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </FileWindow>

      <FileWindow id="resume" title="RESUME.pdf · export" open={openFile === "resume"} onClose={() => onOpenFile(null)}>
        <p>Everything above, condensed to one printable page. The fastest way to review the subject.</p>
        <a className="fdl" href={profile.resumeUrl} target="_blank" rel="noreferrer noopener">
          <ArrowDownIcon />
          Download Resume
        </a>
      </FileWindow>
    </>
  )
}

export type { FileKey }
