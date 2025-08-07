"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Network, Code, Server, ExternalLink, Shield, Settings, MonitorSpeaker } from "lucide-react"
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
          IT PROFESSIONAL
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6"
        >
          <GlitchHeading text="ROBERT JOHNSON" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-neutral-400 text-lg max-w-3xl"
        >
          Specializing in networking infrastructure, software engineering, and system control technologies.
        </motion.p>

        <div className="grid gap-16 mt-16">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Enhanced Hero Section */}
            <div className="bg-black/40 backdrop-blur-md border border-neutral-800 p-8 md:p-12 relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-lime-400/20 rounded-full"
                    style={{
                      width: Math.random() * 4 + 1,
                      height: Math.random() * 4 + 1,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block bg-black/30 backdrop-blur-sm border border-lime-400/20 px-3 py-1 text-xs font-mono text-lime-400 mb-6"
                >
                  IT SYSTEMS SPECIALIST
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl md:text-4xl font-bold tracking-tighter mb-6"
                >
                  BUILDING RELIABLE <span className="text-lime-400">IT SOLUTIONS</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-neutral-400"
                    >
                      I'm an IT professional with expertise in network infrastructure, software engineering, and system
                      control technologies. My focus is on designing and implementing reliable IT solutions that meet
                      business needs while maintaining security and performance.
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-neutral-400"
                    >
                      With a background spanning enterprise networking and industrial systems, I bring a comprehensive
                      approach to IT challenges, combining technical knowledge with practical problem-solving skills.
                    </motion.p>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center gap-3 p-4 bg-black/30 border border-neutral-800"
                    >
                      <Network className="h-6 w-6 text-lime-400" />
                      <div>
                        <div className="font-mono text-sm text-lime-400">SPECIALIZATION</div>
                        <div className="text-xl font-bold">Networking</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 }}
                      className="flex items-center gap-3 p-4 bg-black/30 border border-neutral-800"
                    >
                      <Server className="h-6 w-6 text-lime-400" />
                      <div>
                        <div className="font-mono text-sm text-lime-400">EXPERTISE</div>
                        <div className="text-xl font-bold">System Control</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 }}
                      className="flex items-center gap-3 p-4 bg-black/30 border border-neutral-800"
                    >
                      <Shield className="h-6 w-6 text-lime-400" />
                      <div>
                        <div className="font-mono text-sm text-lime-400">FOCUS</div>
                        <div className="text-xl font-bold">Security & Reliability</div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="mt-8"
                >
                  <Link
                    href="/resume.pdf"
                    className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-300 text-black px-6 py-3 font-medium transition-colors group"
                  >
                    DOWNLOAD RESUME
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </div>

            
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
              TECHNICAL EXPERTISE
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tighter"
            >
              CORE <GlitchHeading text="COMPETENCIES" />
            </motion.h2>

            <motion.div
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SkillCard
                icon={<Network className="h-5 w-5 text-black" />}
                title="Networking"
                skills={[
                  "Cisco & Juniper",
                  "VLAN & MPLS",
                  "BGP & OSPF",
                  "Network Security",
                  "SD-WAN",
                  "Troubleshooting",
                ]}
              />

              <SkillCard
                icon={<Code className="h-5 w-5 text-black" />}
                title="Software Engineering"
                skills={[
                  "Python & C++",
                  "System Architecture",
                  "API Development",
                  "Database Design",
                  "Version Control",
                  "Testing & Debugging",
                ]}
              />

              <SkillCard
                icon={<MonitorSpeaker className="h-5 w-5 text-black" />}
                title="System Control"
                skills={[
                  "SCADA Systems",
                  "PLC Programming",
                  "Industrial Protocols",
                  "Process Automation",
                  "HMI Development",
                  "Control Systems",
                ]}
              />

              <SkillCard
                icon={<Server className="h-5 w-5 text-black" />}
                title="Infrastructure"
                skills={[
                  "VMware & Hyper-V",
                  "Linux & Windows Server",
                  "Cloud Services",
                  "Backup Solutions",
                  "Monitoring Tools",
                  "Disaster Recovery",
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
              HIGHLIGHTS
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tighter"
            >
              CAREER <GlitchHeading text="HIGHLIGHTS" />
            </motion.h2>

            <div className="space-y-8">
              {experiences.map((experience, index) => (
                <TimelineItem key={index} experience={experience} index={index} />
              ))}
            </div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold tracking-tighter"
            >
              EDUCATIONAL <GlitchHeading text="HIGHLIGHTS" />
            </motion.h2>

            <div className="space-y-8">
              {education.map((edu, index) => (
                <TimelineItem key={index} experience={edu} index={index} />
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
              I'm available to discuss IT projects, infrastructure challenges, or opportunities to optimize your
              systems.
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
    title: "IT & Network/Controls Engineer",
    company: "IMAFLEX USA",
    location: "THOMASVILLE, NC",
    period: "MAY 2025 – PRESENT",
    description:
      "Manage IT infrastructure and network systems in a manufacturing environment. Support PLC control systems and assist with industrial automation. Troubleshoot production tech issues and lead integration of new control systems.",
    technologies: [
      "PLC Systems",
      "Network Infrastructure",
      "Industrial Automation",
      "System Integration",
      "Troubleshooting",
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "VIRTUOLLIS",
    location: "REMOTE (ONTARIO, CANADA)",
    period: "JAN 2024 – APR 2024",
    description:
      "Assisted in developing IT and printing solutions for client businesses. Helped define software requirements and worked with internet protocol systems. Collaborated on frontend tools for automation and client service apps.",
    technologies: [
      "JavaScript",
      "Internet Protocol (IP)",
      "Requirement Analysis",
      "Frontend Development",
      "Automation Tools",
    ],
  },
  {
    title: "BOH Supervisor & IT Specialist",
    company: "CHICK-FIL-A",
    location: "GRANDOVER VILLAGE, NC",
    period: "JUN 2023 – NOV 2023",
    description:
      "Managed BOH operations and food prep logistics. Handled restaurant IT issues including POS and hardware. Created internal time-tracking systems for kitchen task compliance.",
    technologies: [
      "Team Leadership",
      "Microsoft Word",
      "Hardware Troubleshooting",
      "Food Prep Systems",
      "Time Tracking Tools",
    ],
  },
];

const education = [
  {
    title: "IT & Network/Controls Engineer",
    company: "GUILFORD TECHNICAL COMMUNITY COLLEGE",
    location: "JAMESTOWN, NC",
    period: "MAY 2025 – PRESENT",
    description:
      "Manage IT infrastructure and network systems in a manufacturing environment. Support PLC control systems and assist with industrial automation. Troubleshoot production tech issues and lead integration of new control systems.",
    technologies: [
      "PLC Systems",
      "Network Infrastructure",
      "Industrial Automation",
      "System Integration",
      "Troubleshooting",
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "Virtuollis",
    location: "JAMESTOWN, NC",
    period: "JAN 2024 – APR 2024",
    description:
      "Assisted in developing IT and printing solutions for client businesses. Helped define software requirements and worked with internet protocol systems. Collaborated on frontend tools for automation and client service apps.",
    technologies: [
      "JavaScript",
      "Internet Protocol (IP)",
      "Requirement Analysis",
      "Frontend Development",
      "Automation Tools",
    ],
  }
];