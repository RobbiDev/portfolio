"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Minus, X } from "lucide-react"

interface InDevWorkbenchLayoutProps {
  children: React.ReactNode
  editor: React.ReactNode
  topAnchorId?: string
}

export default function InDevWorkbenchLayout({ children, editor, topAnchorId }: InDevWorkbenchLayoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [panelHeight, setPanelHeight] = useState(360)
  const resizingRef = useRef(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)

  const handleBackToTerminal = () => {
    if (typeof window === "undefined") return
    sessionStorage.setItem("systemErrorAutoDev", "1")
  }

  const handleToggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev
      if (next) {
        setIsMinimized(false)
      }
      return next
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleToggleMinimize = () => {
    setIsMinimized((prev) => !prev)
  }

  const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isMinimized) return
    resizingRef.current = true
    startYRef.current = event.clientY
    startHeightRef.current = panelHeight
    event.currentTarget.setPointerCapture(event.pointerId)

    const handleResizeMove = (moveEvent: PointerEvent) => {
      if (!resizingRef.current) return
      const delta = startYRef.current - moveEvent.clientY
      const maxHeight = Math.max(320, window.innerHeight - 120)
      const nextHeight = Math.min(Math.max(startHeightRef.current + delta, 220), maxHeight)
      setPanelHeight(nextHeight)
    }

    const handleResizeEnd = (endEvent: PointerEvent) => {
      resizingRef.current = false
      event.currentTarget.releasePointerCapture(endEvent.pointerId)
      window.removeEventListener("pointermove", handleResizeMove)
      window.removeEventListener("pointerup", handleResizeEnd)
    }

    window.addEventListener("pointermove", handleResizeMove)
    window.addEventListener("pointerup", handleResizeEnd)
  }
  return (
    <div className="relative space-y-6 w-full">
      <div className="hidden lg:flex lg:flex-row justify-between items-center">
        <div>
          <Link
            href="/system-error"
            onClick={handleBackToTerminal}
            className="inline-flex items-center gap-2 h-9 text-xs uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to terminal
          </Link>
        </div>
        <button
          type="button"
          onClick={handleToggleOpen}
          className="inline-flex items-center gap-2 h-9 border border-blue-500/40 px-3 text-xs md:text-sm text-blue-500 hover:text-blue-300 hover:border-blue-400 transition-colors"
        >
          {isOpen ? "HIDE WORKBENCH" : "OPEN WORKBENCH"}
        </button>
      </div>

      <div className="min-w-0 space-y-8">{children}</div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 hidden lg:block pointer-events-none">
            <motion.div
              className="absolute inset-x-0 bottom-6 pointer-events-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="px-6 lg:px-10">
                <div
                  className="relative border border-blue-500/40 bg-black/80 backdrop-blur-md overflow-hidden"
                  style={{ height: isMinimized ? 48 : panelHeight }}
                >
                  <div
                    className="absolute inset-x-0 top-0 h-2 cursor-ns-resize"
                    onPointerDown={handleResizeStart}
                    aria-label="Resize workbench"
                  ></div>
                  <div className="flex items-center justify-between border-b border-blue-500/30 px-4 py-2 bg-blue-500/10">
                    <span className="text-xs uppercase tracking-[0.2em] text-blue-300">Workbench</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleMinimize}
                        className="inline-flex items-center justify-center h-7 w-7 border border-blue-500/40 text-blue-300 hover:text-blue-200 hover:border-blue-400 transition-colors"
                        aria-label={isMinimized ? "Restore workbench" : "Minimize workbench"}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex items-center justify-center h-7 w-7 border border-blue-500/40 text-blue-300 hover:text-blue-200 hover:border-blue-400 transition-colors"
                        aria-label="Close workbench"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {!isMinimized && <div className="h-full overflow-y-auto p-4 md:p-5">{editor}</div>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
