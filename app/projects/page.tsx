import Link from "next/link"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import GridBackground from "@/components/grid-background"
import CategoryFilter from "@/components/category-filter"
import { getAllProjects, getProjectCategories } from "@/lib/projects"
import Footer from "@/components/footer"

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
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">No projects found</h3>
              <p className="text-neutral-400">
                Projects will appear here once they are added to the content/projects directory.
              </p>
            </div>
          ) : (
            <div className="grid gap-12">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="group relative bg-black/30 backdrop-blur-sm border border-neutral-800 overflow-hidden"
                >
                  <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                    <div className="w-full h-[250px] md:h-[300px] relative overflow-hidden">
                      <Image
                        src={project.coverImage || "/placeholder.svg?height=600&width=800&query=project"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
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
                        <span className="text-xs font-mono text-neutral-400">{project.category}</span>
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}
