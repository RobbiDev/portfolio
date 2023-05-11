import Image from 'next/image'
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google'

const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] })

export default function Home() {
  return (
    <main className={`container mx-auto flex justify-center ${Konkhmer.className}`}>
      <header className={`h-screen flex flex-col justify-center`}>
        <nav className={` z-10 flex flex-rol justify-between text-gray-300`}>
          <a href='/projects'>Projects</a>
          <a href='/contact'>Contact</a>
          <a href='/experience'>Experience</a>
        </nav>
        <div>
          <a className={`z-0 text-5xl unselectable text-[#FF5757]`}>Robert Johnson</a>
        </div>
        <div className={`z-10 flex flex-row justify-between`}>
          <p className={`text-gray-300`}>Software Engineer</p>
          <p>18</p>
        </div>
      </header>
    </main>
  )
}
