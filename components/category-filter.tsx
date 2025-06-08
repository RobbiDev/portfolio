"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"
import type { Category } from "@/lib/types"

interface CategoryFilterProps {
  categories: Category[]
  currentCategory?: string
  basePath: string
  title?: string
}

export default function CategoryFilter({
  categories,
  currentCategory,
  basePath,
  title = "Categories",
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-neutral-800 hover:border-lime-400/30 px-4 py-2 font-medium transition-colors mb-6"
      >
        <Filter className="h-4 w-4" />
        {title}
        {currentCategory && (
          <span className="bg-lime-400 text-black px-2 py-0.5 text-xs rounded">
            {categories.find((cat) => cat.slug === currentCategory)?.name || currentCategory}
          </span>
        )}
      </button>

      {/* Desktop filter */}
      <div className="hidden md:block mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-lime-400"></div>
          {title}
        </h3>

        <div className="flex flex-wrap gap-2">
          <Link
            href={basePath}
            className={`px-3 py-1 text-sm font-medium transition-colors border ${
              !currentCategory
                ? "bg-lime-400 text-black border-lime-400"
                : "bg-black/30 text-neutral-300 border-neutral-800 hover:border-lime-400/30 hover:text-lime-400"
            }`}
          >
            All
          </Link>

          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`${basePath}/category/${category.slug}`}
              className={`px-3 py-1 text-sm font-medium transition-colors border ${
                currentCategory === category.slug
                  ? "bg-lime-400 text-black border-lime-400"
                  : "bg-black/30 text-neutral-300 border-neutral-800 hover:border-lime-400/30 hover:text-lime-400"
              }`}
            >
              {category.name} ({category.count})
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile filter dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden absolute top-full left-0 right-0 z-20 bg-black/95 backdrop-blur-sm border border-neutral-800 p-4 mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{title}</h3>
            <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            <Link
              href={basePath}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 text-sm font-medium transition-colors ${
                !currentCategory ? "bg-lime-400 text-black" : "text-neutral-300 hover:text-lime-400"
              }`}
            >
              All
            </Link>

            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`${basePath}/category/${category.slug}`}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-sm font-medium transition-colors ${
                  currentCategory === category.slug ? "bg-lime-400 text-black" : "text-neutral-300 hover:text-lime-400"
                }`}
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
