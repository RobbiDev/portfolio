export function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-")
}

function parseHexColor(value: unknown): { r: number; g: number; b: number } | null {
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (!match) return null

  const hex = match[1]
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    return { r, g, b }
  }

  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return { r, g, b }
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, value))
}

function toRgba(color: { r: number; g: number; b: number }, alpha: number): string {
  const safeAlpha = Math.max(0, Math.min(1, alpha))
  return `rgba(${clampChannel(color.r)}, ${clampChannel(color.g)}, ${clampChannel(color.b)}, ${safeAlpha})`
}

export function getBlogGradientColors(blogColor?: unknown, coverImageColor?: unknown): {
  top: string
  bottom: string
} | null {
  const base = parseHexColor(blogColor) ?? parseHexColor(coverImageColor)
  if (!base) return null

  return {
    top: toRgba(base, 0.2),
    bottom: toRgba(base, 0.18),
  }
}
