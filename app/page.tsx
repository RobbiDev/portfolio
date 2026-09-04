import SiteShell from "@/components/site/site-shell"
import PointerFx from "@/components/site/pointer-fx"
import VisitTracker from "@/components/site/visit-tracker"
import { getPosts, getProjects } from "@/lib/content"

/**
 * The whole site is this one page. Content is read from markdown at build time
 * and handed to the shell, which swaps panels client-side.
 */
export default function Home() {
  // Files under content/*/in-process are drafts: they stay out of the public
  // board and the postcard wall until they are moved up a folder.
  const projects = getProjects().filter((project) => !project.draft)
  const posts = getPosts().filter((post) => !post.draft)

  return (
    <>
      <SiteShell projects={projects} posts={posts} />
      <PointerFx />
      <VisitTracker />
    </>
  )
}
