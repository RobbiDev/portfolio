"use client"

import { useEffect } from "react"

import { rememberAttribution, resolveAttribution, track } from "@/lib/analytics"

const VISIT_FLAG = "rj_visit_sent"
/** How long someone has to stay before they count as reading rather than bouncing. */
const ENGAGED_MS = 90_000
/** Query keys we consume on landing and then tidy out of the address bar. */
const TAG_PARAMS = ["ref", "via", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]

/**
 * Records where the visit came from, once per session, and marks the visits
 * that stick around. Renders nothing.
 */
export default function VisitTracker() {
  useEffect(() => {
    const attribution = rememberAttribution(resolveAttribution(window.location.href, document.referrer))

    let sent = false
    try {
      sent = window.sessionStorage.getItem(VISIT_FLAG) === "1"
      window.sessionStorage.setItem(VISIT_FLAG, "1")
    } catch {
      /* no storage: the visit event may repeat, which is survivable */
    }

    if (!sent) {
      track("visit", {
        referrer: attribution.referrer ?? "none",
        tag: attribution.tag ?? "none",
        landing: attribution.landing,
      })
    }

    // Give Vercel's own pageview a moment to read the URL before cleaning the
    // tag out of it, so the tagged landing still shows up in the dashboard.
    const tidy = window.setTimeout(() => {
      const url = new URL(window.location.href)
      if (!TAG_PARAMS.some((key) => url.searchParams.has(key))) return
      TAG_PARAMS.forEach((key) => url.searchParams.delete(key))
      history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
    }, 1200)

    const engaged = window.setTimeout(() => track("engaged", { seconds: ENGAGED_MS / 1000 }), ENGAGED_MS)

    return () => {
      window.clearTimeout(tidy)
      window.clearTimeout(engaged)
    }
  }, [])

  return null
}
