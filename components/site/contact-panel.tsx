"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { profile } from "@/lib/profile"

const STORAGE_KEY = "rj_contact_sends"
const DAILY_LIMIT = 3
const DAY_MS = 86_400_000

interface Quota {
  t: number
  n: number
}

function readQuota(): Quota {
  const now = Date.now()
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null")
    if (raw && typeof raw.n === "number" && typeof raw.t === "number" && now - raw.t <= DAY_MS) return raw
  } catch {
    /* storage unavailable or corrupt — start a fresh window */
  }
  return { t: now, n: 0 }
}

function formatCountdown(ms: number): string {
  const clamped = Math.max(0, ms)
  const hours = Math.floor(clamped / 3_600_000)
  const minutes = Math.floor((clamped % 3_600_000) / 60_000)
  const seconds = Math.floor((clamped % 60_000) / 1000)
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":")
}

interface ContactPanelProps {
  panelRef: React.RefObject<HTMLDivElement>
  open: boolean
  reveal: boolean
}

export default function ContactPanel({ panelRef, open, reveal }: ContactPanelProps) {
  const [quota, setQuota] = useState<Quota>({ t: Date.now(), n: 0 })
  const [countdown, setCountdown] = useState("24:00:00")
  const [shipping, setShipping] = useState(false)
  const [sailing, setSailing] = useState(false)
  const [toast, setToast] = useState<{ text: string; warn: boolean } | null>(null)
  const [stamp, setStamp] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // localStorage is only readable on the client, so seed after mount.
  useEffect(() => setQuota(readQuota()), [])

  const left = Math.max(0, DAILY_LIMIT - quota.n)
  const locked = left === 0

  useEffect(() => {
    if (!locked) return
    const tick = () => {
      const remaining = quota.t + DAY_MS - Date.now()
      if (remaining <= 0) {
        setQuota({ t: Date.now(), n: 0 })
        return
      }
      setCountdown(formatCountdown(remaining))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [locked, quota.t])

  const flash = useCallback((text: string, warn = false) => {
    setToast({ text, warn })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const send = useCallback(async () => {
    if (shipping || locked) return

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      flash("Container is not full. Fill every field before shipping.", true)
      return
    }

    setShipping(true)
    setSailing(true)

    let ok = false
    let error: string | null = null
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const payload = await response.json().catch(() => ({}))
      ok = response.ok
      if (!ok) error = payload?.error || "The dock rejected that shipment. Try again later."
    } catch {
      error = "Could not reach the dock. Check your connection and try again."
    }

    // Let the crane finish its cycle before reporting either way.
    setTimeout(() => {
      setShipping(false)
      setSailing(false)

      if (!ok) {
        flash(error || "Shipment failed.", true)
        return
      }

      const next = { t: quota.n === 0 ? Date.now() : quota.t, n: quota.n + 1 }
      setQuota(next)
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* quota is a nicety, not a gate — ignore storage failures */
      }

      setForm({ name: "", email: "", message: "" })
      setStamp(`RJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)
      setTimeout(() => setStamp(null), 3200)
    }, 2600)
  }, [shipping, locked, form, flash, quota])

  return (
    <section
      className={`panel${open ? " on" : ""}${reveal ? " reveal" : ""}${sailing ? " sailing" : ""}`}
      id="panel-contact"
      aria-hidden={!open}
    >
      <div className="panel-scroll" ref={panelRef}>
        <div className="panel-in">
          <h2 className="port-title stagger s1">Ship me a message</h2>
          <p className="port-sub stagger s2">
            Load a container with your info, and the crane takes it from there. {DAILY_LIMIT} shipments per day.
          </p>

          <div className="vessel2 stagger s3">
            <div className="deckload">
              <div className="bay">
                <div className={`cargo${shipping ? " shipping" : ""}`}>
                  <div className="cargo-head">
                    <span className="stencil">Outbound</span>
                    <span className="cap-lights" title="Shipments left today">
                      {Array.from({ length: DAILY_LIMIT }).map((_, index) => (
                        <i key={index} className={index >= left ? "off" : undefined} />
                      ))}
                    </span>
                  </div>

                  <div className="cfield">
                    <label htmlFor="cf-name">Name</label>
                    <input
                      id="cf-name"
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                    />
                  </div>
                  <div className="cfield">
                    <label htmlFor="cf-email">Email</label>
                    <input
                      id="cf-email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                    />
                  </div>
                  <div className="cfield grow">
                    <label htmlFor="cf-msg">Message</label>
                    <textarea
                      id="cf-msg"
                      rows={4}
                      placeholder="What are we shipping?"
                      value={form.message}
                      onChange={(event) => setForm({ ...form, message: event.target.value })}
                    />
                  </div>

                  <button className="shipbtn" type="button" onClick={send} disabled={locked || shipping}>
                    {shipping ? "Loading…" : "Load & ship →"}
                  </button>

                  <div
                    className={`ptoast${toast ? " show" : ""}`}
                    style={toast?.warn ? { color: "#f2b632" } : undefined}
                  >
                    {toast?.text ?? "Container away!"}
                  </div>

                  <div className="cdoors" aria-hidden="true">
                    <span>Sealed · In transit</span>
                  </div>

                  <div className={`dstamp${stamp ? " show" : ""}`} aria-hidden="true">
                    <span className="dbox">
                      Delivered<small>{stamp ?? ""}</small>
                    </span>
                  </div>

                  <div className={`plock${locked ? " show" : ""}`}>
                    <b>Container sealed</b>
                    <span className="pl-sub">
                      {DAILY_LIMIT} of {DAILY_LIMIT} daily shipments used. You can send again in
                    </span>
                    <span className="timer">{countdown}</span>
                  </div>
                </div>
              </div>

              <div className="shipstack">
                <a className="cbox c-em" href={`mailto:${profile.email}`}>
                  <span className="code">EML-001</span>
                  <span className="ck">Email</span>
                  <span className="cv">{profile.email}</span>
                </a>
                <a className="cbox c-li" href={profile.linkedin} target="_blank" rel="noreferrer noopener">
                  <span className="code">LNK-002</span>
                  <span className="ck">LinkedIn</span>
                  <span className="cv">{profile.linkedinHandle}</span>
                </a>
                <a className="cbox c-gh" href={profile.github} target="_blank" rel="noreferrer noopener">
                  <span className="code">GIT-003</span>
                  <span className="ck">GitHub</span>
                  <span className="cv">{profile.githubHandle}</span>
                </a>
                <div className="cbox c-loc">
                  <span className="ck">Location</span>
                  <span className="cv">Greensboro, NC</span>
                </div>
                <div className="cbox c-srv">
                  <span className="ck">Availability</span>
                  <span className="cv">{profile.availability}</span>
                </div>
              </div>
            </div>

            <div className="hullzone">
              <div className="bridge" aria-hidden="true">
                <i className="mast" />
                <i className="mast m2" />
                <span className="btop" />
                <span className="bwin" />
                <span className="bbase" />
              </div>
              <div className="deckline" />
              <div className="hull2">
                <span className="bowred" />
                <span className="ports">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>

            <div className="sea">
              <span className="wake w1" />
              <span className="wake w2" />
              <span className="wake w3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
