import type { GalleryImage } from "./types"

/**
 * Markdown on this site is "rich": alongside ordinary prose it understands a
 * small set of directives that expand into the design's own components.
 *
 *   :::note Field note          fenced callout (note | tip | warn | danger)
 *   body markdown
 *   :::
 *
 *   ::youtube[https://youtu.be/ID]{caption="Walkthrough"}
 *   ::video[/media/demo.mp4]{poster="/media/demo.jpg"}
 *   ::embed[https://example.com]{title="Live demo" ratio="4/3"}
 *   ::figure[/images/shot.png]{caption="..." alt="..."}
 *   ::gallery                   the item's own gallery, as a lightbox strip
 *
 *   :::problem The Problem & The Approach
 *   the problem, in its own column
 *   ---                          the column break
 *   the approach, in the second column
 *   :::
 *
 * A bare URL alone on a line is auto-embedded when the host is recognised, so
 * pasting a YouTube link just works.
 */

export type Block =
  | { type: "markdown"; value: string }
  | { type: "callout"; variant: CalloutVariant; title?: string; value: string }
  | { type: "embed"; provider: string; src: string; title?: string; caption?: string; ratio?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "figure"; src: string; alt?: string; caption?: string }
  | { type: "gallery"; images: GalleryImage[] }
  | { type: "split"; title?: string; left: string; right: string }

export type CalloutVariant = "note" | "tip" | "warn" | "danger"

const CALLOUT_VARIANTS: CalloutVariant[] = ["note", "tip", "warn", "danger"]
const CALLOUT_ALIASES: Record<string, CalloutVariant> = {
  info: "note",
  warning: "warn",
  caution: "warn",
  error: "danger",
}

/** `key="value"` / `key=value` pairs from a directive's `{...}` attribute block. */
function parseAttributes(raw: string | undefined): Record<string, string> {
  if (!raw) return {}

  const attributes: Record<string, string> = {}
  const pattern = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(raw)) !== null) {
    attributes[match[1]] = match[2] ?? match[3] ?? match[4] ?? ""
  }
  return attributes
}

/** Recognise the embeddable services and normalise them to an iframe URL. */
export function resolveEmbed(rawUrl: string): { provider: string; src: string } | null {
  const url = rawUrl.trim()

  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/i,
  )
  if (youtube) return { provider: "youtube", src: `https://www.youtube-nocookie.com/embed/${youtube[1]}` }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i)
  if (vimeo) return { provider: "vimeo", src: `https://player.vimeo.com/video/${vimeo[1]}` }

  const loom = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/i)
  if (loom) return { provider: "loom", src: `https://www.loom.com/embed/${loom[1]}` }

  const codepen = url.match(/codepen\.io\/([\w-]+)\/(?:pen|full)\/([\w-]+)/i)
  if (codepen) return { provider: "codepen", src: `https://codepen.io/${codepen[1]}/embed/${codepen[2]}` }

  const codesandbox = url.match(/codesandbox\.io\/(?:s|embed)\/([\w-]+)/i)
  if (codesandbox) return { provider: "codesandbox", src: `https://codesandbox.io/embed/${codesandbox[1]}` }

  const figma = url.match(/figma\.com\/(?:file|design|proto)\//i)
  if (figma) return { provider: "figma", src: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}` }

  const spotify = url.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([\w-]+)/i)
  if (spotify) return { provider: "spotify", src: `https://open.spotify.com/embed/${spotify[1]}/${spotify[2]}` }

  const gist = url.match(/gist\.github\.com\/[\w-]+\/([0-9a-f]+)/i)
  if (gist) return { provider: "gist", src: url }

  return null
}

function isVideoFile(src: string): boolean {
  return /\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(src)
}

function isImageFile(src: string): boolean {
  return /\.(png|jpe?g|gif|webp|avif|svg)(\?|#|$)/i.test(src)
}

/** A line that is nothing but a URL — the auto-embed hook. */
function bareUrl(line: string): string | null {
  const trimmed = line.trim()
  return /^https?:\/\/\S+$/.test(trimmed) ? trimmed : null
}

const LEAF_DIRECTIVE = /^::([a-z][\w-]*)(?:\[([^\]]*)\])?(?:\{(.*)\})?\s*$/i
const CALLOUT_OPEN = /^:::\s*([a-z][\w-]*)\s*(?:\[([^\]]*)\]|(.*))?$/i

/**
 * The two-column block. `problem` is the case study's own "problem, then
 * approach" spread; `split` / `columns` are the same thing under a neutral
 * name. A line of three or more dashes inside the block is the column break.
 */
const SPLIT_OPEN = /^:::\s*(problem|split|columns)\b\s*(?:\[([^\]]*)\]|([^\[{]*))?\s*$/i
const NESTED_OPEN = /^:::\s*[a-z]/i
const COLUMN_BREAK = /^\s*-{3,}\s*$/
const DEFAULT_SPLIT_TITLE = "The Problem & The Approach"

/**
 * Split a markdown body into renderable blocks. Anything that isn't a
 * directive is passed through untouched so ordinary markdown keeps working.
 */
export function parseRichMarkdown(source: string, gallery: GalleryImage[] = []): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n")
  const blocks: Block[] = []
  let buffer: string[] = []
  let inFence = false
  let fenceMarker = ""

  const flush = () => {
    const value = buffer.join("\n").trim()
    if (value) blocks.push({ type: "markdown", value })
    buffer = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Never interpret directives inside a fenced code block.
    const fence = line.match(/^(\s*)(`{3,}|~{3,})/)
    if (fence) {
      if (!inFence) {
        inFence = true
        fenceMarker = fence[2][0]
      } else if (fence[2][0] === fenceMarker) {
        inFence = false
      }
      buffer.push(line)
      continue
    }
    if (inFence) {
      buffer.push(line)
      continue
    }

    const split = line.match(SPLIT_OPEN)
    if (split) {
      flush()
      const read = readSplit(lines, split, i)
      blocks.push(read.block)
      i = read.end
      continue
    }

    const callout = line.match(CALLOUT_OPEN)
    if (callout) {
      const key = callout[1].toLowerCase()
      const variant = CALLOUT_VARIANTS.includes(key as CalloutVariant)
        ? (key as CalloutVariant)
        : CALLOUT_ALIASES[key]

      if (variant) {
        flush()
        const title = (callout[2] ?? callout[3] ?? "").trim() || undefined
        const body: string[] = []
        i++
        while (i < lines.length && lines[i].trim() !== ":::") {
          body.push(lines[i])
          i++
        }
        blocks.push({ type: "callout", variant, title, value: body.join("\n").trim() })
        continue
      }
    }

    const leaf = line.match(LEAF_DIRECTIVE)
    if (leaf) {
      const name = leaf[1].toLowerCase()
      const target = (leaf[2] ?? "").trim()
      const attributes = parseAttributes(leaf[3])
      const block = buildLeaf(name, target, attributes, gallery)
      if (block) {
        flush()
        blocks.push(block)
        continue
      }
    }

    const url = bareUrl(line)
    if (url) {
      const embed = resolveEmbed(url)
      if (embed) {
        flush()
        blocks.push({ type: "embed", ...embed })
        continue
      }
    }

    buffer.push(line)
  }

  flush()
  return blocks
}

export type SplitBlock = Extract<Block, { type: "split" }>

/**
 * Read one `:::problem` block, starting at its opening line. Returns the block
 * and the index of its closing line, so the caller can carry on from there.
 */
function readSplit(lines: string[], open: RegExpMatchArray, start: number): { block: SplitBlock; end: number } {
  const name = open[1].toLowerCase()
  const heading = (open[2] ?? open[3] ?? "").trim()
  // Two buckets: everything before the column break, and everything after it.
  const columns: string[][] = [[]]
  let depth = 1
  let i = start + 1

  for (; i < lines.length; i++) {
    const inner = lines[i]
    const trimmed = inner.trim()

    if (trimmed === ":::") {
      depth--
      if (depth === 0) break
    } else if (NESTED_OPEN.test(trimmed)) {
      depth++
    }

    // Only the outermost level breaks columns — an hr inside a nested
    // callout is just an hr.
    if (depth === 1 && columns.length < 2 && COLUMN_BREAK.test(inner)) {
      columns.push([])
    } else {
      columns[columns.length - 1].push(inner)
    }
  }

  return {
    block: {
      type: "split",
      title: heading || (name === "problem" ? DEFAULT_SPLIT_TITLE : undefined),
      left: columns[0].join("\n").trim(),
      right: (columns[1] ?? []).join("\n").trim(),
    },
    end: i,
  }
}

/**
 * Lift the two-column blocks out of a body. The case study draws them as
 * numbered sections of its own rather than mid-prose, so it needs the blocks
 * and the leftover markdown separately.
 */
export function extractSplits(source: string): { splits: SplitBlock[]; body: string } {
  const lines = source.replace(/\r\n?/g, "\n").split("\n")
  const splits: SplitBlock[] = []
  const rest: string[] = []
  let inFence = false
  let fenceMarker = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const fence = line.match(/^(\s*)(`{3,}|~{3,})/)
    if (fence) {
      if (!inFence) {
        inFence = true
        fenceMarker = fence[2][0]
      } else if (fence[2][0] === fenceMarker) {
        inFence = false
      }
      rest.push(line)
      continue
    }

    const split = inFence ? null : line.match(SPLIT_OPEN)
    if (split) {
      const read = readSplit(lines, split, i)
      splits.push(read.block)
      i = read.end
      continue
    }

    rest.push(line)
  }

  return { splits, body: rest.join("\n").trim() }
}

function buildLeaf(
  name: string,
  target: string,
  attributes: Record<string, string>,
  gallery: GalleryImage[],
): Block | null {
  const caption = attributes.caption
  const src = target || attributes.src || attributes.url || ""

  switch (name) {
    case "gallery": {
      const images = gallery
      return images.length > 0 ? { type: "gallery", images } : null
    }
    case "figure":
    case "image":
    case "img":
      return src ? { type: "figure", src, alt: attributes.alt, caption } : null
    case "video":
      return src ? { type: "video", src, poster: attributes.poster, caption } : null
    case "youtube":
    case "vimeo":
    case "loom":
    case "embed": {
      if (!src) return null
      const resolved = resolveEmbed(src)
      if (resolved) {
        return { type: "embed", ...resolved, title: attributes.title, caption, ratio: attributes.ratio }
      }
      // Unknown host, but the author asked for an embed explicitly.
      if (isVideoFile(src)) return { type: "video", src, poster: attributes.poster, caption }
      if (isImageFile(src)) return { type: "figure", src, alt: attributes.alt, caption }
      return { type: "embed", provider: "generic", src, title: attributes.title, caption, ratio: attributes.ratio }
    }
    default:
      return null
  }
}
