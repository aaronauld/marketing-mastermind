"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PlayNow() {
    const { data: session, status } = useSession()
    const router = useRouter()

    const handleStartQuiz = () => {
        if (session) {
            router.push("/quiz/start")
        } else {
            router.push("/auth/register")
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">Welcome to Marketing Master Mind</h1>
            <p className="text-lg text-center mb-6">
                Fancy your marketing knowledge? Then why not test yourself and challenge your friends and peers to beat you?
            </p>
            <p className="text-md text-center mb-8">
                It only takes 1 minute. You have 10 multiple choice questions to complete. The questions are drawn randomly from
                an ever-growing pool, so nobody gets the same questions each time they take the test.
            </p>
            <p className="text-md text-center mb-10">
                The person with the highest score in the shortest time goes to the top of the Leader Board. At the end of each
                week the leader will receive a prize and will be announced on our LinkedIn page. A new competition starts each
                week.
            </p>
            <div className="flex justify-center mt-8">
                <Button size="lg" onClick={handleStartQuiz}>
                    {status === "loading" ? "Loading..." : session ? "Start Quiz" : "Register and Start Quiz"}
                </Button>
            </div>
        </div>
    )
}
