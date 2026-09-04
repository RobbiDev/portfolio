import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

/**
 * Contact form endpoint. Sends the message on and confirms back to the sender.
 * Set RECEIVING=false to close the form without taking the site down.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Visit attribution the client collected (source, referrer, tagged link…).
 * Only these keys are read and each is truncated, because it arrives from the
 * browser and ends up in the body of an email.
 */
const ATTRIBUTION_KEYS = ["source", "channel", "referrer", "landing", "tag", "campaign", "medium", "recruiter"]

function formatAttribution(value: unknown): string {
  if (!value || typeof value !== "object") return ""
  const record = value as Record<string, unknown>
  const lines = ATTRIBUTION_KEYS.flatMap((key) => {
    const entry = record[key]
    if (typeof entry !== "string" || !entry.trim()) return []
    return [`${key}: ${entry.replace(/\s+/g, " ").trim().slice(0, 120)}`]
  })
  return lines.length ? `\n\n--- where they came from ---\n${lines.join("\n")}` : ""
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string; attribution?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 })
  }

  const name = body.name?.trim() ?? ""
  const email = body.email?.trim() ?? ""
  const message = body.message?.trim() ?? ""

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Every field is required." }, { status: 400 })
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 })
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "That message is too long to ship." }, { status: 400 })
  }

  if (process.env.RECEIVING === "false") {
    return NextResponse.json(
      { error: "The form is not accepting submissions right now. Please try again later." },
      { status: 503 },
    )
  }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_PASS
  const to = process.env.MY_EMAIL

  if (!user || !pass || !to) {
    console.error("Contact form is not configured: GMAIL_USER, GMAIL_PASS and MY_EMAIL are all required.")
    return NextResponse.json({ error: "The dock is closed for maintenance. Try email instead." }, { status: 503 })
  }

  const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } })

  try {
    await transporter.sendMail({
      from: user,
      replyTo: email,
      to,
      subject: `Contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}${formatAttribution(body.attribution)}`,
    })

    await transporter.sendMail({
      from: user,
      to: email,
      subject: "Confirmation: I've received your message",
      text: `Hi ${name},\n\nThank you for reaching out and connecting with me! I appreciate you taking the time to get in touch.\n\nI will review your message and get back to you as soon as possible. If you have any urgent matters, please feel free to reach out to me directly on LinkedIn.\n\nBest regards,\n\nRobert (Robby) Johnson`,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to send contact email:", error)
    return NextResponse.json({ error: "The shipment didn't make it out. Please try again." }, { status: 502 })
  }
}
