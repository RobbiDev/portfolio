"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { useEffect, useRef, useState } from "react"



const ScrambleText = () => {
  const originalText = "MARATHON"
  const targetText = "ESCAPE WILL MAKE ME GOD_"
  const [displayText, setDisplayText] = useState(originalText)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const iterationCount = useRef(0)
  const maxIterations = 20
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const startScramble = () => {
    setIsHovering(true)
    iterationCount.current = 0

    if (intervalRef.current) clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      iterationCount.current += 1

      if (iterationCount.current > maxIterations) {
        setDisplayText(targetText)
        clearInterval(intervalRef.current as NodeJS.Timeout)
        return
      }

      const progress = iterationCount.current / maxIterations
      let newText = ""

      for (let i = 0; i < targetText.length; i++) {
        if (Math.random() < progress) {
          newText += targetText[i]
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)]
        }
      }

      setDisplayText(newText.toUpperCase())
    }, 50)
  }

  const stopScramble = () => {
    setIsHovering(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDisplayText(originalText)
  }

  return (
    <p
      className="font-mono tracking-wider transition-colors cursor-pointer"
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
    >
      insprired by: <a href="https://www.marathonthegame.com/announcement" target="_blank" className="text-lime-400">{displayText}</a>
    </p>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-8">
      <div className="container">
        <div className="flex flex-col items-center md:flex-row justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-lime-400 tracking-wider">ROBBYJ</span>
          </div>
          <div className="text-sm font-mono text-neutral-400 flex flex-wrap gap-4 justify-center md:justify-end">
            <ScrambleText/>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-lime-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-lime-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-neutral-400 hover:text-lime-400 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
