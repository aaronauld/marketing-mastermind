import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: Request) {
    try {
        const currentDate = new Date()
        const currentWeek = Math.ceil((currentDate.getDate() - currentDate.getDay() + 1) / 7)

        const leaderboard = await prisma.score.findMany({
            where: {
                week: currentWeek,
            },
            orderBy: [{ score: "desc" }, { time: "asc" }],
            take: 10,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        })

        return NextResponse.json({ leaderboard })
    } catch (error) {
        console.error("Leaderboard fetch error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

