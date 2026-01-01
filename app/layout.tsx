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
  description: "Robert Johnson's Portfolio",
  // Resolves relative image paths to absolute URLs when `metadataBase` is set below
  openGraph: {
    title: "Robert Johnson | Portfolio",
    description: "From networks to control-systems — I build secure, scalable systems.",
    url: "https://robbyj.com", // Replace with your actual URL
    siteName: "Robert Johnson Portfolio",
    images: [
      {
        url: "/opengraph-image.png", // Social preview image (see /public/opengraph-image.svg)
        width: 1200,
        height: 630,
        alt: "Robert Johnson Portfolio - Making Things Better",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Robert Johnson | Portfolio',
    description: "From networks to control-systems — I build secure, scalable systems.",
    images: ['/opengraph-image.png'],
  },
  keywords: [
    'Robert Johnson',
    'portfolio',
    'software engineer',
    'systems',
    'networks',
  ],
}

export const metadataBase = new URL('https://robbyj.com')

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
