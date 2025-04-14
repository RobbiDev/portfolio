"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Linkedin, Github, Send, Lock, Clock } from "lucide-react"
import PageHeader from "@/components/page-header"
import GridBackground from "@/components/grid-background"
import Footer from "@/components/footer"

// Interface for submission tracking
interface SubmissionTracker {
  count: number
  timestamps: number[]
  lockedUntil: number | null
}

// Constants
const MAX_SUBMISSIONS = 3
const LOCKOUT_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submissionTracker, setSubmissionTracker] = useState<SubmissionTracker>({
    count: 0,
    timestamps: [],
    lockedUntil: null,
  })
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  // Load submission history from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("contactSubmissions")
    if (storedData) {
      const parsedData: SubmissionTracker = JSON.parse(storedData)

      // Check if lockout period has expired
      if (parsedData.lockedUntil && parsedData.lockedUntil < Date.now()) {
        // Reset if lockout period has passed
        const resetData: SubmissionTracker = {
          count: 0,
          timestamps: [],
          lockedUntil: null,
        }
        setSubmissionTracker(resetData)
        localStorage.setItem("contactSubmissions", JSON.stringify(resetData))
      } else {
        setSubmissionTracker(parsedData)
      }
    }
  }, [])

  // Update countdown timer if locked out
  useEffect(() => {
    if (!submissionTracker.lockedUntil) return

    const updateTimer = () => {
      const now = Date.now()
      const remaining = submissionTracker.lockedUntil! - now

      if (remaining <= 0) {
        // Lockout period has ended
        const resetData: SubmissionTracker = {
          count: 0,
          timestamps: [],
          lockedUntil: null,
        }
        setSubmissionTracker(resetData)
        localStorage.setItem("contactSubmissions", JSON.stringify(resetData))
        setTimeRemaining("")
        return
      }

      // Format remaining time
      const hours = Math.floor(remaining / (60 * 60 * 1000))
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
      const seconds = Math.floor((remaining % (60 * 1000)) / 1000)

      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
    }

    // Update immediately and then every second
    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [submissionTracker.lockedUntil])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is locked out
    if (submissionTracker.lockedUntil && submissionTracker.lockedUntil > Date.now()) {
      return // User is locked out, don't process submission
    }

    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        message: "",
      })

      // Update submission tracker
      const now = Date.now()
      const newTimestamps = [...submissionTracker.timestamps, now]
      const newCount = submissionTracker.count + 1

      // Check if this submission exceeds the limit
      let newLockedUntil = submissionTracker.lockedUntil
      if (newCount >= MAX_SUBMISSIONS) {
        newLockedUntil = now + LOCKOUT_DURATION
      }

      const newTracker: SubmissionTracker = {
        count: newCount,
        timestamps: newTimestamps,
        lockedUntil: newLockedUntil,
      }

      setSubmissionTracker(newTracker)
      localStorage.setItem("contactSubmissions", JSON.stringify(newTracker))
    }, 1500)
  }

  const isLockedOut = submissionTracker.lockedUntil && submissionTracker.lockedUntil > Date.now()
  const submissionsLeft = MAX_SUBMISSIONS - submissionTracker.count

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <PageHeader
          title="CONTACT"
          subtitle="Have a project in mind or want to discuss potential opportunities? I'm always open to new challenges and collaborations."
        />

        <div className="grid gap-12 md:grid-cols-2 mt-16">
          <div className="space-y-8">
            <div className="inline-block bg-black/30 backdrop-blur-sm border border-lime-400/20 px-3 py-1 text-xs font-mono text-lime-400">
              GET IN TOUCH
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
              LET'S <span className="text-lime-400">CONNECT</span>
            </h2>
            <p className="text-neutral-400">
              Whether you have a project in mind, a question about my work, or just want to say hello, I'd love to hear
              from you. Fill out the form or reach out through one of the channels below.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-3">
                  <Mail className="h-6 w-6 text-lime-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Email</p>
                  <a href="mailto:me@robbyj.dev" target="_blank" className="hover:text-lime-400 transition-colors">
                    me@robbyj.dev
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-3">
                  <Linkedin className="h-6 w-6 text-lime-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">LinkedIn</p>
                  <a
                    href="https://linkedin.com/in/robby-johnson/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 transition-colors"
                  >
                    linkedin.com/in/robby-johnson/
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-3">
                  <Github className="h-6 w-6 text-lime-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400">GitHub</p>
                  <a
                    href="https://github.com/RobbiDev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-lime-400 transition-colors"
                  >
                    github.com/RobbiDev
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6">
              <h3 className="font-bold text-xl mb-4">Location</h3>
              <p className="text-neutral-400 mb-2">Based in Greensboro, North Carolina</p>
              <p className="text-neutral-400">Available for remote work worldwide</p>
            </div>

            {/* Submission Limit Info */}
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-5 w-5 text-lime-400" />
                <h3 className="font-bold text-lg">Submission Limit</h3>
              </div>
              <p className="text-neutral-400 mb-3">
                To prevent spam, there is a limit of {MAX_SUBMISSIONS} form submissions per 24-hour period.
              </p>
              {isLockedOut ? (
                <div className="flex items-center gap-2 text-amber-400 font-mono text-sm">
                  <Lock className="h-4 w-4" />
                  <span>Locked: Try again in {timeRemaining}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lime-400 font-mono text-sm">
                  <span>Submissions remaining: {submissionsLeft}</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6 md:p-8">
            <h3 className="font-bold text-xl mb-6">SEND A MESSAGE</h3>
            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="inline-flex items-center justify-center bg-lime-400 text-black p-4 rounded-full mx-auto">
                  <Send className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold">Message Sent!</h4>
                <p className="text-neutral-400">
                  Thank you for reaching out. I'll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-lime-400/20 hover:bg-black/50 px-4 py-2 font-medium transition-colors mt-4"
                  disabled={isLockedOut}
                >
                  {isLockedOut ? (
                    <>
                      <Lock className="h-4 w-4" />
                      Locked for {timeRemaining}
                    </>
                  ) : (
                    "Send Another Message"
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-mono mb-2">
                    NAME [+]
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-neutral-800 p-3 text-white focus:border-lime-400 focus:outline-none"
                    placeholder="Your name"
                    disabled={isLockedOut}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-mono mb-2">
                    EMAIL [+]
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-neutral-800 p-3 text-white focus:border-lime-400 focus:outline-none"
                    placeholder="Your email"
                    disabled={isLockedOut}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-mono mb-2">
                    MESSAGE [+]
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    value={formState.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-black border border-neutral-800 p-3 text-white focus:border-lime-400 focus:outline-none"
                    placeholder="Your message"
                    disabled={isLockedOut}
                  ></textarea>
                </div>

                {isLockedOut ? (
                  <div className="w-full bg-neutral-700 text-neutral-300 py-3 font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock className="h-4 w-4" />
                    LOCKED FOR {timeRemaining}
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || isLockedOut}
                    className="w-full bg-lime-400 hover:bg-lime-300 text-black py-3 font-medium transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-700 disabled:text-neutral-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        SENDING...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE <Send className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}

                {/* Submission counter */}
                {!isLockedOut && (
                  <div className="text-xs text-neutral-400 text-center">
                    {submissionsLeft} of {MAX_SUBMISSIONS} submissions remaining in 24-hour period
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
