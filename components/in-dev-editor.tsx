"use client"

import { useState } from "react"
import { Copy, Download, Save, Plus, Trash2 } from "lucide-react"
import ThumbnailDownloadButton from "@/components/thumbnail-download"

export type InDevFieldKey =
  | "summary"
  | "status"
  | "category"
  | "technologies"
  | "author"
  | "tags"
  | "date"
  | "coverImageColor"
  | "client"
  | "timeline"
  | "role"
  | "liveUrl"
  | "githubUrl"
  | "features"

export const IN_DEV_FIELD_DEFINITIONS: Record<
  InDevFieldKey,
  {
    label: string
    kind: "text" | "textarea" | "comma" | "lines" | "date" | "url"
    placeholder?: string
    helper?: string
  }
> = {
  summary: { label: "Summary", kind: "textarea" },
  status: { label: "Status", kind: "text" },
  category: { label: "Category (comma separated)", kind: "comma" },
  technologies: { label: "Technologies (comma separated)", kind: "comma" },
  author: { label: "Author", kind: "text" },
  tags: { label: "Tags (comma separated)", kind: "comma" },
  date: { label: "Date", kind: "date", placeholder: "YYYY-MM-DD" },
  coverImageColor: { label: "Cover Image Color", kind: "text", placeholder: "#1f2937" },
  client: { label: "Client", kind: "text" },
  timeline: { label: "Timeline", kind: "text" },
  role: { label: "Role", kind: "text" },
  liveUrl: { label: "Live URL", kind: "url", placeholder: "https://" },
  githubUrl: { label: "GitHub URL", kind: "url", placeholder: "https://" },
  features: { label: "Features (one per line)", kind: "lines" },
}

export interface InDevEditorValues {
  title: string
  content: string
  summary: string
  status: string
  category: string
  technologies: string
  coverImageColor: string
  author: string
  tags: string
  date: string
  client: string
  timeline: string
  role: string
  liveUrl: string
  githubUrl: string
  features: string
}

interface InDevEditorProps {
  type: "project" | "blog"
  values: InDevEditorValues
  activeFields: InDevFieldKey[]
  inactiveFields: InDevFieldKey[]
  onFieldChange: (field: keyof InDevEditorValues, value: string) => void
  onAddField: (field: InDevFieldKey) => void
  onRemoveField: (field: InDevFieldKey) => void
  markdownOutput: string
  allowCoverImageColor: boolean
  thumbnailUrl?: string
  thumbnailOverlayColor?: string
  onSaveProgress: () => void
  onDeleteProgress: () => void
}

export default function InDevEditor({
  type,
  values,
  activeFields,
  inactiveFields,
  onFieldChange,
  onAddField,
  onRemoveField,
  markdownOutput,
  allowCoverImageColor,
  thumbnailUrl,
  thumbnailOverlayColor,
  onSaveProgress,
  onDeleteProgress,
}: InDevEditorProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pendingField, setPendingField] = useState<InDevFieldKey | "">("")

  const fileSlug = values.title.replace(/\s+/g, "-").toLowerCase() || "in-dev"

  const downloadMarkdown = () => {
    const blob = new Blob([markdownOutput], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${fileSlug}.md`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownOutput)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      setCopied(false)
    }
  }

  const handleSaveProgress = () => {
    onSaveProgress()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const renderFieldInput = (field: InDevFieldKey) => {
    if (field === "coverImageColor" && !allowCoverImageColor) {
      return null
    }

    const definition = IN_DEV_FIELD_DEFINITIONS[field]
    const value = values[field] ?? ""
    const showRemove = true

    const sharedClassName =
      "mt-2 w-full rounded-md bg-black/70 border border-blue-500/30 px-4 py-3 text-blue-200 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-blue-400/60 focus:border-blue-400/60"

    if (definition.kind === "textarea" || definition.kind === "lines") {
      return (
        <label key={field} className="text-sm text-blue-500/80">
          <span className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-blue-400">{definition.label}</span>
            {showRemove && (
              <button
                type="button"
                onClick={() => onRemoveField(field)}
                className="text-[11px] text-blue-400 hover:text-blue-300"
              >
                REMOVE
              </button>
            )}
          </span>
          <textarea
            value={value}
            onChange={(event) => onFieldChange(field, event.target.value)}
            rows={definition.kind === "lines" ? 6 : 4}
            className={sharedClassName}
          />
        </label>
      )
    }

    return (
      <label key={field} className="text-sm text-blue-500/80">
        <span className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-blue-400">{definition.label}</span>
          {showRemove && (
            <button
              type="button"
              onClick={() => onRemoveField(field)}
              className="text-[11px] text-blue-400 hover:text-blue-300"
            >
              REMOVE
            </button>
          )}
        </span>
        <input
          value={value}
          onChange={(event) => onFieldChange(field, event.target.value)}
          placeholder={definition.placeholder}
          className={sharedClassName}
        />
      </label>
    )
  }

  const addField = () => {
    if (!pendingField) return
    onAddField(pendingField)
    setPendingField("")
  }

  const renderAddFieldControls = (inline = false) => (
    <div className={inline ? "flex items-end gap-2" : "space-y-3"}>
      {!inline && <div className="text-xs text-blue-400 uppercase tracking-wide">Add Element</div>}
      <div className={inline ? "flex flex-1 items-end gap-2" : "flex items-center gap-2"}>
        <label className={inline ? "flex-1 text-xs uppercase tracking-wide text-blue-400" : "flex-1"}>
          {inline && <span>Add Element</span>}
          <select
            value={pendingField}
            onChange={(event) => setPendingField(event.target.value as InDevFieldKey)}
            className="mt-2 w-full rounded-md bg-black/70 border border-blue-500/30 px-4 py-3 text-blue-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400/60 focus:border-blue-400/60"
          >
            <option value="">Select field</option>
            {inactiveFields.map((field) => (
              <option key={field} value={field}>
                {IN_DEV_FIELD_DEFINITIONS[field].label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={addField}
          disabled={!pendingField}
          className="inline-flex items-center gap-2 border border-blue-500/40 px-4 py-3 text-xs md:text-sm text-blue-500 hover:text-blue-300 hover:border-blue-400 transition-colors disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          ADD
        </button>
      </div>
    </div>
  )

  const fieldGroups: Array<{ id: string; title: string; fields: InDevFieldKey[] }> = [
    { id: "core", title: "Core", fields: ["summary", "status", "category", "technologies"] },
    { id: "details", title: "Details", fields: ["client", "timeline", "role", "author", "date"] },
    { id: "links", title: "Links", fields: ["liveUrl", "githubUrl"] },
    { id: "tags", title: "Tags", fields: ["tags"] },
    { id: "visuals", title: "Visuals", fields: ["coverImageColor"] },
    { id: "features", title: "Features", fields: ["features"] },
  ]

  const renderGroup = (group: { id: string; title: string; fields: InDevFieldKey[] }) => {
    const visibleFields = group.fields.filter((field) => activeFields.includes(field))
    if (visibleFields.length === 0) return null

    const fieldList = visibleFields
      .map((field) => IN_DEV_FIELD_DEFINITIONS[field].label.replace(/\s*\(.*\)\s*/g, ""))
      .join(", ")
      .toUpperCase()

    return (
      <details key={group.id} className="rounded-md border border-blue-500/30 bg-black/55">
        <summary className="cursor-pointer text-blue-300 text-sm uppercase tracking-wide px-4 py-3 border-b border-blue-500/20 bg-blue-500/10">
          {group.title} ({fieldList})
        </summary>
        <div className="px-4 py-4 space-y-4">{visibleFields.map(renderFieldInput)}</div>
      </details>
    )
  }

  return (
    <div className="rounded-lg border border-blue-500/40 bg-black/60 p-5 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-blue-500 font-bold text-base md:text-lg">WORKBENCH</h2>
          <p className="text-xs text-blue-500/60">Live preview updates as you type.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ThumbnailDownloadButton
            imageUrl={thumbnailUrl}
            fileName={`${fileSlug}.png`}
            label="DOWNLOAD THUMBNAIL"
            overlayText={values.title}
            overlayColor={thumbnailOverlayColor}
          />
          <button
            type="button"
            onClick={handleSaveProgress}
            className="inline-flex items-center gap-2 border border-blue-500/40 px-3 py-2 text-xs md:text-sm text-blue-500 hover:text-blue-300 hover:border-blue-400 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saved ? "SAVED" : "SAVE PROGRESS"}
          </button>
          <button
            type="button"
            onClick={onDeleteProgress}
            className="inline-flex items-center gap-2 border border-blue-500/40 px-3 py-2 text-xs md:text-sm text-blue-500 hover:text-blue-300 hover:border-blue-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            DELETE CHANGES
          </button>
          <button
            type="button"
            onClick={copyMarkdown}
            className="inline-flex items-center gap-2 border border-blue-500/40 px-3 py-2 text-xs md:text-sm text-blue-500 hover:text-blue-300 hover:border-blue-400 transition-colors"
          >
            <Copy className="h-4 w-4" />
            {copied ? "COPIED" : "COPY"}
          </button>
          <button
            type="button"
            onClick={downloadMarkdown}
            className="inline-flex items-center gap-2 border border-blue-500/40 px-3 py-2 text-xs md:text-sm text-blue-500 hover:text-blue-300 hover:border-blue-400 transition-colors"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD
          </button>
        </div>
      </div>

      <div className="rounded-md border border-blue-500/30 bg-black/55 p-4 space-y-4">
        <label className="text-sm text-blue-500/80">
          <span className="text-xs uppercase tracking-wide text-blue-400">Title</span>
          <input
            value={values.title}
            onChange={(event) => onFieldChange("title", event.target.value)}
            className="mt-2 w-full rounded-md bg-black/70 border border-blue-500/30 px-4 py-3 text-blue-200 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-blue-400/60 focus:border-blue-400/60"
          />
        </label>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <label className="text-sm text-blue-500/80">
            <span className="text-xs uppercase tracking-wide text-blue-400">Type</span>
            <input
              value={type.toUpperCase()}
              readOnly
              className="mt-2 w-full rounded-md bg-black/70 border border-blue-500/20 px-4 py-3 text-blue-400/70 text-sm md:text-base"
            />
          </label>
          {renderAddFieldControls(true)}
        </div>
      </div>

      <div className="space-y-3">{fieldGroups.map(renderGroup)}</div>

      <label className="text-sm text-blue-500/80 block rounded-md border border-blue-500/30 bg-black/55 p-4">
        <span className="text-xs uppercase tracking-wide text-blue-400">Content</span>
        <textarea
          value={values.content}
          onChange={(event) => onFieldChange("content", event.target.value)}
          rows={14}
          className="mt-3 w-full rounded-md bg-black/70 border border-blue-500/30 px-4 py-3 text-blue-200 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-blue-400/60 focus:border-blue-400/60"
        />
      </label>

      <details className="rounded-md border border-blue-500/30 bg-black/55 p-4">
        <summary className="cursor-pointer text-blue-400 text-sm uppercase tracking-wide">Generated markdown</summary>
        <textarea
          readOnly
          value={markdownOutput}
          rows={12}
          className="mt-4 w-full rounded-md bg-black/70 border border-blue-500/30 px-4 py-3 text-blue-200 text-sm"
        />
      </details>
    </div>
  )
}
