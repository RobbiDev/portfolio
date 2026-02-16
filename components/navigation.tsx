"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

// Digital scrambling effect component
const ScrambleText = ({ text, className = "" }: { text: string; className?: string }) => {
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
      className={`font-mono tracking-wider transition-colors ${className}`}
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
  const isSystemError = pathname.startsWith("/system-error")
  const headerAccent = isSystemError ? "text-blue-400" : "text-pallete-main"
  const headerHover = isSystemError ? "hover:text-blue-300" : "hover:text-pallete-main"
  const ctaClasses = isSystemError
    ? "hidden md:inline-flex bg-blue-500 hover:bg-blue-400 text-black px-4 py-2 text-sm font-medium transition-colors"
    : "hidden md:inline-flex bg-[#e21a41] hover:bg-[#e21a41]/60 text-black px-4 py-2 text-sm font-medium transition-colors"
  const mobileCtaClasses = isSystemError
    ? "inline-flex w-full justify-center bg-blue-500 hover:bg-blue-400 text-black px-4 py-3 font-medium transition-colors"
    : "inline-flex w-full justify-center bg-pallete-main hover:bg-pallete-main/60 text-black px-4 py-3 font-medium transition-colors"

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
        className={`${isSystemError ? "relative" : "sticky top-0"} z-[70] transition-all duration-300 ${
          scrolled || isMenuOpen || isSystemError
            ? "bg-black/90 backdrop-blur-sm border-b border-neutral-800"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <ScrambleText text="robbyj" className={isSystemError ? "text-blue-400" : "text-[#e21a41]"} />
            </Link>
          </div>
  
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/" active={pathname === "/"} accentClassName={headerAccent} hoverClassName={headerHover}>HOME [+]</NavLink>
            <NavLink href="/projects" active={pathname.startsWith("/projects")} accentClassName={headerAccent} hoverClassName={headerHover}>PROJECTS [+]</NavLink>
            <NavLink href="/blog" active={pathname.startsWith("/blog")} accentClassName={headerAccent} hoverClassName={headerHover}>BLOG [+]</NavLink>
            <NavLink href="/about" active={pathname === "/about"} accentClassName={headerAccent} hoverClassName={headerHover}>ABOUT [+]</NavLink>
            <NavLink href="/contact" active={pathname === "/contact"} accentClassName={headerAccent} hoverClassName={headerHover}>CONTACT [+]</NavLink>
          </nav>
  
          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/contact" className={ctaClasses}>
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
                  ? isSystemError
                    ? "bg-blue-500 text-black"
                    : "bg-[#e21a41] text-black"
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
            <MobileNavLink href="/" active={pathname === "/"} accentClassName={headerAccent} hoverClassName={headerHover}>HOME</MobileNavLink>
            <MobileNavLink href="/projects" active={pathname.startsWith("/projects")} accentClassName={headerAccent} hoverClassName={headerHover}>PROJECTS</MobileNavLink>
            <MobileNavLink href="/blog" active={pathname.startsWith("/blog")} accentClassName={headerAccent} hoverClassName={headerHover}>BLOG</MobileNavLink>
            <MobileNavLink href="/about" active={pathname === "/about"} accentClassName={headerAccent} hoverClassName={headerHover}>ABOUT</MobileNavLink>
            <MobileNavLink href="/contact" active={pathname === "/contact"} accentClassName={headerAccent} hoverClassName={headerHover}>CONTACT</MobileNavLink>
  
            <div className="mt-6">
              <Link href="/contact" className={mobileCtaClasses}>
                GET IN TOUCH
              </Link>
            </div>
  
            <div className="mt-auto pt-10 text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-pallete-main animate-pulse"></div>
                ROBERT // JOHNSON
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
  
}

function NavLink({
  href,
  active,
  children,
  accentClassName,
  hoverClassName,
}: {
  href: string
  active: boolean
  children: React.ReactNode
  accentClassName: string
  hoverClassName: string
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${active ? accentClassName : `text-white ${hoverClassName}`}`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({
  href,
  active,
  children,
  accentClassName,
  hoverClassName,
}: {
  href: string
  active: boolean
  children: React.ReactNode
  accentClassName: string
  hoverClassName: string
}) {
  return (
    <Link
      href={href}
      className={`text-2xl font-bold py-3 border-b border-neutral-800 transition-colors ${
        active ? accentClassName : `text-white ${hoverClassName}`
      }`}
    >
      {children}
    </Link>
  )
}