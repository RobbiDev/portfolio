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
    // Filter jobs based on categories
    const softwareJobs = jobsData.filter(job => job.category === 'software');
    const generalJobs = jobsData.filter(job => job.category === 'general');

    return (
        <div className={`${Konkhmer.className}`}>
            <Head>
                <title>Projects | Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
            </Head>

            <main className={`container mx-auto ${Konkhmer.className} px-5 pb-10`}>
                {/* Header section */}
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

                {/* Main content section */}
                <section className='flex flex-col space-y-5 text-white text-2xl'>
                    <div className="flex space-y-5 flex flex-col">
                        {/* Software Engineering Jobs */}
                        <div>
                            <h1 className='mb-5'>Software Engineering</h1>
                            <div className='flex flex-col space-y-5'>
                                {softwareJobs.map((job, index) => (
                                    <JobCard
                                        key={index}
                                        date={job.date}
                                        year={job.time}
                                        company={job.company}
                                        location={job.location}
                                        image={job.logo}
                                        position={job.position}
                                        bullet={job.bulletpoints}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* General Jobs */}
                        <div>
                            <h1 className='mb-5'>General Jobs</h1>
                            <div className='flex flex-col space-y-5'>
                                {generalJobs.map((job, index) => (
                                    <JobCard
                                        key={index}
                                        date={job.date}
                                        year={job.time}
                                        company={job.company}
                                        location={job.location}
                                        image={job.logo}
                                        position={job.position}
                                        bullet={job.bulletpoints}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
