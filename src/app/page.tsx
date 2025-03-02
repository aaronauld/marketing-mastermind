"use client"

import Link from "next/link"
import Image from "next/image"

const mmmquizIntro = "/test.png"

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <div className="relative w-full aspect-[16/9] max-w-5xl">
        <Image
          src={mmmquizIntro || "/placeholder.svg"}
          alt="Marketing Mastermind - The exciting mind game to challenge your marketing skills!"
          fill
          priority
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
        />

        <Link
          href="/play"
          className="absolute bottom-[12%] right-[11%] w-[31%] h-[20%] bg-transparent hover:bg-white/20 transition-colors duration-300 rounded-md cursor-pointer z-10"
          aria-label="Play Now!"
        />
      </div>
    </div>
  )
}

