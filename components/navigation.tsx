"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

// Digital scrambling effect component
const ScrambleText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState(text)
  const [isHovering, setIsHovering] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const originalText = useRef(text)
  const iterationCount = useRef(0)
  const maxIterations = 10

  // Characters to use for scrambling effect
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
        setDisplayText(originalText.current)
        clearInterval(intervalRef.current as NodeJS.Timeout)
        return
      }

      // Create scrambled text with increasing correctness as iterations progress
      const progress = iterationCount.current / maxIterations
      let newText = ""

      for (let i = 0; i < originalText.current.length; i++) {
        // Chance of showing correct character increases with iterations
        if (Math.random() < progress) {
          newText += originalText.current[i]
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)]
        }
      }

      setDisplayText(newText)
    }, 50)
  }

  const stopScramble = () => {
    setIsHovering(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    setDisplayText(originalText.current)
  }

  return (
    <span
      className="font-mono text-[#e21a41] tracking-wider transition-colors"
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
    >
      {displayText.toUpperCase()}
    </span>
  )
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false)
  }, [pathname])

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-[70] transition-all duration-300 ${
          scrolled || isMenuOpen
            ? "bg-black/90 backdrop-blur-sm border-b border-neutral-800"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <ScrambleText text="robbyj" />
            </Link>
          </div>
  
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/" active={pathname === "/"}>HOME [+]</NavLink>
            <NavLink href="/projects" active={pathname.startsWith("/projects")}>PROJECTS [+]</NavLink>
            <NavLink href="/blog" active={pathname.startsWith("/blog")}>BLOG [+]</NavLink>
            <NavLink href="/about" active={pathname === "/about"}>ABOUT [+]</NavLink>
            <NavLink href="/contact" active={pathname === "/contact"}>CONTACT [+]</NavLink>
          </nav>
  
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-flex bg-[#e21a41] hover:bg-[#e21a41]/60 text-black px-4 py-2 text-sm font-medium transition-colors"
            >
              GET IN TOUCH
            </Link>
            <button
              ref={menuButtonRef}
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                document.body.style.overflow = !isMenuOpen ? "hidden" : "auto"
              }}
              className={`md:hidden p-2 z-[80] transition-colors ${
                isMenuOpen
                  ? "bg-[#e21a41] text-black"
                  : "bg-black/30 backdrop-blur-sm border border-neutral-800 text-white"
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
  
      {/* Mobile menu - outside the header so it can layer underneath */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col h-screen">
          <div className="pt-16 px-6 pb-8 flex flex-col flex-grow overflow-y-auto">
            <MobileNavLink href="/" active={pathname === "/"}>HOME</MobileNavLink>
            <MobileNavLink href="/projects" active={pathname.startsWith("/projects")}>PROJECTS</MobileNavLink>
            <MobileNavLink href="/blog" active={pathname.startsWith("/blog")}>BLOG</MobileNavLink>
            <MobileNavLink href="/about" active={pathname === "/about"}>ABOUT</MobileNavLink>
            <MobileNavLink href="/contact" active={pathname === "/contact"}>CONTACT</MobileNavLink>
  
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex w-full justify-center bg-[#e21a41] hover:bg-[#e21a41]/60 text-black px-4 py-3 font-medium transition-colors"
              >
                GET IN TOUCH
              </Link>
            </div>
  
            <div className="mt-auto pt-10 text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-[#e21a41] animate-pulse"></div>
                DEVELOPER PROFILE // SKILLS OPTIMIZED
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
  
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${active ? "text-lime-400" : "text-white hover:text-lime-400"}`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`text-2xl font-bold py-3 border-b border-neutral-800 transition-colors ${
        active ? "text-lime-400" : "text-white hover:text-lime-400"
      }`}
    >
      {children}
    </Link>
  )
}