"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { profile } from "@/lib/profile"
import { attributionSummary, track } from "@/lib/analytics"

/**
 * "say hi." — the contact panel. Messages go to /api/contact; the limits below
 * are client-side only, so they stop casual repeat sends rather than a
 * determined spammer (the endpoint is the real gate).
 */
const STORAGE_KEY = "rj_contact_sends"
const MAX_PER_DAY = 3
const COOLDOWN_MS = 60_000
const MAX_CHARS = 2000
const DAY_MS = 86_400_000

const INFO = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, copy: true, color: "#3fc8d8", via: "email" },
  { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, color: "#d3f05e", via: "linkedin" },
  { label: "GitHub", value: profile.githubHandle, href: profile.github, color: "#c64ae2", via: "github" },
  { label: "Location", value: "Greensboro, NC", color: "#f1f1ee" },
  { label: "Availability", value: profile.availability, color: "#ff2d2d" },
]
const TILTS = ["-.6deg", ".5deg", "-.3deg", ".7deg", "-.4deg"]

const GLYPHS = "₿$€¥£¢₩₽₹ƒ₴₦₱₲₵₸Ð₭∆#%&@¶§ΞΦΨ".split("")
const QUOTE = "you are now less valuable than the data you produce"

type Field = "name" | "email" | "message"
type LogLine = { text: string; tone: "ok" | "bad" | "c" }

/* ── rolling 24h send log ─────────────────────────────────────────────── */

let memorySends: number[] = [] // used when storage is blocked

function readSends(): number[] {
  const now = Date.now()
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")
    return Array.isArray(raw) ? raw.filter((t): t is number => typeof t === "number" && now - t < DAY_MS) : []
  } catch {
    return memorySends.filter((t) => now - t < DAY_MS)
  }
}

function recordSend() {
  const sends = [...readSends(), Date.now()]
  memorySends = sends
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sends))
  } catch {
    /* the limit is a nicety, not a gate */
  }
}

function lockState() {
  const sends = readSends()
  const left = Math.max(0, MAX_PER_DAY - sends.length)
  const last = sends.length ? Math.max(...sends) : 0
  return {
    left,
    cooldown: Math.max(0, last + COOLDOWN_MS - Date.now()),
    reopen: left === 0 ? Math.min(...sends) + DAY_MS - Date.now() : 0,
  }
}

function formatTimer(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, "0")).join(":")
}

function validate(form: Record<Field, string>): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {}
  const message = form.message.trim()
  if (form.name.trim().length < 2) errors.name = "required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = "not valid"
  if (message.length < 10) errors.message = "at least 10 chars"
  else if (message.length > MAX_CHARS) errors.message = "too long"
  return errors
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Size a canvas to its box at the device's pixel ratio (capped at 2x). */
function fit(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect()
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.max(1, rect.width * ratio)
  canvas.height = Math.max(1, rect.height * ratio)
  const ctx = canvas.getContext("2d")!
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  return { ctx, w: rect.width, h: rect.height }
}

/* ── background glyph field, with the quote hidden one letter per cell ── */

function useGlyphField(canvasRef: React.RefObject<HTMLCanvasElement>, active: boolean) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return

    let g = fit(canvas)
    let cells: string[] = []
    let cols = 0
    let cw = 20
    const quoteCells = new Map<number, string>()
    const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

    const seed = () => {
      g = fit(canvas)
      cw = g.w < 640 ? 16 : 20
      cols = Math.ceil(g.w / cw)
      const rows = Math.ceil(g.h / (cw * 1.25))
      cells = Array.from({ length: cols * rows }, pick)

      const maxLen = Math.max(10, cols - 4)
      const lines: string[] = []
      let line = ""
      for (const word of QUOTE.split(" ")) {
        if ((line + " " + word).trim().length > maxLen) {
          lines.push(line)
          line = word
        } else line = (line + " " + word).trim()
      }
      lines.push(line)

      // Parked near the bottom so the cards don't cover it.
      quoteCells.clear()
      const startRow = Math.max(2, rows - lines.length - 3)
      lines.forEach((text, r) => {
        const startCol = Math.floor((cols - text.length) / 2)
        Array.from(text).forEach((ch, c) => quoteCells.set((startRow + r) * cols + startCol + c, ch))
      })
    }

    const draw = () => {
      const { ctx, w, h } = g
      ctx.fillStyle = "#c64ae2"
      ctx.fillRect(0, 0, w, h)
      ctx.textBaseline = "top"
      ctx.font = `700 ${cw * 0.8}px "JetBrains Mono", monospace`
      for (let i = 0; i < cells.length; i++) {
        const x = (i % cols) * cw
        const y = Math.floor(i / cols) * cw * 1.25
        const quoted = quoteCells.get(i)
        if (quoted !== undefined) {
          if (quoted === " ") continue
          ctx.fillStyle = "rgba(3,4,5,.85)"
          ctx.fillText(quoted, x, y)
        } else {
          ctx.fillStyle = "rgba(3,4,5,.26)"
          ctx.fillText(cells[i], x, y)
        }
      }
    }

    seed()
    draw()

    const interval = prefersReducedMotion()
      ? undefined
      : window.setInterval(() => {
          for (let k = 0; k < cells.length * 0.02; k++) cells[Math.floor(Math.random() * cells.length)] = pick()
          draw()
        }, 70)

    let resizeTimer: number | undefined
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        seed()
        draw()
      }, 150)
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(resizeTimer)
      window.removeEventListener("resize", onResize)
    }
  }, [canvasRef, active])
}

/* ── the block burst off the send button ─────────────────────────────── */

function burst(canvas: HTMLCanvasElement, from: DOMRect) {
  if (prefersReducedMotion()) return
  const { ctx, w, h } = fit(canvas)
  const origin = canvas.getBoundingClientRect()
  const parts = Array.from({ length: 70 }, () => ({
    x: from.left - origin.left + Math.random() * from.width,
    y: from.top - origin.top + Math.random() * from.height,
    vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 12 - 2,
    s: 6 + Math.random() * 12,
    tri: Math.random() < 0.2,
    c: Math.random() < 0.15 ? "#d3f05e" : "#f1f1ee",
  }))
  const start = performance.now()

  const frame = (now: number) => {
    const elapsed = (now - start) / 1000
    ctx.clearRect(0, 0, w, h)
    if (elapsed > 1.1) return
    for (const p of parts) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.45
      const s = p.s * (1 - elapsed / 1.1)
      ctx.fillStyle = p.c
      if (p.tri) {
        ctx.beginPath()
        ctx.moveTo(p.x, p.y + s)
        ctx.lineTo(p.x + s, p.y + s)
        ctx.lineTo(p.x + s, p.y)
        ctx.fill()
      } else ctx.fillRect(p.x, p.y, s, s)
    }
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

function InfoRow({ item, index }: { item: (typeof INFO)[number]; index: number }) {
  const [copyLabel, setCopyLabel] = useState("copy")

  const copy = () => {
    navigator.clipboard
      .writeText(item.value)
      .then(() => setCopyLabel("copied"))
      .catch(() => setCopyLabel("ctrl+c"))
    window.setTimeout(() => setCopyLabel("copy"), 1600)
  }

  return (
    <div className="say-item" style={{ "--tilt": TILTS[index % TILTS.length] } as React.CSSProperties}>
      <span className="say-code" style={{ "--k": item.color } as React.CSSProperties}>
        {item.label}
      </span>
      <div className="say-what">
        {item.href ? (
          <a
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noreferrer noopener"
            onClick={() => track("contact_link", { via: item.via ?? "link" })}
          >
            {item.value}
          </a>
        ) : (
          <span>{item.value}</span>
        )}
      </div>
      {item.copy ? (
        <button className="say-copy" type="button" onClick={copy}>
          {copyLabel}
        </button>
      ) : (
        <span />
      )}
    </div>
  )
}

/** Robby's local time, ticking while the panel is open. Rendered only after
 * mount, since the server's clock and timezone aren't the visitor's. */
function useLocalTime(active: boolean): string | null {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    if (!active) return
    const format = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    })
    const tick = () => setTime(format.format(new Date()))
    tick()
    const interval = window.setInterval(tick, 15_000)
    return () => window.clearInterval(interval)
  }, [active])

  return time
}

function StatusCard({ active }: { active: boolean }) {
  const time = useLocalTime(active)
  const [now] = profile.experience
  const [school] = profile.education

  return (
    <div className="say-status">
      <p className="say-open">
        <i className="say-dot" />
        {profile.status}
      </p>
      <dl>
        <div>
          <dt>now</dt>
          <dd>
            {now.role} · {now.place.split(" · ")[0]}
          </dd>
        </div>
        <div>
          <dt>studying</dt>
          <dd>
            {school.role} · {school.place}
          </dd>
        </div>
        <div>
          <dt>local time</dt>
          <dd>{time ?? "—"} · Greensboro</dd>
        </div>
      </dl>
      <a
        className="say-resume"
        href={profile.resumeUrl}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => track("resume_view", { file: "contact" })}
      >
        résumé <span aria-hidden="true">↗</span>
      </a>
    </div>
  )
}

interface ContactPanelProps {
  panelRef: React.RefObject<HTMLDivElement>
  open: boolean
  reveal: boolean
}

export default function ContactPanel({ panelRef, open, reveal }: ContactPanelProps) {
  const [form, setForm] = useState<Record<Field, string>>({ name: "", email: "", message: "" })
  const [honeypot, setHoneypot] = useState("")
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [lock, setLock] = useState({ left: MAX_PER_DAY, cooldown: 0, reopen: 0 })
  const [sending, setSending] = useState(false)
  const [log, setLog] = useState<LogLine[]>([])
  const [shake, setShake] = useState(0)
  const [glitch, setGlitch] = useState(0)

  const glyphRef = useRef<HTMLCanvasElement>(null)
  const wipeRef = useRef<HTMLCanvasElement>(null)
  const sendRef = useRef<HTMLButtonElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fieldRefs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  }

  useGlyphField(glyphRef, open)

  const locked = lock.left === 0

  // A locked form is inert under the overlay. React 18 has no `inert` prop.
  useEffect(() => {
    if (formRef.current) formRef.current.inert = locked
  }, [locked])

  // localStorage is only readable on the client, so the lock is read after
  // mount and then kept current once a second while the panel is open.
  useEffect(() => {
    if (!open) return
    const refresh = () => setLock(lockState())
    refresh()
    const interval = window.setInterval(refresh, 1000)
    return () => window.clearInterval(interval)
  }, [open])

  // The heading glitches when the panel opens and when the form locks.
  useEffect(() => {
    if (open) setGlitch((n) => n + 1)
  }, [open, locked])

  const update = (field: Field) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [field]: event.target.value }))

  const recheck = (field: Field) => () => {
    if (form[field]) setErrors(validate(form))
  }

  const submit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      if (sending) return

      const state = lockState()
      setLock(state)
      if (state.left === 0 || state.cooldown > 0) return

      const found = validate(form)
      setErrors(found)
      const first = (Object.keys(found) as Field[])[0]
      if (first) {
        fieldRefs[first].current?.focus()
        setShake((n) => n + 1)
        return
      }

      setSending(true)
      setLog([])
      if (wipeRef.current && sendRef.current) burst(wipeRef.current, sendRef.current.getBoundingClientRect())

      // Bots fill the hidden field: pretend it worked and drop it.
      if (honeypot) {
        setLog([{ text: "sent.", tone: "ok" }])
        setSending(false)
        return
      }

      let ok = false
      let why = ""
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // The email carries where the sender came from, so a message from a
          // recruiter arrives with its referrer already attached.
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim(),
            attribution: attributionSummary(),
          }),
        })
        ok = response.ok
        if (!ok) {
          const payload = await response.json().catch(() => ({}))
          why = payload?.error || `server said ${response.status}`
        }
      } catch {
        why = "no connection, check your internet and try again"
      }

      if (ok) {
        track("contact_send")
        recordSend()
        setForm({ name: "", email: "", message: "" })
        setLog([{ text: "sent. i'll get back to you soon.", tone: "ok" }])
      } else {
        const reason = why.replace(/\.$/, "")
        setLog([
          { text: `didn't send: ${reason.charAt(0).toLowerCase()}${reason.slice(1)}. try again or email me directly.`, tone: "bad" },
        ])
        setShake((n) => n + 1)
      }
      setSending(false)
      setLock(lockState())
    },
    // fieldRefs holds stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sending, form, honeypot],
  )

  const count = form.message.length
  const buttonLabel = sending
    ? "sending..."
    : lock.cooldown > 0 && !locked
      ? `wait ${Math.ceil(lock.cooldown / 1000)}s`
      : "send"

  return (
    <section className={`panel${open ? " on" : ""}${reveal ? " reveal" : ""}`} id="panel-contact" aria-hidden={!open}>
      <canvas className="say-glyphs" ref={glyphRef} aria-hidden="true" />
      <canvas className="say-wipe" ref={wipeRef} aria-hidden="true" />

      <div className="panel-scroll" ref={panelRef}>
        <div className="panel-in say-grid">
          <section
            className={`say-card stagger s1${shake % 2 ? " shake-a" : shake ? " shake-b" : ""}`}
            aria-labelledby="say-title"
          >
            <h2 id="say-title" className="say-title">
              <span className={`say-glitch${glitch % 2 ? " hit-a" : glitch ? " hit-b" : ""}`} data-text="say hi.">
                say hi.
              </span>
            </h2>

            <form ref={formRef} onSubmit={submit} noValidate>
              <div className="say-row2">
                <div className={`say-field${errors.name ? " bad" : ""}`}>
                  <label htmlFor="say-name">
                    name <span className="say-err">{errors.name}</span>
                  </label>
                  <input
                    id="say-name"
                    ref={fieldRefs.name}
                    autoComplete="name"
                    placeholder="your name"
                    maxLength={80}
                    value={form.name}
                    onChange={update("name")}
                    onBlur={recheck("name")}
                  />
                </div>
                <div className={`say-field${errors.email ? " bad" : ""}`}>
                  <label htmlFor="say-email">
                    email <span className="say-err">{errors.email}</span>
                  </label>
                  <input
                    id="say-email"
                    ref={fieldRefs.email}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    maxLength={120}
                    value={form.email}
                    onChange={update("email")}
                    onBlur={recheck("email")}
                  />
                </div>
              </div>

              <div className={`say-field grow${errors.message ? " bad" : ""}`}>
                <label htmlFor="say-message">
                  message
                  <span>
                    <span className="say-err">{errors.message}</span>{" "}
                    <span className={`say-count${count > MAX_CHARS ? " over" : ""}`}>
                      {count} / {MAX_CHARS}
                    </span>
                  </span>
                </label>
                <textarea
                  id="say-message"
                  ref={fieldRefs.message}
                  placeholder="what's up?"
                  value={form.message}
                  onChange={update("message")}
                  onBlur={recheck("message")}
                />
              </div>

              <div className="say-slots" aria-live="polite">
                <span>
                  submissions left today: <b>{lock.left}</b>
                </span>
                <span className="say-pips">
                  {Array.from({ length: MAX_PER_DAY }, (_, index) => (
                    <span key={index} className={`say-pip${index < lock.left ? "" : " used"}`} />
                  ))}
                </span>
              </div>

              {/* Honeypot: real people never see or fill this. */}
              <div className="say-hp" aria-hidden="true">
                <label htmlFor="say-company">company</label>
                <input
                  id="say-company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              <div className="say-send">
                <button
                  className="say-go"
                  ref={sendRef}
                  type="submit"
                  disabled={sending || locked || lock.cooldown > 0}
                >
                  {buttonLabel}
                </button>
              </div>
            </form>

            <pre className="say-log" aria-live="polite">
              {log.map((line, index) => (
                <span key={index} className={line.tone}>
                  {line.text}
                  {"\n"}
                </span>
              ))}
            </pre>

            {locked ? (
              <div className="say-locked">
                <span className="say-tag">locked</span>
                <h3>
                  daily limit
                  <br />
                  reached.
                </h3>
                <p>you can send again when the timer runs out, or email me directly.</p>
                <div className="say-timer">
                  {formatTimer(lock.reopen)}
                  <small>until you can send again</small>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="say-info stagger s2" aria-label="Contact info">
            {INFO.map((item, index) => (
              <InfoRow key={item.label} item={item} index={index} />
            ))}
            <StatusCard active={open} />
          </aside>
        </div>
      </div>
    </section>
  )
}
