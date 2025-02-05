import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" })

        return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

