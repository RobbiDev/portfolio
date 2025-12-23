"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import FuturisticBackground from "@/components/background"
import { useRouter } from "next/navigation"

// Enhanced Glitch Text Component
const GlitchText = ({ text, onClick }: { text: string; onClick: () => void }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const [errorText, setErrorText] = useState("ERROR")
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const errorGlitchIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
      if (errorGlitchIntervalRef.current) {
        clearInterval(errorGlitchIntervalRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovering(true)

    // Create random glitch intensity changes
    glitchIntervalRef.current = setInterval(() => {
      setGlitchIntensity(Math.random() * 10)
    }, 100)

    // Create glitching effect on ERROR text
    errorGlitchIntervalRef.current = setInterval(() => {
      // Randomly decide if we should glitch the text
      if (Math.random() < 0.3) {
        // Create a glitched version of ERROR
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`"
        let glitchedText = ""

        for (let i = 0; i < 5; i++) {
          // 30% chance to replace a character with a random one
          if (i < "ERROR".length && Math.random() < 0.3) {
            glitchedText += chars[Math.floor(Math.random() * chars.length)]
          } else {
            glitchedText += "ERROR"[i] || ""
          }
        }

        setErrorText(glitchedText)
      } else {
        setErrorText("ERROR")
      }
    }, 100)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (glitchIntervalRef.current) {
      clearInterval(glitchIntervalRef.current)
      setGlitchIntensity(0)
    }
    if (errorGlitchIntervalRef.current) {
      clearInterval(errorGlitchIntervalRef.current)
      setErrorText("ERROR")
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Original text */}
      <span className={isHovering ? "opacity-0" : "text-[#e21a41]"}>{text}</span>

      {/* Glitch layers - only visible on hover */}
      {isHovering && (
        <>
          {/* Error text overlay */}
          <div className="absolute inset-0 bg-white flex items-center justify-center z-20 overflow-hidden">
            {/* Scanlines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute h-[1px] w-full bg-blue-500"
                  style={{
                    top: `${i * 10}%`,
                    left: 0,
                    opacity: Math.random() * 0.5 + 0.5,
                    transform: `translateY(${Math.sin(Date.now() / 1000 + i) * 2}px)`,
                  }}
                ></div>
              ))}
            </div>

            {/* Glitched ERROR text */}
            <div className="relative">
              {/* Shadow copies for glitch effect */}
              <span
                className="absolute text-blue-500/70 font-bold"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
                  transform: `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`,
                }}
              >
                {errorText}
              </span>
              <span
                className="absolute text-blue-500/70 font-bold"
                style={{
                  clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
                  transform: `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`,
                }}
              >
                {errorText}
              </span>

              {/* Main text */}
              <span
                className="relative text-blue-500 font-bold mix-blend-difference"
                style={{
                  textShadow: `
                    ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 rgba(255,0,0,0.5),
                    ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 rgba(0,255,0,0.5)
                  `,
                }}
              >
                {errorText}
              </span>
            </div>
          </div>

          {/* Glitch text layers */}
          <span
            className="absolute top-0 left-0 text-blue-500 animate-glitch-1 z-10"
            style={{
              clipPath: `polygon(0 ${glitchIntensity}%, 100% ${glitchIntensity}%, 100% ${30 + glitchIntensity}%, 0 ${30 + glitchIntensity}%)`,
              transform: `translate(${(Math.random() - 0.5) * 5}px, ${(Math.random() - 0.5) * 3}px)`,
              opacity: 0.8,
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-blue-500 animate-glitch-2 z-10"
            style={{
              clipPath: `polygon(0 ${30 + glitchIntensity}%, 100% ${30 + glitchIntensity}%, 100% ${60 + glitchIntensity}%, 0 ${60 + glitchIntensity}%)`,
              transform: `translate(${(Math.random() - 0.5) * 5}px, ${(Math.random() - 0.5) * 3}px)`,
              opacity: 0.8,
            }}
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-0 text-blue-500 animate-glitch-3 z-10"
            style={{
              clipPath: `polygon(0 ${60 + glitchIntensity}%, 100% ${60 + glitchIntensity}%, 100% ${100}%, 0 ${100}%)`,
              transform: `translate(${(Math.random() - 0.5) * 5}px, ${(Math.random() - 0.5) * 3}px)`,
              opacity: 0.8,
            }}
          >
            {text}
          </span>
        </>
      )}
    </div>
  )
}

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setLoaded(true)
  }, [])

  const handleGlitchClick = () => {
    router.push("/system-error")
  }

  return (
    <div className="relative max-h-screen">
      {/* Futuristic Background */}
      <FuturisticBackground />

      {/* Content */}
      <div ref={containerRef} className="relative z-10 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="container px-4 py-20 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <div className="inline-block bg-black/30 backdrop-blur-sm border border-pallete-main px-3 py-1 text-xs font-mono text-pallete-main">
              PORTFOLIO // ROBERT (ROBBY) JOHNSON
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter"
            >
              MAKING <GlitchText text="THINGS" onClick={handleGlitchClick} /> BETTER
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-neutral-300 text-lg md:text-xl max-w-2xl mx-auto"
            >
              From networks to control systems — I build secure, scalable systems across software, networks, and PLCs.
              Focused on performance, reliability, and making things better.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 bg-[#e21a41] hover:bg-[#e21a41]/70 text-black px-6 py-3 font-medium transition-colors"
              >
                VIEW MY WORK <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-[#e21a41]/20 hover:bg-black/50 px-6 py-3 font-medium transition-colors"
              >
                READ BLOG
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </div>


    </div>
  )
}
