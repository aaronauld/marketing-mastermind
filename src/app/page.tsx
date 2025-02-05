import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Marketing Mastermind</h1>
      <p className="text-xl text-center mb-8">The fun IQ Test for marketers, media and agency types</p>
      <div className="flex justify-center">
        <Link href="/play">
          <Button size="lg">Play Now!</Button>
        </Link>
      </div>
    </div>
  )
}

