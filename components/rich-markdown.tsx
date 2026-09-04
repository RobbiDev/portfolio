"use client"

import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

import { parseRichMarkdown, type Block, type CalloutVariant } from "@/lib/rich-markdown"
import { remarkKbd, remarkQuoteCite } from "@/lib/remark-rich"
import { AlertIcon, InfoIcon, SparkleIcon } from "@/components/site/icons"
import type { GalleryImage } from "@/lib/types"

const REMARK_PLUGINS = [remarkGfm, remarkKbd, remarkQuoteCite]
const REHYPE_PLUGINS = [rehypeRaw]

/* ── code highlighting ─────────────────────────────────────────────────────
 * Just enough to colour comments, strings and keywords using the three token
 * classes the stylesheet defines (.c, .k, .s). No dependency, no theme file.
 */

const KEYWORDS: Record<string, string[]> = {
  common: ["return", "if", "else", "for", "while", "break", "continue", "true", "false", "null"],
  js: ["const", "let", "var", "function", "class", "import", "export", "from", "default", "await", "async", "new", "typeof", "extends", "try", "catch", "throw"],
  ts: ["interface", "type", "enum", "implements", "public", "private", "readonly", "as", "satisfies"],
  py: ["def", "class", "import", "from", "lambda", "with", "as", "elif", "None", "True", "False", "yield", "raise", "except", "pass"],
  sh: ["echo", "cd", "export", "sudo", "apt", "npm", "pnpm", "git", "docker", "systemctl", "curl", "then", "fi", "do", "done"],
  net: ["interface", "description", "switchport", "vlan", "spanning-tree", "portfast", "access", "ip", "address", "router", "permit", "deny", "hostname"],
  sql: ["select", "from", "where", "insert", "into", "update", "set", "delete", "join", "group", "order", "by", "limit"],
}

function keywordsFor(language: string): string[] {
  const lang = language.toLowerCase()
  const groups = [KEYWORDS.common]

  if (/^(js|jsx|javascript|ts|tsx|typescript|java|c|cpp|go|rust|php)$/.test(lang)) groups.push(KEYWORDS.js)
  if (/^(ts|tsx|typescript)$/.test(lang)) groups.push(KEYWORDS.ts)
  if (/^(py|python)$/.test(lang)) groups.push(KEYWORDS.py)
  if (/^(sh|bash|zsh|shell|console|terminal)$/.test(lang)) groups.push(KEYWORDS.sh)
  if (/^(cisco|ios|net|conf|config|nginx)$/.test(lang)) groups.push(KEYWORDS.net)
  if (/^sql$/.test(lang)) groups.push(KEYWORDS.sql)
  if (!language) groups.push(KEYWORDS.js, KEYWORDS.sh, KEYWORDS.net)

  return Array.from(new Set(groups.flat()))
}

function commentPattern(language: string): string {
  const lang = language.toLowerCase()
  if (/^(py|python|sh|bash|zsh|shell|yaml|yml|toml|ini|conf|config|cisco|ios|nginx|dockerfile|ruby|rb)$/.test(lang)) {
    return "#[^\\n]*"
  }
  if (/^sql$/.test(lang)) return "--[^\\n]*"
  if (/^(css|scss|less)$/.test(lang)) return "/\\*[\\s\\S]*?\\*/"
  if (/^(html|xml|svg|md|markdown)$/.test(lang)) return "<!--[\\s\\S]*?-->"
  return "//[^\\n]*|/\\*[\\s\\S]*?\\*/|#[^\\n]*"
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function highlight(code: string, language: string): React.ReactNode {
  const keywords = keywordsFor(language).map(escapeForRegExp).join("|")
  const pattern = new RegExp(
    `(${commentPattern(language)})|("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')|\\b(${keywords})\\b`,
    "g",
  )

  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > lastIndex) nodes.push(code.slice(lastIndex, match.index))

    const className = match[1] ? "c" : match[2] ? "s" : "k"
    nodes.push(
      <span key={key++} className={className}>
        {match[0]}
      </span>,
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < code.length) nodes.push(code.slice(lastIndex))
  return nodes
}

/* ── markdown chunk ───────────────────────────────────────────────────────── */

function toText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child)
      if (React.isValidElement(child)) return toText((child.props as { children?: React.ReactNode }).children)
      return ""
    })
    .join("")
}

interface ChunkProps {
  value: string
  onOpenImage?: (images: GalleryImage[], index: number) => void
}

function MarkdownChunk({ value, onOpenImage }: ChunkProps) {
  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      components={{
        // A standalone image becomes a captioned figure; the alt text doubles
        // as the caption, matching how the design draws mid-post figures.
        img: ({ node, src, alt, title }) => {
          if (!src) return null
          const caption = title || alt
          return (
            <figure>
              <div
                className="fimg rj-figure"
                onClick={
                  onOpenImage
                    ? () => onOpenImage([{ url: String(src), caption, alt: alt || undefined }], 0)
                    : undefined
                }
                role={onOpenImage ? "button" : undefined}
                tabIndex={onOpenImage ? 0 : undefined}
                onKeyDown={
                  onOpenImage
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault()
                          onOpenImage([{ url: String(src), caption, alt: alt || undefined }], 0)
                        }
                      }
                    : undefined
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={String(src)} alt={alt || ""} loading="lazy" />
              </div>
              {caption ? <figcaption>{caption}</figcaption> : null}
            </figure>
          )
        },
        // Paragraphs that only wrap an image would nest <figure> inside <p>.
        p: ({ node, children, ...props }) => {
          const items = React.Children.toArray(children)
          const onlyMedia =
            items.length > 0 &&
            items.every(
              (child) =>
                (typeof child === "string" && !child.trim()) ||
                (React.isValidElement(child) && (child.type === "figure" || child.type === "img")),
            )
          if (onlyMedia) return <>{children}</>
          return <p {...props}>{children}</p>
        },
        a: ({ node, href, children, ...props }) => {
          const external = typeof href === "string" && /^https?:\/\//i.test(href)
          return (
            <a href={href} {...props} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
              {children}
            </a>
          )
        },
        pre: ({ children }) => <>{children}</>,
        code: ({ node, className, children, ...props }) => {
          const language = /language-(\w+)/.exec(className || "")?.[1] || ""
          const raw = toText(children)
          const isBlock = className?.includes("language-") || raw.includes("\n")

          if (!isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }

          return (
            <pre data-lang={language || undefined}>
              <code className={className}>{highlight(raw.replace(/\n$/, ""), language)}</code>
            </pre>
          )
        },
        table: ({ node, children, ...props }) => (
          <div className="rj-table">
            <table {...props}>{children}</table>
          </div>
        ),
      }}
    >
      {value}
    </ReactMarkdown>
  )
}

/* ── directive blocks ─────────────────────────────────────────────────────── */

const CALLOUT_ICON: Record<CalloutVariant, React.ComponentType> = {
  note: InfoIcon,
  tip: SparkleIcon,
  warn: AlertIcon,
  danger: AlertIcon,
}

function Callout({ variant, title, value }: { variant: CalloutVariant; title?: string; value: string }) {
  const Icon = CALLOUT_ICON[variant]
  return (
    <div className={`callout callout-${variant}`}>
      <span className="ic">
        <Icon />
      </span>
      <div>
        {title ? <strong>{title}</strong> : null} <MarkdownChunk value={value} />
      </div>
    </div>
  )
}

function Embed({ src, title, caption, ratio }: { src: string; title?: string; caption?: string; ratio?: string }) {
  return (
    <figure className="rj-embed">
      <div className="embed" style={ratio ? { aspectRatio: ratio.replace(":", "/") } : undefined}>
        <iframe
          src={src}
          title={title || caption || "Embedded media"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function Video({ src, poster, caption }: { src: string; poster?: string; caption?: string }) {
  return (
    <figure className="rj-embed">
      <div className="embed">
        <video src={src} poster={poster} controls preload="metadata" playsInline />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

/**
 * The design's two-column spread: the problem on the left, the approach on the
 * right, under a numbered section rule. Each column is its own <article> so it
 * picks up the surface's prose styles.
 */
export function SplitSection({
  title,
  left,
  right,
  index,
  onOpenImage,
}: {
  title?: string
  left: string
  right: string
  index?: string
  onOpenImage?: (images: GalleryImage[], index: number) => void
}) {
  return (
    <div className="sec rj-split">
      {title ? (
        <div className="sec-h">
          <span>{title}</span>
          {index ? <span>{index}</span> : null}
        </div>
      ) : null}
      <div className="two rj-two">
        <article>
          <MarkdownChunk value={left} onOpenImage={onOpenImage} />
        </article>
        {right ? (
          <article>
            <MarkdownChunk value={right} onOpenImage={onOpenImage} />
          </article>
        ) : null}
      </div>
    </div>
  )
}

/** The lightbox strip: every shot in the item's gallery, as a grid. */
export function Gallery({
  images,
  onOpenImage,
}: {
  images: GalleryImage[]
  onOpenImage?: (images: GalleryImage[], index: number) => void
}) {
  return (
    <div className="rj-gallery">
      {images.map((image, index) => (
        <button
          key={`${image.url}-${index}`}
          type="button"
          className="rj-gallery-item"
          onClick={() => onOpenImage?.(images, index)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.url} alt={image.alt || image.title || ""} loading="lazy" />
          {image.title ? <span className="rj-gallery-cap">{image.title}</span> : null}
        </button>
      ))}
    </div>
  )
}

/* ── entry point ──────────────────────────────────────────────────────────── */

export interface RichMarkdownProps {
  content: string
  gallery?: GalleryImage[]
  onOpenImage?: (images: GalleryImage[], index: number) => void
}

export default function RichMarkdown({ content, gallery = [], onOpenImage }: RichMarkdownProps) {
  const blocks: Block[] = React.useMemo(() => parseRichMarkdown(content, gallery), [content, gallery])

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "markdown":
            return <MarkdownChunk key={index} value={block.value} onOpenImage={onOpenImage} />
          case "callout":
            return <Callout key={index} variant={block.variant} title={block.title} value={block.value} />
          case "embed":
            return <Embed key={index} src={block.src} title={block.title} caption={block.caption} ratio={block.ratio} />
          case "video":
            return <Video key={index} src={block.src} poster={block.poster} caption={block.caption} />
          case "gallery":
            return <Gallery key={index} images={block.images} onOpenImage={onOpenImage} />
          case "split":
            return (
              <SplitSection
                key={index}
                title={block.title}
                left={block.left}
                right={block.right}
                onOpenImage={onOpenImage}
              />
            )
          case "figure":
            return (
              <figure key={index}>
                <div
                  className="fimg rj-figure"
                  onClick={
                    onOpenImage
                      ? () => onOpenImage([{ url: block.src, caption: block.caption, alt: block.alt }], 0)
                      : undefined
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={block.src} alt={block.alt || ""} loading="lazy" />
                </div>
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            )
          default:
            return null
        }
      })}
    </>
  )
}
