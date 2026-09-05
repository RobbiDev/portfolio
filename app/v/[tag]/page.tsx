import { Suspense } from "react"
import type { Metadata } from "next"

import TagLanding from "./tag-landing"

/**
 * Tagged entry points: /v/linkedin-profile, /v/acme-application, /v/resume-pdf…
 *
 * Vercel Web Analytics reports pageviews per path on every plan, so giving each
 * place a link is shared its own path is the one attribution method that works
 * without a Pro subscription — /v/<tag> shows up in the Pages list with a view
 * count next to it. The page records the tag for the rest of the session and
 * hands the visitor straight to the real site.
 */

export const metadata: Metadata = {
  title: "ROBBYJ · Robert Johnson",
  // These paths exist for attribution, not for search engines.
  robots: { index: false, follow: false },
}

export default function TaggedVisit() {
  // useSearchParams needs a boundary to fall back to if this ever prerenders.
  return (
    <Suspense fallback={null}>
      <TagLanding />
    </Suspense>
  )
}
