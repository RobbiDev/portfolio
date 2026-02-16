import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink } from "lucide-react"
import PageHeader from "@/components/page-header"
import GridBackground from "@/components/grid-background"
import CategoryFilter from "@/components/category-filter"
import { getProjectsByCategory, getProjectCategories } from "@/lib/projects"

export async function generateStaticParams() {
  const categories = await getProjectCategories()
  return categories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const categories = await getProjectCategories()
  const category = categories.find((cat) => cat.slug === params.category)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} Projects | Portfolio`,
    description: `Projects in the ${category.name} category`,
  }
}

export default async function ProjectCategoryPage({ params }: { params: { category: string } }) {
  let projects = []
  let categories = []
  let categoryName = ""
  let errorMessage = null

  try {
    projects = await getProjectsByCategory(params.category)
    categories = await getProjectCategories()

    const category = categories.find((cat) => cat.slug === params.category)
    if (!category) {
      notFound()
    }

    categoryName = category.name
    console.log(`Project category page loaded ${projects.length} projects for category: ${categoryName}`)
  } catch (error) {
    console.error("Error fetching projects by category:", error)
    errorMessage = "Failed to load projects. Please try again later."
  }

  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <div className="relative z-10 container py-16 md:py-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-pallete-main transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO ALL PROJECTS
        </Link>

        <PageHeader
          title={`${categoryName.toUpperCase()} PROJECTS`}
          subtitle={`Explore all projects in the ${categoryName} category.`}
        />

        <div className="mt-16">
          <CategoryFilter
            categories={categories}
            currentCategory={params.category}
            basePath="/projects"
            title="Project Categories"
          />

          {errorMessage ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Error</h3>
              <p className="text-neutral-400">{errorMessage}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-black/30 backdrop-blur-sm border border-neutral-800 p-8 text-center">
              <h3 className="text-xl font-bold mb-4">No projects found</h3>
              <p className="text-neutral-400">No projects found in the {categoryName} category.</p>
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
                        className="inline-flex items-center gap-2 bg-pallete-main hover:bg-pallete-main/80 text-black px-4 py-2 font-medium transition-colors self-start"
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
    </div>
  )
}
