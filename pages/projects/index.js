import Image from 'next/image'
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google'
import Head from 'next/head'
import Card from '@/components/Card'
import Link from 'next/link'

const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] })


export default function Home() {
    return (
        <main className={`${Konkhmer.className}`}>
            <Head>
                <title>Projects | Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
            </Head>

            <main className={`container mx-auto ${Konkhmer.className} px-5 `}>

                <header className='flex flex-col md:flex-row text-lg py-10 items-center sm:justify-between text-white border-b-white '>

                    <div className='text-gray-400'>
                        <h1>making/things/better<span className='gradient'>/projects</span></h1>
                    </div>

                    <div>
                        <ul className='flex flex-row justify-between space-x-5 text-gray-400'>
                            <a>Home</a>
                            <a>Experience</a>
                            <a>Contact</a>
                        </ul>
                    </div>

                </header>

                <section className='flex flex-col lg:grid grid-cols-2 grid-row-1 gap-2'>


                    <Card featured={true} date={"April 26th, 2023"} views={"440"} title={"Grandover Project"} desc={`A full-stack application designed specifically to enhance the operations of Chick-Fil-A at Grandover Village.`} />
                    <Card date={"April 26th, 2023"} views={"440"} title={"ImDragonsAPI"} desc={"An API that allows for instant access to a massive database of infomation regarding the band Imagine Dragons!"} />
                    <Card date={"April 26th, 2023"} views={"440"} title={"Boil-Out Control"} desc={"An automatic system that helps monitor all fryers within the store and keeps track of deep cleanings (Boil Out)An automatic system that helps monitor all fryers within the store and keeps track of deep cleanings (Boil Out)"} />
                </section>

            </main>

        </main>
    )
}
