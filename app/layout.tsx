import type React from "react";
import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

export const metadataBase = new URL("https://robbyj.com");

export const metadata: Metadata = {
  title: {
    default: "Robert Johnson | Portfolio",
    template: "%s | Robert Johnson",
  },
  description:
    "From networks to control systems, I build secure, scalable software and infrastructure solutions with a focus on reliability and performance.",
  keywords: [
    "Robert Johnson",
    "software engineer",
    "systems engineer",
    "networking",
    "portfolio",
  ],
  alternates: {
    canonical: "https://robbyj.com",
  },
  openGraph: {
    title: "Robert Johnson | Portfolio",
    description:
      "Secure, scalable systems across software, networks, and control environments.",
    url: "https://robbyj.com",
    siteName: "Robert Johnson Portfolio",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Robert Johnson Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robert Johnson | Portfolio",
    description:
      "Secure, scalable systems across software, networks, and control environments.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Robert Johnson",
              url: "https://robbyj.com",
              sameAs: [
                "https://github.com/RobbiDev",
                "https://www.linkedin.com/in/robby-johnson",
              ],
              jobTitle: "Networks and Systems Engineer",
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} font-sans bg-black text-white relative`}
      >
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
