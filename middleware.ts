import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jwt from "jsonwebtoken"

export function middleware(request: NextRequest) {
    const token = request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
        return NextResponse.json({ error: "Missing token" }, { status: 401 })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set("user", JSON.stringify(decoded))

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
}

export const config = {
    matcher: ["/api/scores/submit"],
}

