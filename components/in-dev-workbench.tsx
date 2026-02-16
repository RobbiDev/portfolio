"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Folder, Github } from "lucide-react"
import Markdown from "@/components/markdown"
import InDevEditor, { IN_DEV_FIELD_DEFINITIONS, type InDevEditorValues, type InDevFieldKey } from "@/components/in-dev-editor"
import InDevWorkbenchLayout from "@/components/in-dev-workbench-layout"

interface InDevWorkbenchProps {
  initial: {
    title: string
    type: "project" | "blog"
    summary?: string
    status?: string
    category?: string | string[]
    technologies?: string[]
    content: string
    coverImage?: string
    coverImageRaw?: string
    coverImageColor?: string
    author?: string
    tags?: string[]
    date?: string
    client?: string
    timeline?: string
    role?: string
    liveUrl?: string
    githubUrl?: string
    features?: string[]
  }
}

const parseCommaList = (value: string) =>
  value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)

const parseLineList = (value: string) =>
  value
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean)

const createThumbnailSvg = (coverImageColor?: string) => {
  const parseHex = (value?: string) => {
    if (!value) return null
    const trimmed = value.trim()
    const match = trimmed.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    if (!match) return null

    const hex = match[1]
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16)
      const g = parseInt(hex[1] + hex[1], 16)
      const b = parseInt(hex[2] + hex[2], 16)
      return { r, g, b }
    }

    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    }
  }

  const toRgb = (color: { r: number; g: number; b: number }) =>
    `rgb(${color.r}, ${color.g}, ${color.b})`

  const base = parseHex(coverImageColor)
  const edge = base ? toRgb(base) : "rgb(16, 16, 16)"
  const center = "rgb(255, 255, 255)"

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="wave" x1="0%" y1="15%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="${center}" stop-opacity="0" />
      <stop offset="34%" stop-color="${center}" stop-opacity="0.7" />
      <stop offset="52%" stop-color="${center}" stop-opacity="1" />
      <stop offset="72%" stop-color="${center}" stop-opacity="0.5" />
      <stop offset="100%" stop-color="${center}" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="waveSoft" x1="10%" y1="95%" x2="95%" y2="5%">
      <stop offset="0%" stop-color="${edge}" stop-opacity="0.15" />
      <stop offset="50%" stop-color="${edge}" stop-opacity="0" />
      <stop offset="100%" stop-color="${edge}" stop-opacity="0.1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="${edge}" />
  <rect width="1200" height="675" fill="url(#wave)" />
  <rect width="1200" height="675" fill="url(#waveSoft)" />
</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const ALL_FIELDS = Object.keys(IN_DEV_FIELD_DEFINITIONS) as InDevFieldKey[]

const buildInitialValues = (initial: InDevWorkbenchProps["initial"]) => ({
  title: initial.title || "",
  content: initial.content || "",
  summary: initial.summary || "",
  status: initial.status || "",
  category: Array.isArray(initial.category) ? initial.category.join(", ") : initial.category || "",
  technologies: (initial.technologies || []).join(", "),
  coverImageColor: initial.coverImageColor || "",
  author: initial.author || "",
  tags: (initial.tags || []).join(", "),
  date: initial.date || "",
  client: initial.client || "",
  timeline: initial.timeline || "",
  role: initial.role || "",
  liveUrl: initial.liveUrl || "",
  githubUrl: initial.githubUrl || "",
  features: (initial.features || []).join("\n"),
})

const buildInitialFields = (initial: InDevWorkbenchProps["initial"], allowCoverImageColor: boolean) => {
  const fieldSet = new Set<InDevFieldKey>()
  const seeded: Record<InDevFieldKey, boolean> = {
    summary: Boolean(initial.summary),
    status: Boolean(initial.status),
    category: Boolean(initial.category && (Array.isArray(initial.category) ? initial.category.length : initial.category)),
    technologies: Boolean(initial.technologies && initial.technologies.length),
    author: Boolean(initial.author),
    tags: Boolean(initial.tags && initial.tags.length),
    date: Boolean(initial.date),
    coverImageColor: Boolean(initial.coverImageColor) && allowCoverImageColor,
    client: Boolean(initial.client),
    timeline: Boolean(initial.timeline),
    role: Boolean(initial.role),
    liveUrl: Boolean(initial.liveUrl),
    githubUrl: Boolean(initial.githubUrl),
    features: Boolean(initial.features && initial.features.length),
  }

  ALL_FIELDS.forEach((field) => {
    if (seeded[field]) {
      fieldSet.add(field)
    }
  })

  return Array.from(fieldSet)
}

export default function InDevWorkbench({ initial }: InDevWorkbenchProps) {
  const allowCoverImageColor = !initial.coverImageRaw
  const storageKey = useMemo(
    () => `in-dev-workbench:${initial.type}:${initial.title || "untitled"}`,
    [initial.type, initial.title]
  )

  const seededValues = useMemo(() => buildInitialValues(initial), [initial])
  const seededFields = useMemo(() => buildInitialFields(initial, allowCoverImageColor), [initial, allowCoverImageColor])

  const [values, setValues] = useState<InDevEditorValues>(seededValues)
  const [activeFields, setActiveFields] = useState<InDevFieldKey[]>(seededFields)

  useEffect(() => {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as {
        values?: Partial<InDevEditorValues>
        activeFields?: InDevFieldKey[]
      }

      if (parsed?.values) {
        const nextValues = { ...seededValues, ...parsed.values }
        if (!allowCoverImageColor) {
          nextValues.coverImageColor = seededValues.coverImageColor
        }
        setValues(nextValues)
      } else {
        setValues(seededValues)
      }

      if (Array.isArray(parsed?.activeFields)) {
        const filtered = parsed.activeFields.filter(
          (field) => ALL_FIELDS.includes(field) && (field !== "coverImageColor" || allowCoverImageColor)
        )
        setActiveFields(filtered.length ? filtered : seededFields)
      } else {
        setActiveFields(seededFields)
      }
    } catch (error) {
      setValues(seededValues)
      setActiveFields(seededFields)
    }
  }, [allowCoverImageColor, seededFields, seededValues, storageKey])

  const handleFieldChange = (field: keyof InDevEditorValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddField = (field: InDevFieldKey) => {
    if (field === "coverImageColor" && !allowCoverImageColor) return
    setActiveFields((prev) => (prev.includes(field) ? prev : [...prev, field]))
  }

  const handleRemoveField = (field: InDevFieldKey) => {
    setActiveFields((prev) => prev.filter((entry) => entry !== field))
    setValues((prev) => ({ ...prev, [field]: "" }))
  }

  const handleSaveProgress = () => {
    if (typeof window === "undefined") return
    const payload = {
      values,
      activeFields,
      savedAt: new Date().toISOString(),
    }
    window.localStorage.setItem(storageKey, JSON.stringify(payload))
  }

  const handleDeleteProgress = () => {
    if (typeof window === "undefined") return
    const shouldDelete = window.confirm("Delete local changes and reset the workbench?")
    if (!shouldDelete) return

    window.localStorage.removeItem(storageKey)
    setValues(seededValues)
    setActiveFields(seededFields)
  }

  const availableFields = ALL_FIELDS.filter((field) => (field === "coverImageColor" ? allowCoverImageColor : true))
  const inactiveFields = availableFields.filter((field) => !activeFields.includes(field))

  const markdownOutput = useMemo(() => {
    const metadata: Record<string, unknown> = {
      title: values.title.trim(),
    }

    if (initial.type === "blog") {
      metadata.type = "blog"
    }

    if (initial.coverImageRaw) {
      metadata.coverImage = initial.coverImageRaw
    }

    if (activeFields.includes("summary") && values.summary.trim()) metadata.summary = values.summary.trim()
    if (activeFields.includes("status") && values.status.trim()) metadata.status = values.status.trim()

    if (activeFields.includes("category")) {
      const categoryList = parseCommaList(values.category)
      if (categoryList.length === 1) metadata.category = categoryList[0]
      if (categoryList.length > 1) metadata.category = categoryList
    }

    if (activeFields.includes("technologies")) {
      const techList = parseCommaList(values.technologies)
      if (techList.length > 0) metadata.technologies = techList
    }

    if (activeFields.includes("coverImageColor") && values.coverImageColor.trim()) {
      metadata.coverImageColor = values.coverImageColor.trim()
    } else if (!allowCoverImageColor && initial.coverImageColor) {
      metadata.coverImageColor = initial.coverImageColor
    }

    if (activeFields.includes("author") && values.author.trim()) metadata.author = values.author.trim()

    if (activeFields.includes("tags")) {
      const tagList = parseCommaList(values.tags)
      if (tagList.length > 0) metadata.tags = tagList
    }

    if (activeFields.includes("date") && values.date.trim()) metadata.date = values.date.trim()
    if (activeFields.includes("client") && values.client.trim()) metadata.client = values.client.trim()
    if (activeFields.includes("timeline") && values.timeline.trim()) metadata.timeline = values.timeline.trim()
    if (activeFields.includes("role") && values.role.trim()) metadata.role = values.role.trim()
    if (activeFields.includes("liveUrl") && values.liveUrl.trim()) metadata.liveUrl = values.liveUrl.trim()
    if (activeFields.includes("githubUrl") && values.githubUrl.trim()) metadata.githubUrl = values.githubUrl.trim()

    if (activeFields.includes("features")) {
      const featuresList = parseLineList(values.features)
      if (featuresList.length > 0) metadata.features = featuresList
    }

    return `===\n${JSON.stringify(metadata, null, 2)}\n===\n\n${values.content.trim()}\n`
  }, [activeFields, initial.coverImageRaw, initial.type, values])

  const coverImage = useMemo(() => {
    if (initial.coverImageRaw) {
      return initial.coverImage || initial.coverImageRaw
    }

    return createThumbnailSvg(values.coverImageColor || initial.coverImageColor)
  }, [initial.coverImage, initial.coverImageColor, initial.coverImageRaw, values.coverImageColor])

  const isInlineCover = typeof coverImage === "string" && coverImage.startsWith("data:")
  const coverTitleBg = values.coverImageColor || initial.coverImageColor || "rgb(16, 16, 16)"

  const categories = parseCommaList(values.category)
  const techList = parseCommaList(values.technologies)
  const tagList = parseCommaList(values.tags)
  const featuresList = parseLineList(values.features)

  const formattedDate = (() => {
    if (!values.date) return ""
    const parsed = new Date(values.date)
    if (Number.isNaN(parsed.getTime())) return ""
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })()

  return (
    <InDevWorkbenchLayout
      topAnchorId="in-dev-back-link"
      editor={
        <InDevEditor
          type={initial.type}
          values={values}
          activeFields={activeFields}
          inactiveFields={inactiveFields}
          onFieldChange={handleFieldChange}
          onAddField={handleAddField}
          onRemoveField={handleRemoveField}
          markdownOutput={markdownOutput}
          allowCoverImageColor={allowCoverImageColor}
          thumbnailUrl={coverImage}
          thumbnailOverlayColor={coverTitleBg}
          onSaveProgress={handleSaveProgress}
          onDeleteProgress={handleDeleteProgress}
        />
      }
    >
      <div className="border border-blue-500/40 bg-black/70 p-6 md:p-8">

        <div className="flex items-center justify-between border-b border-blue-500/30 pb-3 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            In-Dev Preview
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500/60"></span>
            <span className="h-2 w-2 rounded-full bg-blue-500/40"></span>
            <span className="h-2 w-2 rounded-full bg-blue-500/20"></span>
          </div>
        </div>

        <div className="grid gap-12">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                {activeFields.includes("category") && categories.length > 0 ? (
                  categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center gap-2 border border-blue-500/30 bg-black/50 px-3 py-1 text-xs uppercase tracking-wide text-blue-400"
                    >
                      <Folder className="h-3 w-3" />
                      {category}
                    </span>
                  ))
                ) : (
                  <span className="text-xs uppercase text-blue-500/60">Uncategorized</span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-blue-500">
                {values.title}
              </h1>

              {activeFields.includes("summary") && values.summary && (
                <p className="text-blue-500/70 text-lg">{values.summary}</p>
              )}

              <div className="flex flex-wrap gap-4">
                {activeFields.includes("liveUrl") && values.liveUrl && (
                  <Link
                    href={values.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-500/80 hover:bg-blue-500 text-black px-4 py-2 text-sm font-medium transition-colors"
                  >
                    VIEW LIVE <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                {activeFields.includes("githubUrl") && values.githubUrl && (
                  <Link
                    href={values.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-blue-500/30 bg-black/40 hover:bg-black/60 px-4 py-2 text-sm font-medium text-blue-300 transition-colors"
                  >
                    VIEW CODE <Github className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>

            <div className="relative aspect-video bg-black/60 border border-blue-500/30 overflow-hidden">
              <Image src={coverImage} alt={values.title} fill className="object-cover" unoptimized={isInlineCover} />
              {isInlineCover && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="font-marker text-white px-8 py-4 text-3xl md:text-4xl uppercase"
                    style={{ backgroundColor: coverTitleBg }}
                  >
                    {values.title}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-12 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-8 order-2 xl:order-1">
              {values.content && (
                <div className="prose max-w-none text-blue-200">
                  <Markdown content={values.content} blockquoteClassName="border-blue-400 text-blue-300/80" />
                </div>
              )}
            </div>

            <div className="space-y-8 order-1 xl:order-2">
              <div className="border border-blue-500/30 bg-black/60 p-5">
                <h2 className="text-lg font-bold text-blue-400 mb-4">Project Details</h2>
                <div className="space-y-4 text-sm">
                  {activeFields.includes("client") && values.client && (
                    <div>
                      <h3 className="text-xs uppercase text-blue-400">Client</h3>
                      <p className="text-blue-200">{values.client}</p>
                    </div>
                  )}
                  {activeFields.includes("timeline") && values.timeline && (
                    <div>
                      <h3 className="text-xs uppercase text-blue-400">Timeline</h3>
                      <p className="text-blue-200">{values.timeline}</p>
                    </div>
                  )}
                  {activeFields.includes("role") && values.role && (
                    <div>
                      <h3 className="text-xs uppercase text-blue-400">Role</h3>
                      <p className="text-blue-200">{values.role}</p>
                    </div>
                  )}
                  {activeFields.includes("author") && values.author && (
                    <div>
                      <h3 className="text-xs uppercase text-blue-400">Author</h3>
                      <p className="text-blue-200">{values.author}</p>
                    </div>
                  )}
                  {activeFields.includes("category") && categories.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase text-blue-400">Category</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <span key={category} className="text-blue-300">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeFields.includes("date") && formattedDate && (
                    <div>
                      <h3 className="text-xs uppercase text-blue-400">Date</h3>
                      <p className="text-blue-200">{formattedDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {activeFields.includes("technologies") && techList.length > 0 && (
                <div className="border border-blue-500/30 bg-black/60 p-5">
                  <h2 className="text-lg font-bold text-blue-400 mb-4">Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {techList.map((tech) => (
                      <span key={tech} className="text-xs bg-black/50 border border-blue-500/20 px-2 py-1 text-blue-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeFields.includes("features") && featuresList.length > 0 && (
                <div className="border border-blue-500/30 bg-black/60 p-5">
                  <h2 className="text-lg font-bold text-blue-400 mb-4">Key Features</h2>
                  <ul className="space-y-2 text-blue-200">
                    {featuresList.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-2 h-2 w-2 rounded-full bg-blue-500"></span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeFields.includes("tags") && tagList.length > 0 && (
                <div className="border border-blue-500/30 bg-black/60 p-5">
                  <h2 className="text-lg font-bold text-blue-400 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {tagList.map((tag) => (
                      <span key={tag} className="text-xs border border-blue-500/30 px-2 py-1 text-blue-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </InDevWorkbenchLayout>
  )
}
