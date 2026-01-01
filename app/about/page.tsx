import type { Metadata } from "next"
import GridBackground from "@/components/grid-background"
import Footer from "@/components/footer"
import AboutClient from "./AboutClient"

export const metadata: Metadata = {
  title: "Robert Johnson | About",
  description: "Thoughts, insights, and updates on web development, design, and technology.",
}

export default function Page() {
  return (
    <div className="relative min-h-screen">
      <GridBackground />
      <AboutClient />
      <Footer />
    </div>
  )
}