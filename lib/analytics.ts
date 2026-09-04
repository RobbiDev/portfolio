"use client"

import { track as vercelTrack } from "@vercel/analytics"

/**
 * Visit attribution: where a visitor came from, and how interesting that is.
 *
 * Vercel Web Analytics answers "how many" on its own. This answers "who sent
 * them" — which for a portfolio is the only number that matters. Attribution is
 * worked out once on the first page of a session, parked in sessionStorage, and
 * then stapled onto every event and onto contact-form submissions so a message
 * arrives with the referrer already attached.
 *
 * Nothing here is personal data: hostnames, campaign tags and click counts, no
 * cookies, no IDs, nothing that survives the tab closing.
 */

const STORAGE_KEY = "rj_attribution"

/** How the visit reached the site, coarsest-first. */
export type Channel =
  | "tagged" /* a link tagged by hand — ?ref= or /v/<tag> */
  | "job-board" /* LinkedIn Jobs, Indeed, an ATS… someone hiring */
  | "social"
  | "search"
  | "ai" /* an assistant handed over the link */
  | "email"
  | "referral"
  | "direct"

export interface Attribution {
  /** Best guess at the origin: a tag, a referrer host, or "direct". */
  source: string
  channel: Channel
  /** Value of ?ref= / ?via= or the /v/<tag> segment, when the link was tagged. */
  tag: string | null
  /** utm_campaign / utm_medium, for links tagged the conventional way. */
  campaign: string | null
  medium: string | null
  /** Referring hostname only — never the full URL. */
  referrer: string | null
  /** First path of the session, so tagged landings are visible. */
  landing: string
  /** True when the origin reads as hiring-related. */
  recruiter: boolean
  at: number
}

/* ── referrer classification ────────────────────────────────────────────── */

/**
 * Hosts worth naming. Matched against the referrer hostname by suffix, so
 * "www.linkedin.com" and "de.indeed.com" both land on their entry.
 */
const HOSTS: { match: string[]; source: string; channel: Channel }[] = [
  // Job boards and applicant tracking systems — the recruiter tells.
  { match: ["linkedin.com", "lnkd.in"], source: "linkedin", channel: "job-board" },
  { match: ["indeed.com"], source: "indeed", channel: "job-board" },
  { match: ["glassdoor.com"], source: "glassdoor", channel: "job-board" },
  { match: ["ziprecruiter.com"], source: "ziprecruiter", channel: "job-board" },
  { match: ["dice.com"], source: "dice", channel: "job-board" },
  { match: ["monster.com"], source: "monster", channel: "job-board" },
  { match: ["careerbuilder.com"], source: "careerbuilder", channel: "job-board" },
  { match: ["simplyhired.com"], source: "simplyhired", channel: "job-board" },
  { match: ["wellfound.com", "angel.co"], source: "wellfound", channel: "job-board" },
  { match: ["builtin.com"], source: "builtin", channel: "job-board" },
  { match: ["joinhandshake.com"], source: "handshake", channel: "job-board" },
  { match: ["otta.com", "welcometothejungle.com"], source: "otta", channel: "job-board" },
  { match: ["greenhouse.io"], source: "greenhouse", channel: "job-board" },
  { match: ["lever.co"], source: "lever", channel: "job-board" },
  { match: ["ashbyhq.com"], source: "ashby", channel: "job-board" },
  { match: ["myworkdayjobs.com", "workday.com"], source: "workday", channel: "job-board" },
  { match: ["smartrecruiters.com"], source: "smartrecruiters", channel: "job-board" },
  { match: ["jobvite.com"], source: "jobvite", channel: "job-board" },
  { match: ["icims.com"], source: "icims", channel: "job-board" },
  { match: ["teamtailor.com"], source: "teamtailor", channel: "job-board" },
  { match: ["recruitee.com"], source: "recruitee", channel: "job-board" },
  { match: ["taleo.net", "oraclecloud.com"], source: "taleo", channel: "job-board" },

  // Social and community
  { match: ["github.com", "github.io"], source: "github", channel: "social" },
  { match: ["x.com", "twitter.com", "t.co"], source: "x", channel: "social" },
  { match: ["news.ycombinator.com"], source: "hackernews", channel: "social" },
  { match: ["reddit.com"], source: "reddit", channel: "social" },
  { match: ["facebook.com", "fb.me"], source: "facebook", channel: "social" },
  { match: ["instagram.com"], source: "instagram", channel: "social" },
  { match: ["youtube.com", "youtu.be"], source: "youtube", channel: "social" },
  { match: ["bsky.app"], source: "bluesky", channel: "social" },
  { match: ["mastodon.social", "fosstodon.org"], source: "mastodon", channel: "social" },
  { match: ["discord.com", "discordapp.com"], source: "discord", channel: "social" },
  { match: ["slack.com"], source: "slack", channel: "social" },
  { match: ["teams.microsoft.com"], source: "teams", channel: "social" },
  { match: ["devpost.com"], source: "devpost", channel: "social" },

  // Search
  { match: ["google.com"], source: "google", channel: "search" },
  { match: ["bing.com"], source: "bing", channel: "search" },
  { match: ["duckduckgo.com"], source: "duckduckgo", channel: "search" },
  { match: ["search.yahoo.com"], source: "yahoo", channel: "search" },
  { match: ["ecosia.org"], source: "ecosia", channel: "search" },
  { match: ["search.brave.com"], source: "brave", channel: "search" },

  // Assistants
  { match: ["chatgpt.com", "openai.com"], source: "chatgpt", channel: "ai" },
  { match: ["claude.ai"], source: "claude", channel: "ai" },
  { match: ["perplexity.ai"], source: "perplexity", channel: "ai" },
  { match: ["gemini.google.com"], source: "gemini", channel: "ai" },
  { match: ["copilot.microsoft.com"], source: "copilot", channel: "ai" },

  // Mail clients that leak a referrer
  { match: ["mail.google.com"], source: "gmail", channel: "email" },
  { match: ["outlook.live.com", "outlook.office.com", "outlook.com"], source: "outlook", channel: "email" },
  { match: ["mail.yahoo.com"], source: "yahoo-mail", channel: "email" },
  { match: ["mail.proton.me"], source: "proton-mail", channel: "email" },
]

/**
 * Search engines run on dozens of country domains (google.de, google.co.uk…),
 * so they get a pattern rather than an entry per TLD.
 */
const HOST_PATTERNS: { pattern: RegExp; source: string; channel: Channel }[] = [
  { pattern: /(^|\.)google\.[a-z.]+$/, source: "google", channel: "search" },
  { pattern: /(^|\.)yandex\.[a-z.]+$/, source: "yandex", channel: "search" },
  { pattern: /(^|\.)indeed\.[a-z.]+$/, source: "indeed", channel: "job-board" },
]

/** Tag or campaign words that mean "this link went out with an application". */
const RECRUITER_WORDS = ["recruit", "hiring", "hire", "job", "apply", "application", "resume", "cv", "career"]

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase()
  } catch {
    return null
  }
}

/**
 * Match a hostname against the tables above. Domains match themselves and
 * their subdomains and nothing else — a plain substring test would file
 * clever.com under Lever.
 */
export function classifyHost(host: string | null): { source: string; channel: Channel } {
  if (!host) return { source: "direct", channel: "direct" }

  for (const entry of HOSTS) {
    if (entry.match.some((domain) => host === domain || host.endsWith(`.${domain}`))) {
      return { source: entry.source, channel: entry.channel }
    }
  }
  for (const entry of HOST_PATTERNS) {
    if (entry.pattern.test(host)) return { source: entry.source, channel: entry.channel }
  }
  return { source: host, channel: "referral" }
}

function looksLikeHiring(...values: (string | null)[]): boolean {
  return values.some((value) => {
    if (!value) return false
    const lowered = value.toLowerCase()
    return RECRUITER_WORDS.some((word) => lowered.includes(word))
  })
}

/** Tags travel in URLs, so keep them short and boring before storing them. */
function cleanTag(value: string | null): string | null {
  if (!value) return null
  const cleaned = value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-{2,}/g, "-").slice(0, 48)
  return cleaned || null
}

/**
 * Work out where this visit came from. Query tags win over the referrer,
 * because a tag is something we chose and a referrer is something we were
 * given — `?ref=linkedin-dm` is the truth even if the click came via a
 * redirector that rewrote the referrer.
 */
export function resolveAttribution(url: string, referrer: string): Attribution {
  const parsed = new URL(url)
  const params = parsed.searchParams

  const tag = cleanTag(params.get("ref") ?? params.get("via") ?? params.get("utm_source"))
  const campaign = cleanTag(params.get("utm_campaign"))
  const medium = cleanTag(params.get("utm_medium"))

  // Ignore self-referrals: a click between panels is not a new source.
  const referrerHost = hostOf(referrer)
  const host = referrerHost && referrerHost !== hostOf(url) ? referrerHost : null
  const fromHost = classifyHost(host)

  const source = tag ?? fromHost.source
  const channel: Channel = tag ? "tagged" : fromHost.channel

  return {
    source,
    channel,
    tag,
    campaign,
    medium,
    referrer: host,
    landing: parsed.pathname,
    recruiter: fromHost.channel === "job-board" || looksLikeHiring(tag, campaign, medium),
    at: Date.now(),
  }
}

/* ── session storage ────────────────────────────────────────────────────── */

/**
 * First touch wins for the rest of the session: if a recruiter arrives from
 * LinkedIn and then wanders through three projects, every one of those events
 * should still say "linkedin", not "direct".
 */
export function rememberAttribution(next: Attribution): Attribution {
  const existing = readAttribution()

  // A tagged landing always overwrites — it is a stronger signal than whatever
  // the session started with, and it is deliberate.
  if (existing && !next.tag) return existing

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* private mode or storage disabled — attribution is a nicety, not a gate */
  }
  return next
}

export function readAttribution(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return typeof parsed?.source === "string" ? (parsed as Attribution) : null
  } catch {
    return null
  }
}

/* ── events ─────────────────────────────────────────────────────────────── */

/**
 * The things worth knowing a visitor did. Named up front so the dashboard has
 * a small, stable vocabulary instead of whatever each call site felt like.
 */
export type AnalyticsEvent =
  | "visit" /* first page of a session, carries the attribution */
  | "panel_view" /* opened Projects / Writing / About / Contact */
  | "project_view"
  | "post_view"
  | "file_view" /* opened one of the About panel's evidence files */
  | "resume_view" /* opened the resume file or the quick-look sheet */
  | "resume_download" /* clicked through to the PDF — the strongest signal */
  | "contact_link" /* clicked the email / LinkedIn / GitHub cards */
  | "contact_send" /* actually submitted the form */
  | "engaged" /* still here after a couple of minutes */

type Props = Record<string, string | number | boolean | null>

/**
 * Send an event with the session's attribution attached.
 *
 * Custom events are a Pro-plan feature of Vercel Web Analytics; on Hobby this
 * is a no-op and the tagged-link paths under /v/<tag> carry the story instead.
 * Either way it must never throw — analytics does not get to break the site.
 */
export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === "undefined") return
  const attribution = readAttribution()
  try {
    vercelTrack(event, {
      ...props,
      source: attribution?.source ?? "unknown",
      channel: attribution?.channel ?? "unknown",
      recruiter: attribution?.recruiter ?? false,
      ...(attribution?.campaign ? { campaign: attribution.campaign } : {}),
    })
  } catch {
    /* analytics disabled, blocked, or over quota — carry on */
  }
}

/** Flat, human-readable attribution for the contact email. */
export function attributionSummary(): Record<string, string> {
  const attribution = readAttribution()
  if (!attribution) return {}
  return {
    source: attribution.source,
    channel: attribution.channel,
    referrer: attribution.referrer ?? "none",
    landing: attribution.landing,
    ...(attribution.tag ? { tag: attribution.tag } : {}),
    ...(attribution.campaign ? { campaign: attribution.campaign } : {}),
    ...(attribution.medium ? { medium: attribution.medium } : {}),
    ...(attribution.recruiter ? { recruiter: "likely" } : {}),
  }
}
