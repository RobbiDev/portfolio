"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 py-8">
      <div className="container">
        <div className="flex flex-col items-center md:flex-row justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-neutral-400 hover:text-pallete-main transition-colors tracking-wider">ROBBYJ</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/RobbiDev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-pallete-main transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </Link>
            <a
              href="https://www.linkedin.com/in/robby-johnson/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-pallete-main transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:hello@example.com"
              className="text-neutral-400 hover:text-pallete-main transition-colors"
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
