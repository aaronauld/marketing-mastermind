"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useQuiz } from "../../quiz-controller"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function QuestionPage() {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const { currentQuestion, checkAnswer, nextQuestion, isQuizFinished, score, totalQuestions, weeklyQuestions } =
        useQuiz()
    const { status } = useSession()
    const router = useRouter()

    const handleAnswer = (index: number) => {
        if (isAnswered || isQuizFinished) return
        setSelectedAnswer(index)
        const correct = checkAnswer(index)
        setIsCorrect(correct)
        setIsAnswered(true)
    }

    const handleNext = () => {
        nextQuestion()
        setSelectedAnswer(null)
        setIsAnswered(false)
    }

    const getLevel = (score: number, totalQuestions: number) => {
        const percentage = (score / totalQuestions) * 100
        if (percentage === 100) return "Marketing Ready"
        if (percentage >= 80) return "Marketing Contender"
        if (percentage >= 50) return "Marketing Amateur"
        if (percentage > 0) return "Marketing Novice"
        return "Stay in school, kid..."
    }

    const question = weeklyQuestions[currentQuestion]

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
        router.push("/auth/signin")
        return null
    }

    if (!question) return null

    if (isQuizFinished) {
        return (
            <div className="h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">Quiz Finished!</h2>
                <p className="text-xl mb-4">
                    Your Score: {score} / {totalQuestions}
                </p>
                <p className="text-lg mb-6">Level: {getLevel(score, totalQuestions)}</p>
                <Button onClick={() => router.push("/quiz/start")}>Try Again</Button>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div>
                <h1 className="text-2xl font-bold mb-6">{question.q}</h1>
                <div className="space-y-4">
                    {question.a.map((answer: any, index: number) => (
                        <Button
                            key={index}
                            variant={selectedAnswer === index ? (isCorrect ? "default" : "destructive") : "outline"}
                            className="w-full text-left justify-start"
                            onClick={() => handleAnswer(index)}
                            disabled={isAnswered || isQuizFinished}
                        >
                            {answer.option}
                        </Button>
                    ))}
                </div>
                {isAnswered && (
                    <div className={`mt-4 p-2 rounded ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {isCorrect ? "Correct!" : "Incorrect!"}
                    </div>
                )}
            </div>
            {isAnswered && !isQuizFinished && (
                <Button onClick={handleNext} className="mt-4">
                    Next Question
                </Button>
            )}
        </div>
    )
}

