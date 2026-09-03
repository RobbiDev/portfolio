import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { profile } from "@/lib/profile"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
})

const SITE_URL = "https://robbyj.dev"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ROBBYJ · Robert Johnson",
  description:
    "Robert Johnson builds networks, software, and control systems. Projects, field notes, and a way to get in touch — all on one page.",
  keywords: [
    "Robert Johnson",
    "software engineer",
    "network engineer",
    "control systems",
    "industrial automation",
    "portfolio",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "ROBBYJ · Robert Johnson",
    description: "Networks, software & systems. Projects, field notes, and contact.",
    url: SITE_URL,
    siteName: "Robert Johnson",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Robert Johnson" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROBBYJ · Robert Johnson",
    description: "Networks, software & systems.",
    images: ["/opengraph-image.png"],
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e9e8e3",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              url: SITE_URL,
              email: `mailto:${profile.email}`,
              jobTitle: profile.role,
              worksFor: { "@type": "Organization", name: profile.employer },
              address: { "@type": "PostalAddress", addressLocality: "Greensboro", addressRegion: "NC" },
              sameAs: [profile.github, profile.linkedin],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
