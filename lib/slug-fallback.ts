const SUFFIXES = [
  "-website",
  "-web",
  "-site",
  "-app",
  "-project",
  "-blog",
  "-post",
  "-portfolio",
  "-case-study",
]

export function normalizeSlugBase(rawSlug: string): string {
  let slug = rawSlug.toLowerCase().trim().replace(/\/+$/, "")

  for (const suffix of SUFFIXES) {
    if (slug.endsWith(suffix)) {
      slug = slug.slice(0, -suffix.length)
      break
    }
  }

  slug = slug.replace(/-+$/, "")
  return slug || rawSlug.toLowerCase().trim()
}

export function findBestSlugMatch(targetSlug: string, candidates: string[]): string | null {
  if (candidates.includes(targetSlug)) {
    return targetSlug
  }

  const targetBase = normalizeSlugBase(targetSlug)
  let bestMatch: string | null = null
  let bestScore = Number.POSITIVE_INFINITY

  for (const candidate of candidates) {
    const candidateBase = normalizeSlugBase(candidate)
    if (candidateBase !== targetBase) continue

    const score = Math.abs(candidate.length - targetSlug.length)
    if (score < bestScore) {
      bestScore = score
      bestMatch = candidate
    }
  }

  return bestMatch
}
