import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import RMATA from "../assets/RMATA.svg"; // Replace this with the path to your image

export default function Home() {
  return (
    <main className="Konkhmer">
      <Head>
        <title>Robert Johnson</title>
        <meta name="description" content="My Portfolio Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Main Container */}
      <div className="flex justify-center items-center h-screen overflow-hidden relative home-bg">
        {/* Logo and Lines */}
        <div className="relative flex flex-col items-center">
          {/* Logo */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <Image src={RMATA} alt="Robert Johnson" width={200} height={200} className="drop-shadow-md shadow-black rounded-xl"/>
              {/* First Line */}
              <div className="absolute h-6 bg-[#F7941D] border-white left-full top-[calc(50%-25px)] animate-expand-line"></div>

              {/* Second Line */}
              <div className="absolute h-6 bg-[#A1A2A1] border-white left-full top-[calc(50%-3px)] animate-expand-line"></div>

              {/* Third Line */}
              <div className="absolute h-6 bg-[#0076C0] border-white left-full top-[calc(50%+20px)] animate-expand-line"></div>

            </div>

            <div className="flex flex-row items-center space-x-5 font-geist text-white font-bold text-lg md:text-xl">
              <a href="/projects">projects</a>
              <a href="/contact">contact</a>
              <a href="/experience">about</a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}


