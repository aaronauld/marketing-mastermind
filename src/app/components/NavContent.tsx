"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavContent() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <div>Loading...</div>
    }

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Marketing Mastermind
                </Link>
                <div className="space-x-4">
                    <Link href="/play">
                        <Button variant="ghost">Play Now</Button>
                    </Link>
                    {session ? (
                        <>
                            <span className="mr-4">Welcome, {session.user?.name || session.user?.email}</span>
                            <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin">
                                <Button variant="ghost">Sign In</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button variant="ghost">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

