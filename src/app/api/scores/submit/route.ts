import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { score, time } = await req.json()
        const userId = session.user.id

        const currentDate = new Date()
        const currentWeek = Math.ceil((currentDate.getDate() - currentDate.getDay() + 1) / 7)

        const newScore = await prisma.score.create({
            data: {
                score,
                time,
                userId,
                week: currentWeek,
            },
        })

        return NextResponse.json({ score: newScore })
    } catch (error) {
        console.error("Score submission error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

