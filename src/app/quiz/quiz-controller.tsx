"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Trophy, MessageSquarePlus, Share2 } from "lucide-react"
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
    const [weeklyQuestions, setWeeklyQuestions] = useState<any[]>([]) // Replace 'any' with your actual question type
    const router = useRouter()
    const [showQuestionForm, setShowQuestionForm] = useState(false)
    const [showChallengeForm, setShowChallengeForm] = useState(false)
    const [showLeaderboard, setShowLeaderboard] = useState(false)
    const { data: session, status } = useSession()

    useEffect(() => {
        setWeeklyQuestions(getWeeklyQuestions())
    }, [])

    useEffect(() => {
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
    }, [])

    const checkAnswer = (selectedIndex: number) => {
        const isCorrect = weeklyQuestions[currentQuestion].a[selectedIndex].correct
        if (isCorrect) {
            setScore((prevScore) => prevScore + 1)
        }
        return isCorrect
    }

    const nextQuestion = () => {
        if (currentQuestion < weeklyQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            setIsQuizFinished(true)
        }
    }

    const restartQuiz = () => {
        setCurrentQuestion(0)
        setTimeLeft(60)
        setIsQuizFinished(false)
        setScore(0)
        router.push("/quiz/question/1")
    }

    const toggleSound = () => {
        setIsSoundOn(!isSoundOn)
        // Here you would implement the actual sound toggling logic
    }

    const openLeaderboard = () => {
        setShowLeaderboard(true)
    }

    const postQuestion = () => {
        setShowQuestionForm(true)
    }

    const handleQuestionSubmit = (formData: QuestionFormData) => {
        // Here you would typically send the form data to your backend
        console.log("Submitted question:", formData)
        setShowQuestionForm(false)
        // Optionally, show a success message to the user
    }

    const challengeFriends = () => {
        setShowChallengeForm(true)
    }

    const handleChallengeFriends = (email: string) => {
        // In a real application, this would be handled by a backend service
        const quizLink = `${window.location.origin}/quiz`
        console.log(`Sending challenge to ${email} with quiz link: ${quizLink}`)
        // Here you would typically send an API request to your backend to handle the email sending
        setShowChallengeForm(false)
        // Optionally, show a success message to the user
    }

    const submitScore = async () => {
        if (status !== "authenticated" || !session?.user?.id) {
            console.error("User not authenticated")
            return
        }

        try {
            const response = await fetch("/api/scores/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ score, time: 60 - timeLeft }),
            })
            const data = await response.json()
            if (response.ok) {
                console.log("Score submitted successfully")
                setShowLeaderboard(true)
            } else {
                console.error("Error submitting score:", data.error)
            }
        } catch (error) {
            console.error("Error submitting score:", error)
        }
    }

    useEffect(() => {
        if (isQuizFinished) {
            submitScore()
        }
    }, [isQuizFinished])

    if (status === "loading") {
        return <div>Loading...</div>
    }

    if (status === "unauthenticated") {
        router.push("/auth/signin")
        return null
    }

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
            }}
        >
            <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-100">
                {/* Quiz Window */}
                <div className="absolute top-4 right-4 w-2/3 h-2/3 bg-white shadow-lg rounded-lg overflow-hidden">
                    {/* Question Counter - Top Left */}
                    <div className="absolute top-2 left-2 bg-gray-100 p-2 rounded shadow">
                        <div className="text-sm font-bold">
                            Question {currentQuestion + 1} of {weeklyQuestions.length}
                        </div>
                    </div>

                    {/* Timer - Top Right */}
                    <div className="absolute top-2 right-2 bg-gray-100 p-2 rounded shadow">
                        <div className="text-sm">Time left: {timeLeft}s</div>
                    </div>

                    <div className="p-6 pt-14 h-full overflow-y-auto">{children}</div>
                </div>

                {/* External Buttons */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
                    <Button onClick={openLeaderboard} className="flex-1">
                        <Trophy className="mr-2 h-4 w-4" /> Leaderboard
                    </Button>
                    <Button onClick={postQuestion} className="flex-1">
                        <MessageSquarePlus className="mr-2 h-4 w-4" /> Post a Question
                    </Button>
                    <Button onClick={challengeFriends} className="flex-1">
                        <Share2 className="mr-2 h-4 w-4" /> Challenge Friends
                    </Button>
                    <Button onClick={toggleSound} className="flex-1">
                        {isSoundOn ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
                        Sound {isSoundOn ? "On" : "Off"}
                    </Button>
                </div>

                {showQuestionForm && (
                    <QuestionForm onClose={() => setShowQuestionForm(false)} onSubmit={handleQuestionSubmit} />
                )}

                {showChallengeForm && (
                    <ChallengeFriendsForm onClose={() => setShowChallengeForm(false)} onSubmit={handleChallengeFriends} />
                )}

                {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
            </div>
        </QuizContext.Provider>
    )
}

