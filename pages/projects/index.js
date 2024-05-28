import Image from 'next/image';
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google';
import Head from 'next/head';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import Navbar from '@/components/Nav';

const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] });

export default function Home() {
    const page = 'Experience';

    return (
        <div>
            <Head>
                <title>Projects | Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
            </Head>

            <main className={`container mx-auto ${Konkhmer.className} px-5 pb-10`}>
                <Navbar page={page} />

                <section className='flex flex-col lg:grid grid-cols-2 grid-row-1 gap-2'>
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={"ImDragonsAPI"} desc={"An API that allows for instant access to a massive database of information regarding the band Imagine Dragons!"} />
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={""} desc={"An automatic system that helps monitor all fryers within the store and keeps track of deep cleanings (Boil Out)"} />
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={"robbyj.dev"} desc={"An automatic system that helps monitor all fryers within the store and keeps track of deep cleanings (Boil Out)"} />
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={"Grandover Project"} desc={`A full-stack application designed specifically to enhance the operations of Chick-Fil-A at Grandover Village.`} />
                </section>

                <div className="w-full mt-5 h-px bg-zinc-800"></div>

                <section className='mt-5 border-t-3 bgflex flex-col lg:grid grid-cols-3 gap-2'>
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={"Grandover"} desc={`A full-stack application designed specifically to enhance the operations of Chick-Fil-A at Grandover Village.`} />
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={"ImDragons.JS"} desc={"An API that allows for instant access to a massive database of information regarding the band Imagine Dragons!"} />
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={"Boil-Out Control"} desc={"An automatic system that helps monitor all fryers within the store and keeps track of deep cleanings (Boil Out)"} />
                    <ProjectCard date={"April 26th, 2023"} views={"440"} title={"www.robbyj.dev"} />
                </section>
            </main>
        </div>
    );
}
