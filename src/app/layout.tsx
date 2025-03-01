import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClientWrapper } from "./components/ClientWrapper"
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
        <ClientWrapper>
          <main className="min-h-screen bg-gray-100">{children}</main>
        </ClientWrapper>
      </body>
    </html>
  )
}

