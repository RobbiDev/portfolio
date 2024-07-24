import Image from 'next/image';
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google';
import Head from 'next/head';

// Load the Konkhmer font with specified weight and subsets
const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] });

/**
 * Home component for the portfolio website.
 * Renders the main page with navigation and introductory text.
 */
export default function Home() {
  return (
    <main className={Konkhmer.className}>
      <Head>
        <title>Robert Johnson</title>
        <meta name="description" content="My Portfolio Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={`container mx-auto flex justify-center ${Konkhmer.className}`}>
        <header className="px-5 sm:px-0 h-screen flex flex-col justify-center">
          <div className="flex flex-col">
            {/* Navigation menu */}
            <nav className="item">
              <a href="/projects">Projects</a>
              <a href="/contact">Contact</a>
              <a href="/experience">Experience</a>
            </nav>

            {/* Main text content */}
            <div className="code-text base">
              <div className="text-2xl md:text-4xl unselectable text-white place-content-center">
                making <a href="https://blog.robbyj.dev" target="_blank" className="gradient">things</a> better
              </div>
            </div>

            {/* Additional information */}
            <nav className="item">
              <p>Robert Johnson</p>
              <p>19 yr</p>
            </nav>
          </div>
        </header>
      </div>
    </main>
  );
}