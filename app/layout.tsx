import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "Robert Johnson | Portfolio",
  description: "Robert Johnson's Portfolio"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${spaceMono.variable} font-sans bg-black text-white relative`}>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}


import './globals.css'