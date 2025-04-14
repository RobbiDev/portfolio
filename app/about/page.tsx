"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Code, User, Server, Lightbulb, ExternalLink } from "lucide-react"
import GridBackground from "@/components/grid-background"

// Glitch Text Component for Headings
const GlitchHeading = ({ text }: { text: string }) => {
  const [isHovering, setIsHovering] = useState(false)
  const [glitchText, setGlitchText] = useState(text)
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current)
      }
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovering(true)

    // Create glitching effect on text
    glitchIntervalRef.current = setInterval(() => {
      // Randomly decide if we should glitch the text
      if (Math.random() < 0.3) {
        // Create a glitched version of text
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`"
        let glitchedText = ""

        for (let i = 0; i < text.length; i++) {
          // 20% chance to replace a character with a random one
          if (Math.random() < 0.2) {
            glitchedText += chars[Math.floor(Math.random() * chars.length)]
          } else {
            glitchedText += text[i]
          }
        }

        setGlitchText(glitchedText)
      } else {
        setGlitchText(text)
      }
    }, 100)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (glitchIntervalRef.current) {
      clearInterval(glitchIntervalRef.current)
      setGlitchText(text)
    }
  }

  return (
    <div
      className="inline-block relative cursor-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Original text */}
      <span className={`transition-all duration-300 ${isHovering ? "text-blue-500" : ""}`}>{glitchText}</span>

      {/* Glitch effect layers - only visible on hover */}
      {isHovering && (
        <>
          <span
            className="absolute top-0 left-0 text-blue-500 opacity-70"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
              transform: `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`,
              textShadow: "1px 0 1px rgba(255,0,0,0.5)",
            }}
          >
            {glitchText}
          </span>
          <span
            className="absolute top-0 left-0 text-blue-400 opacity-70"
            style={{
              clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)",
              transform: `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 2}px)`,
              textShadow: "-1px 0 1px rgba(0,255,255,0.5)",
            }}
          >
            {glitchText}
          </span>
        </>
      )}
    </div>
  )
}

// Interactive Skill Card Component
const SkillCard = ({ icon, title, skills }: { icon: React.ReactNode; title: string; skills: string[] }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6 overflow-hidden relative"
      whileHover={{
        scale: 1.02,
        borderColor: "rgba(59, 130, 246, 0.5)",
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background grid lines animation */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        {isHovered &&
          Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-500/30 h-[1px] w-full"
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 0.2,
              }}
              style={{ top: `${i * 25}%` }}
            />
          ))}
      </div>

      <div className="flex items-center gap-3 mb-4 relative z-10">
        <motion.div
          className={`bg-lime-400 p-2 rounded-full transition-colors duration-300 ${isHovered ? "bg-blue-500" : ""}`}
          animate={isHovered ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="font-bold text-xl">{title}</h3>
      </div>

      <ul className="space-y-2 text-neutral-400 relative z-10">
        {skills.map((skill, index) => (
          <motion.li
            key={index}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`h-1 w-1 rounded-full ${isHovered ? "bg-blue-500" : "bg-lime-400"}`}
              animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
              transition={{ duration: 0.5, repeat: isHovered ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" }}
            />
            {skill}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

// Interactive Timeline Item Component
const TimelineItem = ({ experience, index }: { experience: any; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6 md:p-8 grid md:grid-cols-[200px_1fr] gap-6 relative overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated highlight on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-blue-500/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Animated border on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              className="absolute top-0 left-0 h-[2px] bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[2px] bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3 }}
            />
          </>
        )}
      </AnimatePresence>

      <div>
        <div className="text-xs font-mono text-neutral-400">{experience.period}</div>
        <div className="font-bold text-lg mt-1">{experience.company}</div>
        <div
          className={`font-mono text-sm transition-colors duration-300 ${isHovered ? "text-blue-500" : "text-lime-400"}`}
        >
          {experience.location}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xl mb-3">{experience.title}</h3>
        <p className="text-neutral-400 mb-4">{experience.description}</p>
        <div className="flex flex-wrap gap-2">
          {experience.technologies.map((tech: string, techIndex: number) => (
            <motion.span
              key={techIndex}
              className={`text-xs bg-black/30 border transition-colors duration-300 ${
                isHovered ? "border-blue-500/30" : "border-neutral-800"
              } px-2 py-1 font-mono`}
              whileHover={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                y: -2,
              }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Interactive Profile Image Component
const ProfileImage = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative aspect-square md:aspect-auto md:h-[500px] bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden"
      whileHover={{ borderColor: "rgba(59, 130, 246, 0.5)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Image
        src="/future-code.png"
        alt="Developer portrait"
        fill
        className={`object-cover transition-all duration-700 ${isHovered ? "scale-110 filter hue-rotate-15" : ""}`}
      />

      {/* Overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

      {/* Scan line effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-blue-500/50"
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
          />
        </motion.div>
      )}

      {/* Data readout */}
      <div className="absolute bottom-4 left-4 right-4 font-mono text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isHovered ? "bg-blue-500" : "bg-lime-400"} animate-pulse`}></div>
          <motion.div
            animate={isHovered ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          >
            DEVELOPER PROFILE // {isHovered ? "SCANNING" : "SKILLS OPTIMIZED"}
          </motion.div>
        </div>
      </div>

      {/* Data points that appear on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[1, 2, 3, 4].map((_, i) => (
              <motion.div
                key={i}
                className="absolute font-mono text-[10px] bg-black/50 border border-blue-500/30 px-1 py-0.5 text-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + (i % 2) * 50}%`,
                }}
              >
                DATA_POINT_{i + 1}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AboutPage() {
  const { scrollYProgress } = useScroll()
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.5])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen">
      <GridBackground />

      {/* Animated data lines in background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {loaded &&
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-[1px] bg-blue-500/20"
              style={{
                width: "100%",
                top: `${30 + i * 20}%`,
                opacity: backgroundOpacity,
              }}
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{
                duration: 15,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 5,
              }}
            />
          ))}
      </div>

      <div className="relative z-10 container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block bg-black/30 backdrop-blur-sm border border-lime-400/20 px-3 py-1 text-xs font-mono text-lime-400 mb-4"
        >
          ABOUT ME
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6"
        >
          <GlitchHeading text="ABOUT ME" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-neutral-400 text-lg max-w-3xl"
        >
          Learn more about my background, skills, and approach to development.
        </motion.p>

        <div className="grid gap-16 mt-16">
          <motion.div
            className="grid gap-12 md:grid-cols-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ProfileImage />

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block bg-black/30 backdrop-blur-sm border border-lime-400/20 px-3 py-1 text-xs font-mono text-lime-400"
              >
                BIOGRAPHY
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-4xl font-bold tracking-tighter"
              >
                CRAFTING DIGITAL <span className="text-lime-400">EXPERIENCES</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-neutral-400"
              >
                I'm a passionate developer with expertise in creating modern, responsive web applications. With a strong
                foundation in both frontend and backend technologies, I bring ideas to life through clean code and
                thoughtful design.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-neutral-400"
              >
                My approach combines technical excellence with creative problem-solving, ensuring that every project I
                work on delivers exceptional results. I believe in continuous learning and staying up-to-date with the
                latest technologies and best practices.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-neutral-400"
              >
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
                or sharing my knowledge through writing and mentoring.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href="/resume.pdf"
                  className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-lime-400/20 hover:bg-black/50 hover:border-blue-500/50 px-4 py-2 font-medium transition-colors group"
                >
                  DOWNLOAD RESUME
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-black/30 backdrop-blur-sm border border-lime-400/20 px-3 py-1 text-xs font-mono text-lime-400"
            >
              SKILLS & EXPERTISE
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tighter"
            >
              TECHNICAL <GlitchHeading text="CAPABILITIES" />
            </motion.h2>

            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SkillCard
                icon={<Code className="h-5 w-5 text-black" />}
                title="Frontend"
                skills={["React & Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Redux & Zustand"]}
              />

              <SkillCard
                icon={<Server className="h-5 w-5 text-black" />}
                title="Backend"
                skills={[
                  "Node.js & Express",
                  "PostgreSQL & MongoDB",
                  "Prisma & Mongoose",
                  "GraphQL",
                  "REST API Design",
                ]}
              />

              <SkillCard
                icon={<User className="h-5 w-5 text-black" />}
                title="Design"
                skills={[
                  "UI/UX Design",
                  "Figma & Adobe XD",
                  "Responsive Design",
                  "Design Systems",
                  "Accessibility (WCAG)",
                ]}
              />

              <SkillCard
                icon={<Lightbulb className="h-5 w-5 text-black" />}
                title="Other"
                skills={[
                  "Git & GitHub",
                  "CI/CD Pipelines",
                  "Docker & Kubernetes",
                  "AWS & Vercel",
                  "Testing (Jest, Cypress)",
                ]}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block bg-black/30 backdrop-blur-sm border border-lime-400/20 px-3 py-1 text-xs font-mono text-lime-400"
            >
              EXPERIENCE
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tighter"
            >
              PROFESSIONAL <GlitchHeading text="JOURNEY" />
            </motion.h2>

            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <TimelineItem key={index} experience={experience} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Interactive CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-black/40 backdrop-blur-md border border-neutral-800 p-8 text-center mt-12"
          >
            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ready to <GlitchHeading text="COLLABORATE" />?
            </motion.h3>

            <motion.p
              className="text-neutral-400 max-w-2xl mx-auto mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-black px-6 py-3 font-medium transition-colors group"
              >
                GET IN TOUCH
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const experiences = [
  {
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "SAN FRANCISCO, CA",
    period: "2021 - PRESENT",
    description:
      "Led the development of the company's flagship product, a SaaS platform for data analytics. Implemented new features, improved performance, and mentored junior developers.",
    technologies: ["React", "TypeScript", "Next.js", "GraphQL", "Tailwind CSS"],
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions",
    location: "REMOTE",
    period: "2018 - 2021",
    description:
      "Developed and maintained multiple client projects, from e-commerce platforms to custom web applications. Worked closely with designers and product managers to deliver high-quality solutions.",
    technologies: ["Node.js", "Express", "MongoDB", "React", "Redux", "SCSS"],
  },
  {
    title: "Junior Web Developer",
    company: "Creative Agency",
    location: "NEW YORK, NY",
    period: "2016 - 2018",
    description:
      "Created responsive websites and interactive web applications for various clients. Collaborated with the design team to implement pixel-perfect interfaces.",
    technologies: ["JavaScript", "HTML", "CSS", "jQuery", "PHP", "WordPress"],
  },
]
