import Link from "next/link"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import GridBackground from "@/components/grid-background"
import CategoryFilter from "@/components/category-filter"
import { getAllProjects, getProjectCategories } from "@/lib/projects"
import Footer from "@/components/footer"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Thoughts, insights, and updates on web development, design, and technology.",
}

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getAllProjects>> = []
  let categories: Awaited<ReturnType<typeof getProjectCategories>> = []
  let errorMessage = null

  try {
    projects = await getAllProjects()
    categories = await getProjectCategories()
    console.log("Projects page loaded projects:", projects.length)
    console.log("Project categories:", categories)
  } catch (error) {
    console.error("Error fetching projects:", error)
    errorMessage = "Failed to load projects. Please try again later."
  }

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <div className="inline-block bg-black/30 backdrop-blur-sm border border-pallete-main/20 px-3 py-1 text-xs font-mono text-pallete-main mb-4">
          PROJECTS
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">PROJECTS</h1>
        <p className="text-neutral-400 text-lg max-w-3xl">
          A selection of my most recent work, showcasing my skills and expertise in web development and design.
        </p>

        <div className="mt-16">
          <CategoryFilter categories={categories} basePath="/projects" title="Categories" />

          {errorMessage ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Error</h3>
              <p className="text-neutral-400">{errorMessage}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="relative overflow-hidden bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(163,230,53,0.2),_transparent_55%)]"></div>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(59,130,246,0.2),_transparent_60%)]"></div>

              <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.3em] text-pallete-main/80 mb-3">
                    Project Bay Empty
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">No published projects yet</h3>
                  <p className="text-neutral-400 mb-6">
                    When new work ships, it will land here with full case studies and visuals.
                  </p>
                  <div className="grid gap-3 text-sm font-mono text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-pallete-main"></span>
                      <span>Add a markdown file in content/projects.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      <span>Use the in-dev console to preview drafts.</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm font-mono">
                    <Link
                      href="/system-error"
                      className="inline-flex items-center gap-2 border border-pallete-main/40 bg-pallete-main/10 px-4 py-2 text-pallete-main transition hover:border-pallete-main/70 hover:bg-pallete-main/20"
                    >
                      Open In-Dev Console
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Start a Project
                    </Link>
                  </div>
                </div>

                <div className="relative flex items-center justify-center">
                  <div className="absolute h-56 w-56 rounded-full border border-pallete-main/30 animate-signal-spin"></div>
                  <div className="absolute h-40 w-40 rounded-full border border-blue-400/30 animate-signal-spin [animation-duration:20s]"></div>
                  <div className="absolute h-28 w-28 rounded-full border border-white/10 animate-signal-spin [animation-duration:26s]"></div>
                  <div className="relative h-28 w-28 rounded-full border border-pallete-main/40 bg-black/60 shadow-[0_0_30px_rgba(163,230,53,0.3)]">
                    <div className="absolute inset-3 rounded-full border border-blue-300/30 animate-signal-pulse"></div>
                    <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pallete-main shadow-[0_0_10px_rgba(163,230,53,0.9)]"></div>
                  </div>
                  <div className="pointer-events-none absolute -bottom-6 h-16 w-48 rounded-full bg-pallete-main/10 blur-2xl"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-12">
              {projects.map((project, index) => {
                const coverImage = project.coverImage || "/placeholder.svg?height=600&width=800&query=project"
                const isInlineCover = coverImage.startsWith("data:")

                return (
                  <div
                    key={index}
                    className="group relative bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden"
                  >
                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                      <div className="w-full h-[250px] md:h-[300px] relative overflow-hidden">
                        <Image
                          src={coverImage}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized={isInlineCover}
                        />
                        {isInlineCover && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div 
                              className="font-marker text-white px-8 py-4 text-2xl md:text-3xl uppercase"
                              style={{ backgroundColor: project.coverImageColor || "rgb(16, 16, 16)" }}
                            >
                              {project.title}
                            </div>
                          </div>
                        )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="bg-pallete-main text-black p-2 rounded-full"
                          aria-label={`View ${project.title} project details`}
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-pallete-main"></div>
                        <span className="text-xs font-mono text-neutral-400">
                          {project.category.length > 0 ? project.category.join(" / ") : "Uncategorized"}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h3>
                      <p className="text-neutral-400 mb-6">{project.summary}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies &&
                          project.technologies.slice(0, 5).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="text-xs bg-black/50 border border-neutral-800 px-2 py-1 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        {project.technologies && project.technologies.length > 5 && (
                          <span className="text-xs bg-black/50 border border-neutral-800 px-2 py-1 font-mono">
                            +{project.technologies.length - 5} more
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 bg-pallete-main hover:bg-pallete-main/60 text-black px-4 py-2 font-medium transition-colors self-start"
                      >
                        VIEW PROJECT <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}
