import type { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        name?: string | null
        email?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
    }
}

