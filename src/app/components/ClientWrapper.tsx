"use client"

import { SessionProvider } from "next-auth/react"
import type React from "react"
import { NavContent } from "./NavContent"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <NavContent />
            {children}
        </SessionProvider>
    )
}

