"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Terminal, ArrowLeft, RefreshCw, ShieldAlert, Database, Code, Cpu } from "lucide-react"

export default function SystemErrorPage() {
  const [bootSequence, setBootSequence] = useState<string[]>([])
  const [commandInput, setCommandInput] = useState("")
  const [accessGranted, setAccessGranted] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  // Boot sequence messages
  const bootMessages = [
    "SYSTEM INITIALIZATION...",
    "CHECKING MEMORY INTEGRITY...",
    "ERROR: MEMORY CORRUPTION DETECTED",
    "ATTEMPTING RECOVERY SEQUENCE...",
    "RECOVERY FAILED: CRITICAL SYSTEM FILES CORRUPTED",
    "INITIATING EMERGENCY PROTOCOL...",
    "LOADING BACKUP INTERFACE...",
    "TERMINAL ACCESS ENABLED",
    "AWAITING AUTHORIZATION...",
  ]

  // Secret projects data
  const secretProjects = [
    {
      name: "Project Nexus",
      description: "Quantum computing interface with neural network integration",
      status: "Phase 2 Development",
      icon: <Cpu className="h-6 w-6 text-lime-400" />,
    },
    {
      name: "Cipher Protocol",
      description: "Advanced encryption system using biological markers",
      status: "Testing",
      icon: <ShieldAlert className="h-6 w-6 text-lime-400" />,
    },
    {
      name: "Cortex Database",
      description: "Self-evolving data structure with predictive analytics",
      status: "Prototype",
      icon: <Database className="h-6 w-6 text-lime-400" />,
    },
    {
      name: "Synaptic Code",
      description: "AI-driven code generation with consciousness simulation",
      status: "Theoretical",
      icon: <Code className="h-6 w-6 text-lime-400" />,
    },
  ]

  // Simulate boot sequence
  useEffect(() => {
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < bootMessages.length) {
        setBootSequence((prev) => [...prev, bootMessages[currentIndex]])
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [bootSequence, accessGranted])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Process command
    const command = commandInput.trim().toLowerCase()
    setCommandInput("")

    // Add command to terminal output
    setBootSequence((prev) => [...prev, `> ${command}`])

    // Process different commands
    setTimeout(() => {
      if (command === "help") {
        setBootSequence((prev) => [...prev, "Available commands: help, status, access, clear"])
      } else if (command === "status") {
        setBootSequence((prev) => [
          ...prev,
          "SYSTEM STATUS: CRITICAL",
          "Multiple subsystems offline",
          "Emergency protocols active",
        ])
      } else if (command === "clear") {
        setBootSequence([])
      } else if (command === "access" || command.includes("override")) {
        setBootSequence((prev) => [
          ...prev,
          "Initiating security override...",
          "Access granted. Welcome, Administrator.",
        ])
        setTimeout(() => {
          setAccessGranted(true)
        }, 1000)
      } else {
        setBootSequence((prev) => [...prev, `Command not recognized: ${command}`])
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-black text-blue-500 font-mono flex flex-col">
      {/* Glitch background effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-500/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 400}px`,
                height: `${Math.random() * 2}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: Math.random() * 0.5 + 0.5,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Terminal Interface */}
      <div className="relative z-10 flex-1 p-4 md:p-8 flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>RETURN TO MAIN SYSTEM</span>
          </Link>

          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-xs">SYSTEM RECOVERY IN PROGRESS</span>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="flex-1 border border-blue-500/30 bg-black shadow-lg rounded-md p-4 flex flex-col">
          <div className="flex items-center gap-2 border-b border-blue-500/30 pb-2 mb-4">
            <Terminal className="h-5 w-5" />
            <span>EMERGENCY TERMINAL</span>
            <div className="ml-auto flex gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
            </div>
          </div>

          {/* Terminal Output */}
          <div
            ref={terminalRef}
            className="flex-1 overflow-auto mb-4 font-mono text-sm"
            style={{ maxHeight: "calc(100vh - 250px)" }}
          >
            {bootSequence.map((line, index) => (
              <div key={index} className={`mb-1 ${line && line.startsWith(">") ? "text-blue-400" : ""}`}>
                {line || ""}
              </div>
            ))}
          </div>

          {/* Command Input */}
          {!accessGranted ? (
            <form onSubmit={handleCommandSubmit} className="flex border-t border-blue-500/30 pt-2">
              <span className="mr-2">{">"}</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                placeholder="Type 'help' for available commands..."
                autoFocus
              />
            </form>
          ) : (
            <div className="text-center">
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => setShowSecret(true)}
                className="bg-blue-500 text-black px-4 py-2 rounded-sm hover:bg-blue-400 transition-colors"
              >
                ACCESS CLASSIFIED PROJECTS
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Secret Projects Modal */}
      {showSecret && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-blue-500/20 shadow-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-blue-500 text-2xl font-bold">CLASSIFIED PROJECTS</h2>
              <button onClick={() => setShowSecret(false)} className="text-blue-500/70 hover:text-blue-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {secretProjects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-black/50 border border-blue-500/20 shadow-md p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {project.icon}
                    <h3 className="font-bold text-blue-500">{project.name}</h3>
                  </div>
                  <p className="text-blue-500/70 text-sm mb-3">{project.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-blue-500">STATUS:</span>
                    <span className="text-blue-500/80">{project.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-blue-500/50 text-sm mb-4">
                These projects are highly experimental and not available for public viewing. Your access has been
                logged.
              </p>
              <button
                onClick={() => setShowSecret(false)}
                className="bg-black border border-blue-500 text-blue-500 px-4 py-2 hover:bg-blue-500/10 transition-colors"
              >
                CLOSE CLASSIFIED FILES
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

// X icon component
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
