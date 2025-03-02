"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export default function QuizStart() {
    const [countdown, setCountdown] = useState(3)
    const router = useRouter()
    const { status } = useSession()

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            router.push("/quiz/question/1")
        }
    }, [countdown, router])

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
        router.push("/auth/signin")
        return null
    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <h1 className="text-3xl font-bold mb-6">Are you Australia&apos;s leading marketing mind?</h1>
            <p className="text-xl mb-8">10 questions - 60 seconds</p>
            {countdown > 0 ? (
                <p className="text-6xl font-bold">{countdown}</p>
            ) : (
                <Button size="lg" onClick={() => router.push("/quiz/question/1")}>
                    Start Quiz
                </Button>
            )}
        </div>
    )
}

