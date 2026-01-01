import type React from "react"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Primary Meta Tags */}
        <title>Robert Johnson | Portfolio</title>
        <meta name="title" content="Robert (Robby) Johnson | Portfolio" />
        <meta name="description" content="Portfolio of Robert (Robby) Johnson. Specialized in software, networks, and PLCs. Building secure, robust systems with a commitment to performance and scalability." />
        <link rel="icon" type="image/x-icon" href="/images/icon.svg"></link>

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.robbyj.dev/" />
        <meta property="og:title" content="Robert (Robby) Johnson | Portfolio" />
        <meta property="og:description" content="Portfolio of Robert (Robby) Johnson. Specialized in software, networks, and PLCs. Building secure, robust systems with a commitment to performance and scalability." />
        <meta property="og:image" content="/images/thumbnail.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.robbyj.dev/" />
        <meta property="twitter:title" content="Robert (Robby) Johnson | Portfolio" />
        <meta property="twitter:description" content="Portfolio of Robert (Robby) Johnson. Specialized in software, networks, and PLCs. Building secure, robust systems with a commitment to performance and scalability." />
        <meta property="twitter:image" content="/images/thumbnail.png" />
      </head>

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