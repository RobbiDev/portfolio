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
 * @component
 * @returns {JSX.Element} Home component
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
                        <a href='/'>making/things/better<span className='gradient'>/experience</span></a>
                    </div>
                    <nav className='flex flex-row justify-between space-x-5 text-gray-400'>
                        <a href='/'>Home</a>
                        <a href='/projects'>Projects</a>
                        <a href='/contact'>Contact</a>
                    </nav>
                </header>

                <section className='flex flex-col lg:flex-row lg:space-x-5'>
                    {/* About section */}
                    <section className='flex flex-col pb-5 lg:pb-0 max-h-screen space-y-5'>
                        <h1 className='text-white text-lg'>ABOUT</h1>
                        <div>
                            <p className='font-md text-zinc-400'>
                                Experienced professional with a passion
                                for making things better through problem-
                                solving and system design. Utilizes
                                technical expertise and innovative
                                thinking to drive growth and efficiency.
                                Committed to the value of "Making it
                                better" in all endeavors.
                            </p>
                        </div>
                        {/* Skills section */}
                        <div className='hidden lg:flex flex-col space-y-5 pb-5 lg:mb-0'>
                            <h1 className='text-white text-lg'>SKILLS</h1>
                            <div className='flex flex-row lg:flex-col space-x-5 lg:space-x-0 lg:space-y-5 text-zinc-300'>
                                <div className='flex flex-col space-y-2'>
                                    <h2 className='font-bold text-md'>General</h2>
                                    <ul className='flex flex-col space-y-1 text-zinc-400 font-extralight'>
                                        <li>Project Management Tools</li>
                                        <li>Testing & Deployment</li>
                                        <li>Software Development</li>
                                        <li>Problem Solving</li>
                                        <li>Communication/Teamwork</li>
                                    </ul>
                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <h2 className='font-bold text-md'>Tools/Frameworks</h2>
                                    <ul className='flex flex-col space-y-1 text-zinc-400 font-extralight'>
                                        <li>AWS/Azure/Google Cloud</li>
                                        <li>Microsoft & Google Products</li>
                                        <li>Atlassian Cloud Products</li>
                                        <li>MongoDB & MySQL</li>
                                        <li>NodeJS & ExpressJS</li>
                                        <li>TailwindCSS</li>
                                    </ul>
                                </div>
                                <div className='flex flex-col space-y-2'>
                                    <h2 className='font-bold text-md'>Languages</h2>
                                    <ul className='flex flex-col space-y-1 text-zinc-400 font-extralight'>
                                        <li>CSS/HTML</li>
                                        <li>Python</li>
                                        <li>JavaScript/TypeScript</li>
                                        <li>C, C++, & C#</li>
                                        <li>Java & .NET</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Experience section */}
                    <section className='flex flex-col space-y-5 text-white'>
                        <div>
                            <h1 className='mb-5 text-lg'>EXPERIENCE</h1>
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
                    </section>
                </section>
            </main>
        </div>
    );
}
