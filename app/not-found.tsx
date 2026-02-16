import Link from "next/link"
import { ArrowLeft, Terminal, Folder, FileText } from "lucide-react"
import GridBackground from "@/components/grid-background"

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <GridBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,199,255,0.18),_transparent_55%)]"></div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(226,26,65,0.2),_transparent_50%)]"></div>

      <div className="relative z-10 container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-blue-200/70">Signal Lost</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            The path vanished into the void.
          </h1>
          <p className="text-lg text-blue-100/70">
            We scanned active projects and in-development logs, but this route does not exist.
          </p>

          <div className="flex flex-wrap gap-3 text-sm font-mono">
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
            <Link
              href="/system-error"
              className="inline-flex items-center gap-2 border border-red-500/40 bg-red-500/10 px-4 py-2 text-red-100 transition hover:border-red-400 hover:bg-red-500/20"
            >
              <Terminal className="h-4 w-4" />
              In-Dev Console
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute h-[360px] w-[360px] rounded-full border border-blue-500/20 animate-signal-spin"></div>
          <div className="absolute h-[280px] w-[280px] rounded-full border border-blue-400/20 animate-signal-spin [animation-duration:20s]"></div>
          <div className="absolute h-[200px] w-[200px] rounded-full border border-blue-300/20 animate-signal-spin [animation-duration:26s]"></div>

          <div className="relative h-[220px] w-[220px] rounded-full border border-blue-400/40 bg-black/60 shadow-[0_0_40px_rgba(88,199,255,0.25)]">
            <div className="absolute inset-4 rounded-full border border-blue-300/30 animate-signal-pulse"></div>
            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_12px_rgba(88,199,255,0.9)]"></div>
            <div className="absolute inset-0 animate-signal-orbit">
              <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(226,26,65,0.8)]"></div>
            </div>
            <div className="absolute left-1/2 top-1/2 h-24 w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-blue-300/80 via-blue-300/10 to-transparent"></div>
          </div>

          <div className="pointer-events-none absolute -bottom-6 h-20 w-[320px] rounded-full bg-blue-500/10 blur-2xl"></div>
          <div className="pointer-events-none absolute -top-10 left-10 h-10 w-40 border border-blue-500/20 bg-blue-500/5 animate-signal-scan"></div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-blue-200/50">
        Error code: 404 :: Route not found
      </div>
    </div>
  )
}
