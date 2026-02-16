import Link from "next/link"
import { ArrowLeft, Terminal, Folder, FileText, AlertTriangle } from "lucide-react"
import GridBackground from "@/components/grid-background"

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,199,255,0.12),_transparent_55%)]"></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,_rgba(226,26,65,0.18),_transparent_50%)]"></div>

      <div className="relative z-10 container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl">
          <div className="border border-blue-500/30 bg-black/80 backdrop-blur-md shadow-[0_0_40px_rgba(18,135,255,0.2)]">
            <div className="flex items-center justify-between border-b border-blue-500/30 px-4 py-3">
              <div className="flex items-center gap-2 text-blue-300/90 font-mono text-xs">
                <Terminal className="h-4 w-4" />
                MAINFRAME::ROUTE_DIAGNOSTICS
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
              </div>
            </div>

            <div className="px-6 py-8">
              <div className="space-y-5 text-sm md:text-base font-mono">
                <div className="text-blue-200/80">$ verify --route /requested/path</div>
                <div className="text-blue-200/60">Scanning: published.projects · published.blogs</div>
                <div className="flex items-start gap-3 rounded border border-red-500/30 bg-red-500/10 px-4 py-4 text-red-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em]">404: Route Missing</div>
                    <div className="mt-1 text-red-100/80">
                      No match found. The path is either mistyped or not published yet.
                    </div>
                  </div>
                </div>

                <div className="rounded border border-blue-500/20 bg-black/60 px-4 py-4 text-blue-100/80">
                  <div className="text-xs uppercase tracking-[0.3em] text-blue-200/60">Quick Routes</div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs md:text-sm">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-blue-100 transition hover:border-blue-300 hover:bg-blue-500/20"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Return Home
                    </Link>
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      <Folder className="h-4 w-4" />
                      Projects
                    </Link>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      <FileText className="h-4 w-4" />
                      Blog
                    </Link>
                  </div>
                  <Link
                    href="/system-error"
                    className="group mt-4 inline-flex items-center gap-2 text-[10px] text-red-100/35 transition hover:text-red-100/70"
                    aria-label="Open in-dev console"
                  >
                    <span className="relative inline-flex items-center">
                      <span className="relative">dev://console</span>
                      <span className="pointer-events-none absolute left-0 top-0 text-red-100/20 opacity-0 transition group-hover:opacity-100 animate-glitch-1">
                        dev://console
                      </span>
                      <span className="pointer-events-none absolute left-0 top-0 text-red-100/15 opacity-0 transition group-hover:opacity-100 animate-glitch-2">
                        dev://console
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
