"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Terminal, ArrowLeft, RefreshCw, Code2, FileText, Clock, Folder } from "lucide-react"

// Define in-dev item type
interface InDevItem {
  slug: string
  title: string
  type: "project" | "blog"
  status?: string
  date?: string
  category?: string | string[]
  technologies?: string[]
}

export default function SystemErrorPage() {
  const router = useRouter()
  const [bootSequence, setBootSequence] = useState<string[]>([])
  const [commandInput, setCommandInput] = useState("")
  const [showInDev, setShowInDev] = useState(false)
  const [inDevItems, setInDevItems] = useState<InDevItem[]>([])
  const [loading, setLoading] = useState(false)
  const [bootKey, setBootKey] = useState(0)
  const pathname = usePathname()
  const terminalRef = useRef<HTMLDivElement>(null)
  const commandInputRef = useRef<HTMLInputElement>(null)

  // Boot sequence messages - shortened for faster access
  const bootMessages = [
    "SYSTEM INITIALIZATION...",
    "LOADING DEVELOPMENT ENVIRONMENT...",
    "TERMINAL ACCESS ENABLED",
    "Type 'dev' to view in-development projects",
  ]

  // Fetch in-dev items
  const fetchInDevItems = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/in-dev")
      if (response.ok) {
        const data = await response.json()
        setInDevItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch in-dev items:", error)
    }
    setLoading(false)
  }

  // Simulate boot sequence - faster than before
  useEffect(() => {
    if (bootKey === 0) return
    let currentIndex = 0
    setBootSequence([])

    const interval = setInterval(() => {
      if (currentIndex < bootMessages.length) {
        setBootSequence((prev) => [...prev, bootMessages[currentIndex]])
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 300) // Faster boot

    return () => clearInterval(interval)
  }, [bootKey])

  useEffect(() => {
    if (pathname !== "/system-error") return
    const shouldAutoDev =
      typeof window !== "undefined" && sessionStorage.getItem("systemErrorAutoDev") === "1"

    if (shouldAutoDev) {
      sessionStorage.removeItem("systemErrorAutoDev")
    } else {
      setShowInDev(false)
      setLoading(false)
      setInDevItems([])
      setCommandInput("")
    }

    setBootKey((prev) => prev + 1)

    if (shouldAutoDev) {
      setTimeout(() => {
        executeCommand("dev")
      }, 0)
    }
  }, [pathname])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const originalOverscroll = document.body.style.overscrollBehavior
    document.body.style.overflow = "hidden"
    document.body.style.overscrollBehavior = "none"

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.overscrollBehavior = originalOverscroll
    }
  }, [])

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [bootSequence, showInDev])

  const executeCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toLowerCase()
    if (!command) return
    setCommandInput("")
    setBootSequence((prev) => [...prev, `> ${command}`])

    setTimeout(() => {
      if (command === "help") {
        setBootSequence((prev) => [
          ...prev,
          "Available commands:",
          "  dev    - View in-development projects and blogs",
          "  clear  - Clear terminal output",
          "  help   - Show this help message",
        ])
      } else if (command === "clear") {
        setBootSequence([])
        setShowInDev(false)
        setInDevItems([])
      } else if (command === "dev" || command === "development" || command === "in-dev") {
        setBootSequence((prev) => [...prev, "Loading in-development items..."])
        fetchInDevItems()
        setTimeout(() => {
          setShowInDev(true)
        }, 500)
      } else {
        setBootSequence((prev) => [...prev, `Command not recognized: ${command}`, "Type 'help' for available commands"])
      }
    }, 200)
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(commandInput)
  }

  const handleQuickCommand = (command: string) => {
    executeCommand(command)
    requestAnimationFrame(() => {
      commandInputRef.current?.focus()
    })
  }

  const projectItems = inDevItems.filter((item) => item.type === "project")
  const blogItems = inDevItems.filter((item) => item.type === "blog")

  const handleRowNavigate = (slug: string) => {
    router.push(`/system-error/${slug}`)
  }

  const handleRowKeyDown = (event: React.KeyboardEvent, slug: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleRowNavigate(slug)
    }
  }

  return (
    <div className="h-[calc(100dvh-4rem)] bg-black text-blue-500 font-mono overflow-hidden flex flex-col">
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
      <div className="relative z-10 h-full p-4 md:p-8 flex flex-col min-h-0 overflow-hidden">
        <div className="border border-blue-500/30 bg-black/80 rounded-md overflow-hidden flex flex-col min-h-0 h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/30">
            <Link href="/" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>RETURN TO MAIN SYSTEM</span>
            </Link>

            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-xs">SYSTEM RECOVERY IN PROGRESS</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-4 p-4 md:p-6 overflow-hidden">
          {/* Terminal Window */}
          <div className="flex-1 min-h-0 border border-blue-500/30 bg-black shadow-lg rounded-md p-4 flex flex-col">
            <div className="flex items-center gap-2 border-b border-blue-500/30 pb-2 mb-4">
              <Terminal className="h-5 w-5" />
              <span>EMERGENCY TERMINAL</span>
              <div className="ml-auto flex gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
              </div>
            </div>

            {/* Terminal Output */}
            <div ref={terminalRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden mb-4 font-mono text-sm">
              {bootSequence.map((line, index) => (
                <div key={index} className={`mb-1 ${line && line.startsWith(">") ? "text-blue-400" : ""}`}>
                  {line || ""}
                </div>
              ))}
            </div>

            {/* Command Input */}
            <form onSubmit={handleCommandSubmit} className="flex border-t border-blue-500/30 pt-2">
              <span className="mr-2">{">"}</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                ref={commandInputRef}
                className="flex-1 bg-transparent outline-none"
                placeholder="Type 'dev' to view in-development items..."
                autoFocus
              />
            </form>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickCommand("dev")}
                className="border border-blue-500/30 px-3 py-1 text-blue-400 hover:text-blue-300 hover:border-blue-400 transition-colors"
              >
                DEV
              </button>
              <button
                type="button"
                onClick={() => handleQuickCommand("help")}
                className="border border-blue-500/30 px-3 py-1 text-blue-400 hover:text-blue-300 hover:border-blue-400 transition-colors"
              >
                HELP
              </button>
              <button
                type="button"
                onClick={() => handleQuickCommand("clear")}
                className="border border-blue-500/30 px-3 py-1 text-blue-400 hover:text-blue-300 hover:border-blue-400 transition-colors"
              >
                CLEAR
              </button>
            </div>
          </div>

          {/* In-Dev Items Display */}
          {showInDev && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-none max-h-[32vh] overflow-auto border border-blue-500/30 bg-black/50 rounded-md p-4 md:p-6"
            >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-blue-500" />
                <h2 className="text-blue-500 text-lg md:text-xl font-bold">IN-DEVELOPMENT ITEMS</h2>
              </div>
              <button
                onClick={() => setShowInDev(false)}
                className="text-blue-500/70 hover:text-blue-500 text-sm"
              >
                [CLOSE]
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                <p className="text-blue-500/70">Loading...</p>
              </div>
            ) : inDevItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-500/70">No in-development items found</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 text-xs uppercase">
                    <Code2 className="h-4 w-4" />
                    Projects
                  </div>
                  {projectItems.length === 0 ? (
                    <p className="text-blue-500/70 text-sm">No in-development projects found</p>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full table-fixed text-left text-sm">
                          <colgroup>
                            <col className="w-[40%]" />
                            <col className="w-[20%]" />
                            <col className="w-[25%]" />
                            <col className="w-[15%]" />
                          </colgroup>
                          <thead className="border-b border-blue-500/30">
                            <tr className="text-blue-500">
                              <th className="pb-2 px-3">TITLE</th>
                              <th className="pb-2 px-3">STATUS</th>
                              <th className="pb-2 px-3">CATEGORY</th>
                              <th className="pb-2 px-3">ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectItems.map((item, index) => (
                              <motion.tr
                                key={item.slug}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-blue-500/10 hover:bg-blue-500/10 cursor-pointer"
                                onClick={() => handleRowNavigate(item.slug)}
                                onKeyDown={(event) => handleRowKeyDown(event, item.slug)}
                                tabIndex={0}
                                role="button"
                              >
                                <td className="py-3 px-3 text-blue-500">{item.title}</td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-yellow-500" />
                                    <span className="text-yellow-500 text-xs">{item.status || "In Progress"}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-blue-500/70 text-xs">
                                  {Array.isArray(item.category) ? item.category.join(", ") : item.category || "N/A"}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="text-blue-400 underline text-xs">VIEW</span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="md:hidden space-y-3">
                        {projectItems.map((item, index) => (
                          <Link key={item.slug} href={`/system-error/${item.slug}`} className="block">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border border-blue-500/20 bg-black/30 p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Code2 className="h-4 w-4 text-blue-400" />
                                  <span className="text-blue-500 uppercase text-xs font-bold">PROJECT</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-yellow-500" />
                                  <span className="text-yellow-500 text-xs">{item.status || "In Progress"}</span>
                                </div>
                              </div>
                              <h3 className="text-blue-500 font-bold mb-2">{item.title}</h3>
                              {item.category && (
                                <p className="text-blue-500/70 text-xs mb-3">
                                  {Array.isArray(item.category) ? item.category.join(", ") : item.category}
                                </p>
                              )}
                              <span className="text-blue-400 underline text-sm">VIEW DETAILS →</span>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 text-xs uppercase">
                    <FileText className="h-4 w-4" />
                    Blogs
                  </div>
                  {blogItems.length === 0 ? (
                    <p className="text-blue-500/70 text-sm">No in-development blogs found</p>
                  ) : (
                    <>
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full table-fixed text-left text-sm">
                          <colgroup>
                            <col className="w-[40%]" />
                            <col className="w-[20%]" />
                            <col className="w-[25%]" />
                            <col className="w-[15%]" />
                          </colgroup>
                          <thead className="border-b border-blue-500/30">
                            <tr className="text-blue-500">
                              <th className="pb-2 px-3">TITLE</th>
                              <th className="pb-2 px-3">STATUS</th>
                              <th className="pb-2 px-3">CATEGORY</th>
                              <th className="pb-2 px-3">ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {blogItems.map((item, index) => (
                              <motion.tr
                                key={item.slug}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-blue-500/10 hover:bg-blue-500/10 cursor-pointer"
                                onClick={() => handleRowNavigate(item.slug)}
                                onKeyDown={(event) => handleRowKeyDown(event, item.slug)}
                                tabIndex={0}
                                role="button"
                              >
                                <td className="py-3 px-3 text-blue-500">{item.title}</td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-yellow-500" />
                                    <span className="text-yellow-500 text-xs">{item.status || "In Progress"}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-blue-500/70 text-xs">
                                  {Array.isArray(item.category) ? item.category.join(", ") : item.category || "N/A"}
                                </td>
                                <td className="py-3 px-3">
                                  <span className="text-blue-400 underline text-xs">VIEW</span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="md:hidden space-y-3">
                        {blogItems.map((item, index) => (
                          <Link key={item.slug} href={`/system-error/${item.slug}`} className="block">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border border-blue-500/20 bg-black/30 p-4"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-400" />
                                  <span className="text-blue-500 uppercase text-xs font-bold">BLOG</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-yellow-500" />
                                  <span className="text-yellow-500 text-xs">{item.status || "In Progress"}</span>
                                </div>
                              </div>
                              <h3 className="text-blue-500 font-bold mb-2">{item.title}</h3>
                              {item.category && (
                                <p className="text-blue-500/70 text-xs mb-3">
                                  {Array.isArray(item.category) ? item.category.join(", ") : item.category}
                                </p>
                              )}
                              <span className="text-blue-400 underline text-sm">VIEW DETAILS →</span>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            </motion.div>
          )}
          </div>
        </div>
      </div>

    </div>
  )
}
