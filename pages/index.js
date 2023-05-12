import Image from 'next/image'
import { Inter, Signika, Konkhmer_Sleokchher } from 'next/font/google'
import Head from 'next/head'

const Konkhmer = Konkhmer_Sleokchher({ weight: ["400"], subsets: ['latin'] })
import chip from '@/assets/ComputerChip.svg'
import HorizLine from '@/assets/Left.svg'
import VertLine from '@/assets/VertLine.svg'
import TopChip from '@/assets/TopChip.svg'

import ChipComponent from '@/assets/Component.svg'
import MiddleChip from '@/assets/MiddleChip.svg'
import Line from '@/assets/Line.svg'


export default function Home() {
  return (
    <main className={`${Konkhmer.className}`}>
      <Head>
        <title>Robert Johnson</title>
        <meta name="description" content="My Portfolio Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section id="main" className={`relative h-screen w-screen flex flex-col items-center unselectable overflow-hidden `}>
        <Image className={`hidden sm:block`} src={TopChip} />
        <div className={`flex flex-row justify-between gap-10`}>
          <Image className={`w-full`} src={Line} />
          <Image className={``} src={Line} />
          <Image className={``} src={Line} />
          <Image className={``} src={Line} />
          <Image className={``} src={Line} />
          <Image className={``} src={Line} />
          <Image className={``} src={Line} />
          <Image className={``} src={Line} />
        </div>
        <div className={`flex flex-row justify-between gap-7`}>
          <Image className={``} src={ChipComponent} />
          <Image className={``} src={ChipComponent} />
          <Image className={``} src={ChipComponent} />
          <Image className={``} src={ChipComponent} />
          <Image className={``} src={ChipComponent} />
          <Image className={``} src={ChipComponent} />
          <Image className={``} src={ChipComponent} />
          <Image className={``} src={ChipComponent} />
        </div>
        <div className={` flex justify-center px-10`}>
          <Image className={`max-w-full h-auto object-none object-right`} src={HorizLine} />
          <Image className={``} src={MiddleChip} />
          <Image className={`max-w-full h-auto object-none object-right rotate-180`} src={HorizLine} />
        </div>
        <div className={`flex flex-col items-center rotate-180`}>
          <div className={`flex flex-row justify-between gap-10`}>
            <Image className={``} src={Line} />
            <Image className={``} src={Line} />
            <Image className={``} src={Line} />
            <Image className={``} src={Line} />
            <Image className={``} src={Line} />
            <Image className={``} src={Line} />
            <Image className={``} src={Line} />
            <Image className={``} src={Line} />
          </div>
          <div className={`flex flex-row justify-between gap-7`}>
            <Image className={``} src={ChipComponent} />
            <Image className={``} src={ChipComponent} />
            <Image className={``} src={ChipComponent} />
            <Image className={``} src={ChipComponent} />
            <Image className={``} src={ChipComponent} />
            <Image className={``} src={ChipComponent} />
            <Image className={``} src={ChipComponent} />
            <Image className={``} src={ChipComponent} />
          </div>
        </div>
      </section>







      {/* <section id="main" className={`relative h-screen w-screen flex flex-col items-center overflow-hidden unselectable `}>
        <Image className={``} src={TopChip} />
        <div className={` flex flex-col justify-center items-center unselectable p-5 sm:p-0`}>

          <Image className={`px-4 sm:px-0`} src={VertLine} />
          <div className={`flex justify-center`}>
            <Image className={` `} src={HorizLine} />
            <Image className={` `} src={chip} />
            <Image className={` `} src={HorizLine} />
          </div>
          <Image className={` `} src={VertLine} />
        </div>
      </section> */}

    </main>
  )
}
