"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useQuiz } from "../quiz-controller"
import { useSession } from "next-auth/react"

export default function QuizFinish() {
    const { score, timeLeft } = useQuiz()
    const [time, setTime] = useState("00:00")
    const router = useRouter()
    const { status } = useSession()

    useEffect(() => {
        const timeTaken = 60 - timeLeft
        const minutes = Math.floor(timeTaken / 60)
        const seconds = timeTaken % 60
        setTime(`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`)
    }, [timeLeft])

    const handleSubmitScore = () => {
        // Score is already submitted in the QuizController
        router.push("/leaderboard")
    }

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
        router.push("/auth/signin")
        return null
    }

    return (
        <div className="h-full flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-6">Quiz Completed!</h1>
            <p className="text-xl mb-4">
                You Scored: {score} / 10 in {time}
            </p>
            <p className="text-lg mb-6">Ranking: Marketing Contender</p>
            <Button onClick={handleSubmitScore}>View Leaderboard</Button>
        </div>
    )
}

