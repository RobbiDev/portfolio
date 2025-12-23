"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  subtitle: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-block bg-black/30 backdrop-blur-sm border border-pallete-main/20 px-3 py-1 text-xs font-mono text-pallete-main mb-4"
      >
        {title}
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-neutral-400 text-lg"
      >
        {subtitle}
      </motion.p>
    </div>
  )
}
