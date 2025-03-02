"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Trophy, MessageSquarePlus, Share2, RotateCcw } from "lucide-react"
import { getWeeklyQuestions } from "../lib/weeklyQuestions"
import { QuestionForm, type QuestionFormData } from "../components/question-form"
import { ChallengeFriendsForm } from "../components/challenge-friends-form"
import { Leaderboard } from "../components/leaderboard"

type QuizContextType = {
    currentQuestion: number
    setCurrentQuestion: (question: number) => void
    timeLeft: number
    isQuizFinished: boolean
    checkAnswer: (selectedIndex: number) => boolean
    nextQuestion: () => void
    score: number
    setScore: (score: number) => void
    totalQuestions: number
    weeklyQuestions: any[] // Replace 'any' with your actual question type
    restartQuiz: () => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const useQuiz = () => {
    const context = useContext(QuizContext)
    if (!context) {
        throw new Error("useQuiz must be used within a QuizProvider")
    }
    return context
}

export function QuizController({ children }: { children: ReactNode }) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [timeLeft, setTimeLeft] = useState(60)
    const [isQuizFinished, setIsQuizFinished] = useState(false)
    const [isSoundOn, setIsSoundOn] = useState(true)
    const [score, setScore] = useState(0)
    const [weeklyQuestions, setWeeklyQuestions] = useState<any[]>([])
    const router = useRouter()
    const [showQuestionForm, setShowQuestionForm] = useState(false)
    const [showChallengeForm, setShowChallengeForm] = useState(false)
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const { data: session, status } = useSession()

    // Load questions on mount
    useEffect(() => {
        const questions = getWeeklyQuestions()
        setWeeklyQuestions(questions)
    }, [])

    // Countdown timer logic
    useEffect(() => {
        if (isQuizFinished || timeLeft === 0) return

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer)
                    setIsQuizFinished(true)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, isQuizFinished])

    // Handle answer selection
    const checkAnswer = (selectedIndex: number) => {
        if (!weeklyQuestions[currentQuestion]) return false
        const isCorrect = weeklyQuestions[currentQuestion].a[selectedIndex]?.correct
        if (isCorrect) {
            setScore((prevScore) => prevScore + 1)
        }
        return isCorrect
    }

    // Move to the next question
    const nextQuestion = () => {
        if (currentQuestion < weeklyQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1)
        } else {
            setIsQuizFinished(true)
        }
    }

    // Restart the quiz
    const restartQuiz = () => {
        setCurrentQuestion(0)
        setTimeLeft(60)
        setIsQuizFinished(false)
        setScore(0)
        router.push("/quiz/start")
    }

    const handleQuestionSubmit = (formData: QuestionFormData) => {
        // Here you would typically send the form data to your backend
        console.log("Submitted question:", formData)
        setShowQuestionForm(false)
        // Optionally, show a success message to the user
    }

    const handleChallengeFriends = (email: string) => {
        // In a real application, this would be handled by a backend service
        const quizLink = `${window.location.origin}/quiz`
        console.log(`Sending challenge to ${email} with quiz link: ${quizLink}`)
        // Here you would typically send an API request to your backend to handle the email sending
        setShowChallengeForm(false)
        // Optionally, show a success message to the user
    }

    // Submit score when quiz is finished
    useEffect(() => {
        if (isQuizFinished) {
            submitScore()
        }
    }, [isQuizFinished])

    const submitScore = async () => {
        if (status !== "authenticated" || !session?.user?.id) {
            console.error("User not authenticated", { status, session })
            return
        }

        try {
            const response = await fetch("/api/scores/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score, time: 60 - timeLeft }),
                credentials: "include",
            })

            if (response.ok) {
                setShowLeaderboard(true)
            } else {
                console.error("Error submitting score:", await response.json())
            }
        } catch (error) {
            console.error("Error submitting score:", error)
        }
    }

    // Handle authentication
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        }
    }, [status, router])

    if (status === "loading") return <div>Loading...</div>

    return (
        <QuizContext.Provider
            value={{
                currentQuestion,
                setCurrentQuestion,
                timeLeft,
                isQuizFinished,
                checkAnswer,
                nextQuestion,
                score,
                setScore,
                totalQuestions: weeklyQuestions.length,
                weeklyQuestions,
                restartQuiz,
            }}
        >
            <div className="relative w-full h-[calc(100vh-15rem)] bg-gray-100">
                <div className="absolute top-4 right-4 w-3/5 h-4/5 bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="absolute top-2 left-2 bg-gray-100 p-2 rounded shadow">
                        <div className="text-sm font-bold">
                            Question {currentQuestion + 1} of {weeklyQuestions.length}
                        </div>
                    </div>

                    <div className="absolute top-2 right-2 bg-gray-100 p-2 rounded shadow">
                        <div className="text-sm">Time left: {timeLeft}s</div>
                    </div>

                    <div className="p-6 pt-14 h-full overflow-y-auto">{children}</div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-10">
                    <Button className="flex-1" onClick={restartQuiz}><RotateCcw />Restart Quiz</Button>
                    <Button className="flex-1" onClick={() => setShowLeaderboard(true)}><Trophy /> Leaderboard</Button>
                    <Button className="flex-1" onClick={() => setShowQuestionForm(true)}><MessageSquarePlus /> Post a Question</Button>
                    <Button className="flex-1" onClick={() => setShowChallengeForm(true)}><Share2 /> Challenge Friends</Button>
                    <Button className="flex-1" onClick={() => setIsSoundOn(!isSoundOn)}>{isSoundOn ? <Volume2 /> : <VolumeX />} Sound</Button>
                </div>


                {showQuestionForm && <QuestionForm onClose={() => setShowQuestionForm(false)} onSubmit={handleQuestionSubmit} />}
                {showChallengeForm && <ChallengeFriendsForm onClose={() => setShowChallengeForm(false)} onSubmit={handleChallengeFriends} />}
                {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
            </div>
        </QuizContext.Provider>
    )
}
