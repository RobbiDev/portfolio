"use client"

import type { ContentItem } from "@/lib/content"

/**
 * Postcard artwork. A cover image is used when the item has one; otherwise the
 * design's generated art stands in, cycling three palettes so a wall of cards
 * without images still reads as a set of postcards rather than empty boxes.
 */
export function artClassName(item: ContentItem, index: number, base = "pc-art"): string {
  if (item.coverImage) return base
  return `${base} gen g${(index % 3) + 1}`
}

export function postYear(item: ContentItem): string {
  if (!item.date) return "—"
  const parsed = new Date(item.date)
  return Number.isNaN(parsed.getTime()) ? "—" : String(parsed.getUTCFullYear())
}

interface PostcardArtProps {
  item: ContentItem
  index: number
  className?: string
  showStamps?: boolean
}

export default function PostcardArt({ item, index, className = "pc-art", showStamps = true }: PostcardArtProps) {
  return (
    <div className={artClassName(item, index, className)}>
      {item.coverImage ? (
        <div className="rj-slot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.coverImage} alt="" loading="lazy" />
        </div>
      ) : null}
      {showStamps ? (
        <>
          <span className="pc-city">{item.location || "Greensboro, NC"}</span>
          <span className="postmark">
            <span>{item.draft ? "Draft" : "Posted"}</span>
            <b>{postYear(item)}</b>
          </span>
        </>
      ) : null}
    </div>
  )
}
