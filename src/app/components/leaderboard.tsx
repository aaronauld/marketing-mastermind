"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface LeaderboardEntry {
    id: string
    score: number
    time: number
    user: {
        name: string
        email: string
    }
}

interface LeaderboardProps {
    onClose: () => void
}

export function Leaderboard({ onClose }: LeaderboardProps) {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/api/leaderboard")
                const data = await response.json()
                setLeaderboardData(data.leaderboard)
            } catch (error) {
                console.error("Error fetching leaderboard:", error)
            }
        }

        fetchLeaderboard()
    }, [])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
                <h2 className="text-2xl font-bold mb-4">This Week&apos;s Leaderboard</h2>
                <div className="space-y-2">
                    {leaderboardData.map((entry, index) => (
                        <div key={entry.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span className="font-semibold">
                                {index + 1}. {entry.user.name}
                            </span>
                            <span>
                                Score: {entry.score} (Time: {entry.time}s)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

