import type { ReactNode } from "react"
import { QuizController } from "./quiz-controller"

export default function QuizLayout({ children }: { children: ReactNode }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <QuizController>{children}</QuizController>
        </div>
    )
}

