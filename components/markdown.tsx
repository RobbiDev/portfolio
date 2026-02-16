"use client"

import React from "react"

import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownProps {
  content: string
  blockquoteClassName?: string
}

const Markdown: React.FC<MarkdownProps> = ({ content, blockquoteClassName }) => {
  const blockquoteStyles = blockquoteClassName || "border-lime-400 text-neutral-400"
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3" {...props} />,
        h4: ({ node, ...props }) => <h4 className="text-lg font-bold mt-4 mb-2" {...props} />,
        p: ({ node, children, ...props }) => {
          // Check if this paragraph contains only an image
          const childrenArray = React.Children.toArray(children)

          // More robust check for image-only paragraphs
          const hasOnlyImageContent =
            childrenArray.every((child) => {
              if (typeof child === "string") {
                return child.trim() === ""
              }
              if (React.isValidElement(child)) {
                return child.type === "img"
              }
              return false
            }) && childrenArray.some((child) => React.isValidElement(child) && child.type === "img")

          // If it contains only an image (and whitespace), don't wrap in a paragraph
          if (hasOnlyImageContent) {
            return <>{children}</>
          }

          return (
            <p className="mb-4 text-neutral-300" {...props}>
              {children}
            </p>
          )
        },
        a: ({ node, ...props }) => <a className="text-lime-400 hover:underline" {...props} />,
        ul: ({ node, ordered, className, ...props }) => (
          <ul className="list-disc pl-6 mb-4 text-neutral-300" {...props} />
        ),
        ol: ({ node, ordered, className, ...props }) => (
          <ol className="list-decimal pl-6 mb-4 text-neutral-300" {...props} />
        ),
        li: ({ node, ordered, checked, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className={`border-l-4 pl-4 italic my-4 ${blockquoteStyles}`} {...props} />
        ),
        img: ({ node, src, alt, ...props }) => {
          if (!src) return null



          return (
            <div className="w-full flex justify-center">
              <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
                <Image
                  src={src || "/placeholder.svg"}
                  alt={alt?.trim() || "Screenshot from SafelySDS interface"}
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-contain rounded-md shadow"
                  quality={100}
                  priority
                  onError={(e) => {
                    console.error("Image failed to load:", src);
                    e.currentTarget.src = "/placeholder.svg?height=400&width=800";
                  }}
                />
                {alt && (
                  <div className="text-sm text-neutral-400 mt-2 italic text-center">
                    {alt.trim()}
                  </div>
                )}
              </div>
            </div>
          );

        },
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "")
          return !inline ? (
            <div className="my-6 overflow-auto rounded bg-black/50 border border-neutral-800">
              <pre className="p-4 text-sm font-mono text-neutral-200 overflow-x-auto">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code className="bg-black/50 px-1 py-0.5 rounded font-mono text-sm" {...props}>
              {children}
            </code>
          )
        },
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border border-neutral-800" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-black/50" {...props} />,
        th: ({ node, ...props }) => (
          <th className="px-4 py-2 border border-neutral-800 text-left font-mono text-sm" {...props} />
        ),
        td: ({ node, ...props }) => <td className="px-4 py-2 border border-neutral-800" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-8 border-neutral-800" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown
