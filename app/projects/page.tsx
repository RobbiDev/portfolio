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
        <div className="relative">
          <div className="inline-block bg-black/30 backdrop-blur-sm border border-pallete-main/20 px-3 py-1 text-xs font-mono text-pallete-main mb-4">
            PROJECTS
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">PROJECTS</h1>
          <p className="text-neutral-400 text-lg max-w-3xl">
            A selection of my most recent work, showcasing my skills and expertise in web development and design.
          </p>
          <Link
            href="/system-error"
            className="group absolute right-0 top-0 inline-flex items-center gap-2 text-[10px] text-blue-200/20 transition hover:text-blue-100/60"
            aria-label="Open in-dev console"
          >
            <span className="relative inline-flex items-center font-mono">
              <span className="relative">dev://console</span>
              <span className="pointer-events-none absolute left-0 top-0 text-blue-200/15 opacity-0 transition group-hover:opacity-100 animate-glitch-1">
                dev://console
              </span>
              <span className="pointer-events-none absolute left-0 top-0 text-blue-200/10 opacity-0 transition group-hover:opacity-100 animate-glitch-2">
                dev://console
              </span>
            </span>
          </Link>
        </div>

        <div className="mt-16">
          <CategoryFilter categories={categories} basePath="/projects" title="Categories" />

          {errorMessage ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Error</h3>
              <p className="text-neutral-400">{errorMessage}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="relative overflow-hidden bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 md:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_55%)]"></div>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(34,197,94,0.2),_transparent_60%)]"></div>

              <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-center">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.3em] text-blue-200/80 mb-3">
                    Project Bay Empty
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">No published projects yet</h3>
                  <p className="text-neutral-400 mb-6">
                    When new work ships, it will land here with full case studies and visuals.
                  </p>
                  <div className="grid gap-3 text-sm font-mono text-neutral-300">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      <span>Case studies are staging while new work ships.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      <span>Peek around the rest of the site in the meantime.</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3 text-sm font-mono">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
                    >
                      Go Home
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Contact
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      See Blog
                    </Link>
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      About
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative overflow-hidden rounded-lg border border-blue-400/30 bg-black/70 p-5 shadow-[0_0_30px_rgba(59,130,246,0.22)]">
                    <div className="flex items-center justify-between border-b border-blue-400/20 pb-2 text-xs font-mono text-blue-200/80">
                      <span>MINI TERMINAL</span>
                      <span className="flex items-center gap-2 text-emerald-200/80">
                        <span className="h-2 w-2 rounded-full bg-emerald-300/80"></span>
                        204
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 text-xs font-mono text-neutral-300/90">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300">&gt;</span>
                        <span>project feed</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <span className="text-emerald-300">.</span>
                        <span>status: empty</span>
                      </div>
                    </div>
                    <div className="mt-4 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-200/60">
                      <span>LOG STREAM</span>
                    </div>
                    <Link
                      href="/system-error"
                      className="group absolute bottom-2 right-2 inline-flex items-center gap-2 px-2 py-1 text-[10px] text-blue-200/35 transition hover:text-blue-100/70"
                      aria-label="Open in-dev console"
                    >
                      <span className="relative inline-flex items-center font-mono">
                        <span className="relative">dev://console</span>
                        <span className="pointer-events-none absolute left-0 top-0 text-blue-200/20 opacity-0 transition group-hover:opacity-100 animate-glitch-1">
                          dev://console
                        </span>
                        <span className="pointer-events-none absolute left-0 top-0 text-blue-200/15 opacity-0 transition group-hover:opacity-100 animate-glitch-2">
                          dev://console
                        </span>
                      </span>
                    </Link>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(59,130,246,0.12),transparent)] opacity-70 animate-signal-scan"></div>
                  </div>
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
      <Footer/>
    </div>
  )
}
