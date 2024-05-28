import { useState } from 'react';


/**
 * Navbar component for displaying categorized job listings.
 * @component
 * @param {string} page - Makes the navbar show the proper oppsite page name 
 * @returns {JSX.Element} Navbar component
 */
export default function Navbar({ nextPage, currentPage }) {

    const [isOpen, setIsOpen] = useState(false);
    const link = `/${nextPage}`.toLocaleLowerCase()

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className='py-7 border-b-2 border-zinc-800 mb-10'>
            <div className='flex flex-wrap items-center md:flex-row text-lg justify-between text-white '>
                <div className='text-gray-400'>
                    <a href='/' className=''>making/things/better<span className='gradient'>/{currentPage}</span></a>
                </div>
                <button
                    onClick={toggleMenu}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg md:hidden "
                    aria-controls="navbar-default"
                    aria-expanded={isOpen ? 'true' : 'false'}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`md:flex flex-row w-full md:w-auto ${isOpen ? '' : 'hidden'}`} id="navbar-default">
                    <ul className="font-medium flex flex-row pt-4 md:p-0 space-x-5 border-t-2 border-zinc-800 md:border-0 pt-7 mt-7 justify-center  md:space-x-8  md:mt-0 text-gray-400 ">
                        <li>
                            <a href="/" className="" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href={link} className="">{nextPage}</a>
                        </li>
                        <li>
                            <a href="/contact" className="">Contact</a>
                        </li>
                    </ul>
                </div>
            </div>

        </header>
    );
}
