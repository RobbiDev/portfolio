// General Imports
import Head from 'next/head';
import { Konkhmer_Sleokchher, Roboto } from 'next/font/google';
import Navbar from '@/components/Nav';
import { useState } from 'react';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

// Define fonts with specific configurations
const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] });
const primary = Roboto({ weight: ["700"], subsets: ['latin'] });
const secondary = Roboto({ weight: ["400"], subsets: ['latin'] });
const tertiary = Roboto({ weight: ["400"], subsets: ['latin'] });

export default function Home() {

    const currentPage = 'Contact';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/email-handler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            alert('Message sent!');
        } else {
            alert('Failed to send message.');
        }
    };

    return (
        <div>
            <Head>
                <title>Contact | Robert Johnson</title>
                <meta name="description" content="My Portfolio Website" />
            </Head>

            <main className={`container mx-auto ${primary.className} px-5 pb-10`}>
                {/* NavBar section */}
                <Navbar currentPage={currentPage} />

                <section>
                    <div className='flex flex-col space-y-8'>
                        <div className='flex flex-col text-left space-y-5'>
                            <h2 className="text-white text-3xl font-bold">Contact Me!</h2>
                            <p className="text-lg text-zinc-400">I'm excited to connect! Whether you're interested in discussing potential job opportunities, freelance work, or just want to network, feel free to reach out.</p>
                        </div>

                        <form action="#" onSubmit={handleSubmit} className="space-y-6 w-full flex flex-col">

                            <div className="flex flex-col">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Your email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg bg-[#222222] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-300">Subject</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="p-2 rounded-lg bg-[#222222] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="block mb-2 text-sm font-medium text-gray-300">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="p-2 h-32 rounded-lg bg-[#222222] text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button type="submit" className="py-2 px-4 bg-gradient text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">Send message</button>
                        </form>

                        <div className='flex flex-row space-x-4'>
                            <a href="https://www.linkedin.com/in/robby-johnson/" className="text-blue-400 hover:underline flex items-center space-x-2">
                                <FaLinkedin />
                                <span>LinkedIn</span>
                            </a>
                            <a href="https://github.com/RobbiDev" className="text-blue-400 hover:underline flex items-center space-x-2">
                                <FaGithub />
                                <span>GitHub</span>
                            </a>
                            <a href="https://www.instagram.com/robby.sql/" className="text-blue-400 hover:underline flex items-center space-x-2">
                                <FaInstagram />
                                <span>Instagram</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
