import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Github, Folder } from "lucide-react"
import GridBackground from "@/components/grid-background"
import Markdown from "@/components/markdown"
import Gallery from "@/components/gallery"
import { getAllProjectSlugs, getProjectBySlug } from "@/lib/projects"
import Footer from "@/components/footer"

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  console.log("Generated static params for project slugs:", slugs)
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.summary,
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  let project = null
  let errorMessage = null

  try {
    project = getProjectBySlug(params.slug)
    console.log("Retrieved project:", project ? project.title : "Not found")

    if (!project) {
      notFound()
    }
  } catch (error) {
    console.error(`Error fetching project with slug ${params.slug}:`, error)
    errorMessage = "Failed to load project details. Please try again later."
  }

  if (errorMessage) {
    return (
      <div className="relative min-h-screen">
        <GridBackground />
        <div className="relative z-10 container py-16 md:py-24">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-pallete-main transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> BACK TO PROJECTS
          </Link>

          <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Error</h3>
            <p className="text-neutral-400">{errorMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-pallete-main transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO PROJECTS
        </Link>

        <div className="grid gap-12">
          {/* Project Header */}
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-pallete-main" />
                <Link
                  href={`/projects/category/${project.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-block bg-black/30 backdrop-blur-sm border border-pallete-main/20 px-3 py-1 text-xs font-mono text-pallete-main hover:border-pallete-main/50 transition-colors"
                >
                  {project.category}
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">{project.title}</h1>
              <p className="text-neutral-400 text-lg">{project.summary}</p>
              <div className="flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-pallete-main hover:bg-pallete-main/80 text-black px-4 py-2 font-medium transition-colors"
                  >
                    VIEW LIVE <ExternalLink className="h-4 w-4" />
                  </Link>
                )}
                {project.githubUrl && (
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-pallete-main/20 hover:bg-black/50 px-4 py-2 font-medium transition-colors"
                  >
                    VIEW CODE <Github className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
            <div className="relative aspect-video bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden">
              <Image
                src={project.coverImage || "/placeholder.svg?height=600&width=800&query=project"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="grid gap-12 xl:grid-cols-[2fr_1fr]">
            <div className="space-y-8 order-2 xl:order-1">
              
              {project.content && (
                <div className="prose prose-invert prose-lime max-w-none">
                  <Markdown content={project.content} />
                </div>
              )}

              {/* Project Gallery - Show if gallery exists */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="mt-12 pt-8 border-t border-neutral-800">
                  <Gallery images={project.gallery} title="Project Gallery" />
                </div>
              )}

              {/* Project Images - Show if images exist but no gallery */}
              {!project.gallery && project.images && project.images.length > 0 && (
                <div className="mt-12 pt-8 border-t border-neutral-800">
                  <Gallery images={project.images} title="Project Images" />
                </div>
              )}
            </div>

            <div className="space-y-8 order-1 xl:order-2">
              <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6">
                <h2 className="text-xl font-bold mb-4">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-mono text-neutral-400">CLIENT</h3>
                    <p>{project.client || "Personal Project"}</p>
                  </div>
                  {project.timeline && (
                    <div>
                      <h3 className="text-sm font-mono text-neutral-400">TIMELINE</h3>
                      <p>{project.timeline}</p>
                    </div>
                  )}
                  {project.role && (
                    <div>
                      <h3 className="text-sm font-mono text-neutral-400">ROLE</h3>
                      <p>{project.role}</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-mono text-neutral-400">CATEGORY</h3>
                    <Link
                      href={`/projects/category/${project.category.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-pallete-main hover:text-pallete-main/80 transition-colors"
                    >
                      {project.category}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6">
                <h2 className="text-xl font-bold mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies &&
                    project.technologies.map((tech, index) => (
                      <span key={index} className="text-xs bg-black/50 border border-neutral-800 px-2 py-1 font-mono">
                        {tech}
                      </span>
                    ))}
                </div>
              </div>

              {project.features && project.features.length > 0 && (
                <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-6">
                  <h2 className="text-xl font-bold mb-4">Key Features</h2>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-pallete-main mt-2"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Next/Previous Projects */}
          {project.relatedProjects && project.relatedProjects.length > 0 && (
            <div className="mt-12 pt-12 border-t border-neutral-800">
              <h2 className="text-2xl font-bold mb-6">More Projects</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {project.relatedProjects.map((relatedProject, index) => (
                  <Link
                    key={index}
                    href={`/projects/${relatedProject.slug}`}
                    className="group bg-black/30 backdrop-blur-sm border border-neutral-800 p-6 hover:border-pallete-main/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-pallete-main"></div>
                      <span className="text-xs font-mono text-neutral-400">{relatedProject.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-pallete-main transition-colors">
                      {relatedProject.title}
                    </h3>
                    <p className="text-sm text-neutral-400">{relatedProject.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
        
      </div>
      <Footer />
    </div>
  )
}
