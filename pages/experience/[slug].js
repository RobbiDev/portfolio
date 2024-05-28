import Image from 'next/image'
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google'
import Head from 'next/head'

const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] })


export default function Home() {
    return (
        <main className={`${Konkhmer.className}`}>
            <Head>
                <title>Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <main className={`container mx-auto flex justify-center ${Konkhmer.className}`}>
                <header className={`px-5 sm:px-0 h-screen flex flex-col justify-center`}>
                    <div className='flex flex-col'>
                        <nav className={`item`}>
                            <a href='/projects'>Projects</a>
                            <a href='/contact'>Contact</a>
                            <a href='/experience'>Experience</a>
                        </nav>

                        <div class="code-text base">
                            <a className={`text-2xl md:text-4xl unselectable text-white place-content-center`}>making <span class="gradient">things</span> better</a>
                        </div>

                        <nav className={`item`}>
                            <a href='/projects'>Robert Johnson</a>
                            <a href='/experience'>18 yr</a>
                        </nav>
                    </div>
                </header>
            </main>

        </main>
    )
}
