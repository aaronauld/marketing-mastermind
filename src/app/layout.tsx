import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClientWrapper } from "./components/ClientWrapper"
import "./globals.css"
import type React from "react"
import { Footer } from "./components/Footer"

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
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ClientWrapper>
          <main className="flex-1 bg-gray-100">{children}</main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  )
}

