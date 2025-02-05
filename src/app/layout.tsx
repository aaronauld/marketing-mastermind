import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import "./globals.css"
import type React from "react" // Added import for React

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marketing Mastermind",
  description: "Test your marketing knowledge with our fun IQ Test!",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-xl font-bold">
                Marketing Mastermind
              </Link>
              <div className="space-x-4">
                <Link href="/play">
                  <Button variant="ghost">Play Now</Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="ghost">Register</Button>
                </Link>
              </div>
            </div>
          </nav>
          <main className="min-h-screen bg-gray-100">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}

