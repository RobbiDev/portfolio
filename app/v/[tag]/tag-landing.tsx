"use client"

import { useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"

import { rememberAttribution, resolveAttribution, track } from "@/lib/analytics"

/** Panels the shell knows how to open, so /v/<tag>?p=about lands on About. */
const PANELS = ["work", "writing", "about", "contact"]

export default function TagLanding() {
  const router = useRouter()
  const params = useParams<{ tag: string }>()
  const search = useSearchParams()

  useEffect(() => {
    const tag = Array.isArray(params?.tag) ? params.tag[0] : params?.tag

    // Re-use the ?ref= path so a tagged URL and a tagged path resolve the same.
    const url = new URL(window.location.href)
    if (tag) url.searchParams.set("ref", tag)
    const attribution = rememberAttribution(resolveAttribution(url.toString(), document.referrer))

    track("visit", {
      referrer: attribution.referrer ?? "none",
      tag: attribution.tag ?? "none",
      landing: attribution.landing,
    })

    const panel = search.get("p")
    const target = panel && PANELS.includes(panel) ? `/#${panel}` : "/"

    // replace(), so Back leaves the site rather than bouncing through here again.
    router.replace(target)
  }, [params, router, search])

  return (
    <main className="tagland">
      <span className="tagland-mark">RJ</span>
      <p>Opening the site…</p>
      <noscript>
        <a href="/">Continue to robbyj.dev</a>
      </noscript>
    </main>
  )
}
