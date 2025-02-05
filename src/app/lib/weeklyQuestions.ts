import { mockQuestions } from "../lib/mockQuestions"

// Function to get the current week number
const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
    return weekNo
}

// Function to select 10 random questions for the week
export const getWeeklyQuestions = () => {
    const currentWeek = getWeekNumber(new Date())
    const seed = currentWeek * 31 // Use the week number as a seed for randomness

    // Fisher-Yates shuffle algorithm with seeded randomness
    const shuffled = [...mockQuestions]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor((((seed * (i + 1)) % 2147483647) / 2147483647) * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled.slice(0, 10)
}

