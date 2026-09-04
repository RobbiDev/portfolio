"use client"

import { useEffect } from "react"
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "./icons"
import type { GalleryImage } from "@/lib/types"

export interface LightboxState {
  images: GalleryImage[]
  index: number
}

interface LightboxProps {
  state: LightboxState | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function Lightbox({ state, onClose, onNavigate }: LightboxProps) {
  const count = state?.images.length ?? 0

  useEffect(() => {
    if (!state) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        onClose()
      }
      if (event.key === "ArrowLeft") onNavigate((state.index - 1 + count) % count)
      if (event.key === "ArrowRight") onNavigate((state.index + 1) % count)
    }

    document.addEventListener("keydown", onKeyDown, true)
    return () => document.removeEventListener("keydown", onKeyDown, true)
  }, [state, count, onClose, onNavigate])

  const current = state?.images[state.index]

  return (
    <div
      className={`lb${state ? " on" : ""}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      aria-hidden={!state}
    >
      <button className="lb-close" type="button" onClick={onClose}>
        Close
        <CloseIcon />
      </button>
      <div className="lb-stage">
        {current ? (
          <figure className="lb-figure">
            <div className="lb-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.url} alt={current.alt || current.title || ""} />
            </div>
            {current.caption || current.title ? (
              <figcaption>
                {current.title ? <b>{current.title}</b> : null}
                {current.caption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="lb-bar">
          <button
            className="lb-btn"
            type="button"
            onClick={() => state && onNavigate((state.index - 1 + count) % count)}
            aria-label="Previous image"
          >
            <ArrowLeftIcon />
          </button>
          <span className="lb-count">
            {(state?.index ?? 0) + 1} / {count}
          </span>
          <button
            className="lb-btn"
            type="button"
            onClick={() => state && onNavigate((state.index + 1) % count)}
            aria-label="Next image"
          >
            <ArrowRightIcon />
          </button>
        </div>
      ) : null}
    </div>
  )
}
