"use client"

import { useEffect, useRef } from "react"

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawGrid()
    }

    const drawGrid = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = "rgba(75, 75, 75, 0.15)"
      ctx.lineWidth = 1

      // Vertical lines
      const colWidth = 80
      const cols = Math.ceil(canvas.width / colWidth)

      for (let i = 0; i <= cols; i++) {
        const x = i * colWidth
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      const rowHeight = 80
      const rows = Math.ceil(canvas.height / rowHeight)

      for (let i = 0; i <= rows; i++) {
        const y = i * rowHeight
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Add random text blocks
      ctx.font = "8px monospace"
      ctx.fillStyle = "rgba(75, 75, 75, 0.3)"

      const textBlocks = 15
      for (let i = 0; i < textBlocks; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height

        ctx.fillText("DEV.PATH", x, y)
        ctx.fillText("SYSTEM.STATUS", x, y + 10)
        ctx.fillText("LOADING...", x, y + 20)
        ctx.fillText("COORDINATES (X,Y)", x, y + 30)
        ctx.fillText("RUNTIME STATUS", x, y + 40)
      }
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-70" style={{ pointerEvents: "none" }} />
}
