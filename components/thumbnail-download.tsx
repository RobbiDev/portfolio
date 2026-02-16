"use client"

import { useState } from "react"
import { Download } from "lucide-react"

interface ThumbnailDownloadProps {
  imageUrl?: string
  fileName?: string
  label?: string
  overlayText?: string
  overlayColor?: string
  overlayFont?: string
}

export default function ThumbnailDownloadButton({
  imageUrl,
  fileName = "thumbnail.png",
  label = "DOWNLOAD THUMBNAIL",
  overlayText,
  overlayColor,
  overlayFont,
}: ThumbnailDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!imageUrl) {
    return null
  }

  const downloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const downloadPng = async () => {
    setIsDownloading(true)
    try {
      const resolveFontFamily = () => {
        if (overlayFont) return overlayFont
        if (typeof window === "undefined") return "sans-serif"
        const probe = document.createElement("span")
        probe.className = "font-marker"
        probe.textContent = "M"
        probe.style.position = "absolute"
        probe.style.visibility = "hidden"
        probe.style.pointerEvents = "none"
        probe.style.left = "-9999px"
        document.body.appendChild(probe)
        const family = getComputedStyle(probe).fontFamily || "sans-serif"
        probe.remove()
        return family
      }

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.decoding = "async"
      img.src = imageUrl

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Image failed to load"))
      })

      const width = img.naturalWidth || 1200
      const height = img.naturalHeight || 675
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Canvas not supported")
      }

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(img, 0, 0, width, height)

      const text = overlayText?.trim()
      if (text) {
        const fontFamily = resolveFontFamily()
        const maxWidth = width * 0.82
        let fontSize = Math.max(36, Math.min(Math.round(width * 0.055), 84))

        if (document.fonts?.load) {
          try {
            await document.fonts.load(`${fontSize}px ${fontFamily}`)
            await document.fonts.ready
          } catch (error) {
            // Ignore font load issues and keep default rendering.
          }
        }

        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        const fitText = () => {
          ctx.font = `${fontSize}px ${fontFamily}`
          while (ctx.measureText(text).width > maxWidth && fontSize > 26) {
            fontSize -= 2
            ctx.font = `${fontSize}px ${fontFamily}`
          }
        }

        fitText()

        const textWidth = Math.min(ctx.measureText(text).width, maxWidth)
        const paddingX = fontSize * 0.9
        const paddingY = fontSize * 0.55
        const boxWidth = Math.min(textWidth + paddingX * 2, width * 0.92)
        const boxHeight = fontSize + paddingY * 2
        const boxX = (width - boxWidth) / 2
        const boxY = (height - boxHeight) / 2

        ctx.fillStyle = overlayColor || "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight)

        ctx.fillStyle = "#ffffff"
        ctx.fillText(text, width / 2, height / 2)
      }

      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob)
        } else {
          const fallback = document.createElement("a")
          fallback.href = imageUrl
          fallback.download = fileName
          fallback.click()
        }
      }, "image/png")
    } catch (error) {
      const fallback = document.createElement("a")
      fallback.href = imageUrl
      fallback.download = fileName
      fallback.click()
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={downloadPng}
      disabled={isDownloading}
      className="inline-flex items-center gap-2 border border-blue-500/40 px-3 py-2 text-xs md:text-sm text-blue-500 hover:text-blue-300 hover:border-blue-400 transition-colors disabled:opacity-60"
    >
      <Download className="h-4 w-4" />
      {isDownloading ? "PREPARING..." : label}
    </button>
  )
}
