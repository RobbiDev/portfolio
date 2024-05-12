import Image from 'next/image'
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google'
import Head from 'next/head'
import JobCard from '@/components/JobCard'
import CFA from '@/assets/cfa.png'
import Virtuollis from '@/assets/virtuollis.svg'
import Link from 'next/link'

import data from '@/data/jobs.json'

const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] })
const arrayData = ['Apple', 'Banana', 'Cherry'];
export default function Home() {


    return (
        
        <main className={`${Konkhmer.className}`}>
            <Head>
                <title>Projects | Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
            </Head>

            <main className={`container mx-auto ${Konkhmer.className} px-5 pb-10`}>

                <header className='flex flex-col md:flex-row text-lg py-10 items-center sm:justify-between text-white border-b-white '>

                    <div className='text-gray-400'>
                        <a href='/' >making/things/better<span className='gradient'>/experience</span></a>
                    </div>


                    <nav className='flex flex-row justify-between space-x-5 text-gray-400'>
                        <a href='/'>Home</a>
                        <a href='/projects'>Projects</a>
                        <a href='/contact'>Contact</a>
                    </nav>


                </header>

                <section className='flex flex-col space-y-5 text-white text-2xl'>
                    <div>
                        <h1>Software Engineering</h1>
                        <div class="w-full mt-5 h-px  bg-zinc-800"></div>

                        <div className='flex flex-col'>
                            <JobCard date={"January 16th, 2023"} year={"9 mos"} title={"Virtuollis LLC"} location={"Ontario, Canada · Remote"} image={Virtuollis}>
                            <h1>BOH Supervisor</h1>
							<p class="text-xs text-zinc-500 ">Jan 2023 - Present</p>
                            </JobCard>
                        </div>

                    </div>
                    <div>
                        <h1>General Jobs</h1>
                        <div class="w-full mt-5 h-px bg-zinc-800"></div>
                        <div className='flex flex-col space-y-5'>
                            {data.map(job => <JobCard date={job.date} year={job.time} title={job.company} location={job.location} image={CFA} fruits={arrayData} /> )}
                        </div>
                    </div>

                </section>
            </main>

        </main>
    )
}
