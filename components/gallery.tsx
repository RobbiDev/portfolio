"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import type { GalleryImage } from "@/lib/types"

interface GalleryProps {
  images: GalleryImage[]
  title?: string
}

export default function Gallery({ images, title = "Gallery" }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Handle touch events for mobile swipe gestures
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false)
    setSelectedImage(null)
  }, [])

  const navigateImage = useCallback(
    (direction: "prev" | "next") => {
      if (selectedImage === null) return

      if (direction === "prev") {
        setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
      } else {
        setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
      }
    },
    [images, selectedImage],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") navigateImage("prev")
      if (e.key === "ArrowRight") navigateImage("next")
    },
    [closeLightbox, navigateImage],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  if (!images || images.length === 0) {
    return null
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    setIsLightboxOpen(true)
  }

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance

    // If it's primarily a vertical swipe, close the lightbox
    if (Math.abs(distanceY) > Math.abs(distanceX)) {
      if (isUpSwipe || isDownSwipe) {
        closeLightbox()
        return
      }
    }

    // Horizontal swipes for navigation
    if (isLeftSwipe && images.length > 1) {
      navigateImage("next")
    }
    if (isRightSwipe && images.length > 1) {
      navigateImage("prev")
    }
  }

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isLightboxOpen])

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-lime-400"></div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative aspect-video bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => openLightbox(index)}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || image.caption || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>

              {/* Caption overlay */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Large background overlay that closes on click/tap */}
            <div
              className="absolute inset-0 w-full h-full cursor-pointer"
              onClick={closeLightbox}
              style={{ touchAction: "manipulation" }}
            />

            {/* Extra large close button - positioned for easy thumb access */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="absolute top-4 right-4 z-30 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-colors shadow-lg"
              aria-label="Close gallery"
              style={{
                minWidth: "60px",
                minHeight: "60px",
                touchAction: "manipulation",
              }}
            >
              <X className="h-8 w-8" />
            </button>

            {/* Secondary close button in top-left for left-handed users */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="absolute top-4 left-4 z-30 bg-red-600/80 hover:bg-red-700 text-white p-3 rounded-full transition-colors shadow-lg md:hidden"
              aria-label="Close gallery"
              style={{
                minWidth: "50px",
                minHeight: "50px",
                touchAction: "manipulation",
              }}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons - improved for mobile */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage("prev")
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full transition-colors"
                  aria-label="Previous image"
                  style={{
                    minWidth: "56px",
                    minHeight: "56px",
                    touchAction: "manipulation",
                  }}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage("next")
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-black/80 hover:bg-black/90 text-white p-4 rounded-full transition-colors"
                  aria-label="Next image"
                  style={{
                    minWidth: "56px",
                    minHeight: "56px",
                    touchAction: "manipulation",
                  }}
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Image container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center px-20 py-20 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={images[selectedImage].url || "/placeholder.svg"}
                  alt={
                    images[selectedImage].alt || images[selectedImage].caption || `Gallery image ${selectedImage + 1}`
                  }
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Image info */}
              {(images[selectedImage].caption || images[selectedImage].title) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 z-10">
                  {images[selectedImage].title && (
                    <h4 className="text-white text-base md:text-lg font-bold mb-2">{images[selectedImage].title}</h4>
                  )}
                  {images[selectedImage].caption && (
                    <p className="text-white/90 text-sm">{images[selectedImage].caption}</p>
                  )}
                </div>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute top-0 left-0 bg-black/70 text-white px-3 py-1 rounded-br-lg text-sm font-mono z-10">
                  {selectedImage + 1} / {images.length}
                </div>
              )}
            </motion.div>

            {/* Mobile instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 md:hidden">
              <div className="bg-black/80 text-white px-4 py-2 rounded-full text-xs font-mono text-center">
                <div>Tap anywhere to close</div>
                <div className="text-xs opacity-75">Swipe up/down to close • Swipe left/right to navigate</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
