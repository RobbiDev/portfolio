// General Imports
import Head from 'next/head';
import JobCard from '@/components/JobCard';
import jobsData from '@/data/jobs.json';

// Define fonts with specific configurations
import { Konkhmer_Sleokchher, Roboto } from 'next/font/google';
const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] });
const PrimaryFont = Roboto({ weight: ["400"], subsets: ['latin'] });

/**
 * Home component for displaying categorized job listings.
 */
export default function Home() {

    return (
        <div>

            <Head>
                <title>Projects | Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
            </Head>

            <main className={`container mx-auto ${Konkhmer.className} px-5 pb-10`}>
                {/* Header section */}
                <header className='flex flex-col md:flex-row text-lg py-10 items-center sm:justify-between text-white border-b-white'>
                    <div className='text-gray-400'>
                        <a href='/' >making/things/better<span className='gradient'>/experience</span></a>
                    </div>
                    <nav className='flex flex-row justify-between space-x-5 text-gray-400'>
                        <a href='/'>Home</a>
                        <a href='/projects'>Projects</a>
                        <a href='/contact'>Contact</a>
                    </nav>
                </header>

                <section className='flex flex-col md:flex-row md:space-x-5 '>
                    <section className='flex max-h-screen flex-col xl:w-1/2'>
                        <div className="flex space-y-5 flex flex-col max-h-screen">
                            <h1 className='text-white'>ABOUT</h1>
                            <p className='font-md text-zinc-300'>
                                Experienced professional with a passion
                                for making things better through problem-
                                solving and system design. Utilizes
                                technical expertise and innovative
                                thinking to drive growth and efficiency.
                                Committed to the value of "Making it
                                better" in all endeavors.
                            </p>
                        </div>
                        <div className='flex flex-col space-y-5 py-10'>
                            <h1 className=' text-white'>SKILLS</h1>
                            <div className='text-zinc-300'>
                            <p>hi</p>
                            <p>hi</p>
                            <p>hi</p>
                            <p>hi</p>
                            </div>
                        </div>
                    </section>

                    {/* Main content section */}
                    <section className='flex flex-col space-y-5 text-white'>
                        <div className="flex space-y-5 flex flex-col">
                            {/* Software Engineering Jobs */}
                            <div>
                                <h1 className='mb-5'>EXPERIENCE</h1>
                                <div className='flex flex-col space-y-5'>
                                    {jobsData.map((job, index) => (
                                        <JobCard
                                            key={index}
                                            date={job.date}
                                            year={job.time}
                                            company={job.company}
                                            location={job.location}
                                            image={job.logo}
                                            position={job.position}
                                            summary={job.summary}
                                        />
                                    ))}
                                </div>
                            </div>


                        </div>
                    </section>
                </section>

            </main>
        </div>
    );
}
