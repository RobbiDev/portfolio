import Image from 'next/image';
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google';
import Head from 'next/head';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import Navbar from '@/components/Nav';

import projects from '@/data/projects.json'

const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] });

export default function Home() {
    const nextPage = 'Experience';
    const currentPage = 'projects'

    // Filter projects where pinned is true
    const pinnedProjects = projects.filter(project => project.pinned);

    return (
        <div>
            <Head>
                <title>Projects | Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
            </Head>

            <main className={`container mx-auto ${Konkhmer.className} px-5 pb-10`}>
                <Navbar nextPage={nextPage} currentPage={currentPage} />

                {/* Pinned Projects Section */}
                <section className='flex flex-col lg:grid grid-cols-2 grid-row-1 gap-2'>
                    {pinnedProjects.map((project, index) => (
                        <ProjectCard
                            key={index}
                            date={project.date}
                            title={project.title}
                            views={project.views}
                            desc={project.description}
                            link={project.link}
                        />
                    ))}
                </section>

                {/* Divider */}
                <div className="w-full mt-5 h-px bg-zinc-800"></div>

                {/* Other Projects Section (not pinned) */}
                <section className='mt-5 border-t-3 flex flex-col space-y-2 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-2'>
                    {projects.map((project, index) => (
                        !project.pinned && (
                            <ProjectCard
                                key={index}
                                date={project.date}
                                title={project.title}
                                views={project.views}
                                desc={project.description}
                                link={project.link}
                            />
                        )
                    ))}
                </section>
            </main>
        </div>
    );
}